import type { APIRoute } from "astro";
import connect from "@/lib/connection";
import { bunnyStorageService } from "@/lib/bunny-cdn";
import Post from "@/model/Post";
import UserDetails from "@/model/User";

const headers = {
  "Content-Type": "application/json",
};

const DEFAULT_POST_AVATAR = "/images/post_img.png";
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const POST_VISIBILITY_VALUES = new Set(["Public", "Friends", "Only Me"]);
const BUNNY_PUBLIC_BASE_URL = process.env.BUNNY_PUBLIC_BASE_URL?.replace(
  /\/+$/,
  "",
);

function sanitizeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
}

function createDataUrl(bytes: Buffer, mimeType: string) {
  return `data:${mimeType};base64,${bytes.toString("base64")}`;
}

async function storePostImage(file: File) {
  const mimeType = file.type || "application/octet-stream";
  const bytes = Buffer.from(await file.arrayBuffer());

  if (!BUNNY_PUBLIC_BASE_URL) {
    return createDataUrl(bytes, mimeType);
  }

  const safeFileName = sanitizeFileName(file.name || "post-image");
  const destinationPath = `posts/${Date.now()}-${safeFileName}`;

  try {
    await bunnyStorageService.uploadFile(destinationPath, bytes, mimeType);
    return `${BUNNY_PUBLIC_BASE_URL}/${destinationPath}`;
  } catch {
    return createDataUrl(bytes, mimeType);
  }
}

function serializePost(postDocument: any) {
  const post = typeof postDocument.toJSON === "function"
    ? postDocument.toJSON()
    : postDocument;

  return {
    id: String(post.id ?? post._id),
    author: {
      id: String(post.author?.id ?? ""),
      name: String(post.author?.name ?? ""),
      avatar: String(post.author?.avatar ?? DEFAULT_POST_AVATAR),
    },
    title: String(post.title ?? ""),
    image: post.image ? String(post.image) : undefined,
    visibility: String(post.visibility ?? "Public"),
    time: String(post.time ?? post.createdAt ?? new Date().toISOString()),
    createdAt: post.createdAt
      ? new Date(post.createdAt).toISOString()
      : new Date().toISOString(),
    updatedAt: post.updatedAt
      ? new Date(post.updatedAt).toISOString()
      : undefined,
    reactionCount: Number(post.reactionCount ?? 0),
    commentCount: Number(post.commentCount ?? 0),
    shareCount: Number(post.shareCount ?? 0),
    commentPreview: post.commentPreview
      ? String(post.commentPreview)
      : undefined,
    topReactions: Array.isArray(post.topReactions) ? post.topReactions : [],
  };
}

export const GET: APIRoute = async () => {
  try {
    await connect();

    const posts = await Post.find().sort({ createdAt: -1 });

    return new Response(
      JSON.stringify({
        posts: posts.map(serializePost),
      }),
      {
        status: 200,
        headers,
      },
    );
  } catch (error) {
    console.error("Fetch posts error:", error);

    return new Response(
      JSON.stringify({
        message: "Failed to fetch posts",
      }),
      {
        status: 500,
        headers,
      },
    );
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const authorId = String(formData.get("authorId") ?? "").trim();
    const title = String(formData.get("title") ?? "").trim();
    const visibilityValue = String(formData.get("visibility") ?? "Public").trim();
    const visibility = POST_VISIBILITY_VALUES.has(visibilityValue)
      ? visibilityValue
      : "Public";
    const imageInput = formData.get("image");

    if (!authorId) {
      return new Response(
        JSON.stringify({
          message: "Author is required",
        }),
        {
          status: 400,
          headers,
        },
      );
    }

    if (!title) {
      return new Response(
        JSON.stringify({
          message: "Post text is required",
        }),
        {
          status: 400,
          headers,
        },
      );
    }

    await connect();

    const user = await UserDetails.findById(authorId);

    if (!user) {
      return new Response(
        JSON.stringify({
          message: "User not found",
        }),
        {
          status: 404,
          headers,
        },
      );
    }

    let image: string | undefined;

    if (imageInput instanceof File && imageInput.size > 0) {
      if (!imageInput.type.startsWith("image/")) {
        return new Response(
          JSON.stringify({
            message: "Only image files are allowed",
          }),
          {
            status: 400,
            headers,
          },
        );
      }

      if (imageInput.size > MAX_IMAGE_SIZE_BYTES) {
        return new Response(
          JSON.stringify({
            message: "Image size must be 5MB or smaller",
          }),
          {
            status: 400,
            headers,
          },
        );
      }

      image = await storePostImage(imageInput);
    }

    const authorName =
      `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() ||
      String(user.email).split("@")[0];
    const now = new Date().toISOString();

    const post = await Post.create({
      author: {
        id: String(user._id),
        name: authorName,
        avatar: DEFAULT_POST_AVATAR,
      },
      title,
      image,
      visibility,
      time: now,
      reactionCount: 0,
      commentCount: 0,
      shareCount: 0,
      topReactions: [],
    });

    return new Response(
      JSON.stringify({
        message: "Post created successfully",
        post: serializePost(post),
      }),
      {
        status: 201,
        headers,
      },
    );
  } catch (error) {
    console.error("Create post error:", error);

    return new Response(
      JSON.stringify({
        message: "Failed to create post",
      }),
      {
        status: 500,
        headers,
      },
    );
  }
};

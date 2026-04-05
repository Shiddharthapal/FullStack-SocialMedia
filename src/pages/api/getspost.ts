import type { APIRoute } from "astro";
import connect from "@/lib/connection";
import { bunnyStorageService } from "@/lib/bunny-cdn";
import Post from "@/model/post";
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
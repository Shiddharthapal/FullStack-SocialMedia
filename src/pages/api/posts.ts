import type { APIRoute } from "astro";
import connect from "@/lib/connection";
import { bunnyStorageService } from "@/lib/bunny-cdn";
import Posts from "@/model/post";
import UserDetails from "@/model/User";
import crypto from "crypto";

const BUNNY_STORAGE_ZONE_NAME =
  process.env.BUNNY_STORAGE_ZONE_NAME || "side-effects";
const BUNNY_STORAGE_REGION_HOSTNAME =
  process.env.BUNNY_STORAGE_REGION_HOSTNAME || "storage.bunnycdn.com";
const BUNNY_STORAGE_API_KEY =
  process.env.BUNNY_STORAGE_API_KEY ||
  "9beb8922-fe4f-436f-8a74be6eea5e-a625-4332";

const headers = {
  "Content-Type": "application/json",
};

const DEFAULT_POST_AVATAR = "/images/post_img.png";
const POST_VISIBILITY_VALUES = new Set(["Public", "Friends", "Only Me"]);
const BUNNY_PUBLIC_BASE_URL = process.env.BUNNY_PUBLIC_BASE_URL?.replace(
  /\/+$/,
  "",
);
const MAX_FILE_SIZE = 10 * 1024 * 1024;


function sanitizeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
}

// Helper function to calculate SHA256 checksum
function calculateChecksum(buffer: Buffer): string {
  return crypto.createHash("sha256").update(buffer).digest("hex").toUpperCase();
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

// export const GET: APIRoute = async () => {
//   try {
//     await connect();

//     const posts = await Post.find().sort({ createdAt: -1 });

//     return new Response(
//       JSON.stringify({
//         posts: posts.map(serializePost),
//       }),
//       {
//         status: 200,
//         headers,
//       },
//     );
//   } catch (error) {
//     console.error("Fetch posts error:", error);

//     return new Response(
//       JSON.stringify({
//         message: "Failed to fetch posts",
//       }),
//       {
//         status: 500,
//         headers,
//       },
//     );
//   }
// };

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    console.log("formData ==> ", formData);
    const authorId = String(formData.get("authorId") ?? "").trim();
    const title = String(formData.get("title") ?? "").trim();
    const visibilityValue = String(formData.get("visibility") ?? "Public").trim();
    const visibility = POST_VISIBILITY_VALUES.has(visibilityValue)
      ? visibilityValue
      : "Public";
    const imageInput = formData.get("image");
     const files = formData.getAll("files") as File[];
         const documentNames = formData.getAll("documentNames") as string[];
    const originalNames = formData.getAll("originalNames") as string[];

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

    const user = await UserDetails.findById({ _id: authorId });
    console.log("user ==> ", user);

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
    function generateUniqueFilename(
      documentName: string,
      originalFilename: string
    ): string {
      // Get file extension from original filename
      const extension = originalFilename.split(".").pop()?.toLowerCase() || "";

      // Clean the document name
      const cleanName = documentName
        .trim()
        .replace(/[^a-zA-Z0-9_-]/g, "_")
        .substring(0, 50);

      // Generate unique ID
      const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

      // Combine: documentName_uniqueId.extension
      return `${cleanName}_${uniqueId}.${extension}`;
    }

    function getFileCategory(mimeType: string): string {
      if (mimeType.startsWith("image/")) return "image";
      return "other";
    }

    //Take temporary array for upload and store file, report, document
    const uploadedFiles = [];
    const uploadResults = [];

    //Not sure user upload single or multiple file, that's why use for loop
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const documentName = documentNames[i];
      const originalName = originalNames[i];

      //Check fileType have or not
      if (!file.type) {
        uploadResults.push({
          filename: documentName,
          success: false,
          message: "Invalid file type",
        });

        continue;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        uploadResults.push({
          filename: documentName,
          success: false,
          message: `File size exceeds maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
        });
        continue;
      }

      // Convert File to Buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Generate checksum
      const checksum = calculateChecksum(buffer);

      // Generate unique filename
      const uniqueFilename = generateUniqueFilename(documentName, file.name);
      const fileCategory = getFileCategory(file.type);

      // Construct destination path
      let destinationPath = `${authorId}/${fileCategory}`;

      //unique file name add the extension of the file
      destinationPath += `/${uniqueFilename}`;

      let response = await bunnyStorageService.uploadFile(
          destinationPath,
          buffer,
          file.type,
          checksum
        );
        console.log("🧞‍♂️  response --->", response);

        // Construct public URL
        const publicUrl = `https://${BUNNY_STORAGE_REGION_HOSTNAME}/${BUNNY_STORAGE_ZONE_NAME}/${destinationPath}`;

    


    const post = await Posts.create({
      author: {
        id: String(user._id),
        name: user.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : "Unknown User",
        avatar: DEFAULT_POST_AVATAR,
      },
      title,
      visibility,
      time: new Date().toISOString(),
      reactionCount: 0,
      commentCount: 0,
      shareCount: 0,
      topReactions: [],
      path: destinationPath,
      url: publicUrl,
      filename: uniqueFilename,
      originalName: originalName,
      documentName: documentName,
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
  }
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
}


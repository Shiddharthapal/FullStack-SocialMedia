import { c as connect } from './connection_CMlIs3zC.mjs';
import { P as Post } from './Post_0HHjDp38.mjs';
import { u as userDetails } from './user_C73S1FJ6.mjs';

const BUNNY_STORAGE_ZONE_NAME = process.env.BUNNY_STORAGE_ZONE_NAME || "fullstackdev";
const BUNNY_STORAGE_REGION_HOSTNAME = process.env.BUNNY_STORAGE_REGION_HOSTNAME || "sg.storage.bunnycdn.com";
const BUNNY_STORAGE_API_KEY = process.env.BUNNY_STORAGE_API_KEY || "0769c8e5-40f5-4a9e-82e06657cde9-80a6-4996";
class BunnyStorageService {
  constructor() {
    this.apiKey = BUNNY_STORAGE_API_KEY;
    this.storageZoneName = BUNNY_STORAGE_ZONE_NAME;
    this.regionHostname = BUNNY_STORAGE_REGION_HOSTNAME;
    if (!this.apiKey || !this.storageZoneName || !this.regionHostname) {
      throw new Error(
        "Bunny Storage environment variables are not configured. Please set BUNNY_STORAGE_API_KEY, BUNNY_STORAGE_ZONE_NAME, and BUNNY_STORAGE_REGION_HOSTNAME."
      );
    }
  }
  /**
   * Constructs the full API URL for a given path in the storage zone.
   * @param path - The relative path to the file or directory.
   * @returns The full API endpoint URL.
   */
  getApiUrl(path = "") {
    return `https://${this.regionHostname}/${this.storageZoneName}/${path}`;
  }
  /**
   * Handles the response from the Bunny API, throwing an error for non-successful responses.
   * @param response - The raw fetch response object.
   */
  async handleResponse(response) {
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Bunny API Error (${errorData.HttpCode}): ${errorData.Message}`
      );
    }
    return response.json();
  }
  /**
   * Lists all files and subdirectories within a specific path.
   * @param path - The directory path to list. MUST end with a '/' to list a directory.
   *               Omit to list the root directory.
   * @returns A promise that resolves to an array of storage objects.
   */
  async listFiles(path = "") {
    const bunnyPath = path.endsWith("/") || path === "" ? path : `${path}/`;
    const response = await fetch(this.getApiUrl(bunnyPath), {
      method: "GET",
      headers: {
        AccessKey: this.apiKey
      }
    });
    return this.handleResponse(response);
  }
  /**
   * Downloads a file from the storage zone.
   * @param filePath - The full path to the file you want to download (e.g., 'images/logo.png').
   * @returns A promise that resolves to the raw fetch Response object. The consumer is responsible
   *          for processing the body (e.g., with .buffer(), .blob(), or streaming it).
   */
  async downloadFile(filePath) {
    const response = await fetch(this.getApiUrl(filePath), {
      method: "GET",
      headers: {
        AccessKey: this.apiKey
      }
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Bunny API Error (${errorData.HttpCode}): ${errorData.Message}`
      );
    }
    return response;
  }
  /**
   * Uploads a file to a specified path. Creates directory structure if it doesn't exist.
   * @param destinationPath - The full path where the file will be saved (e.g., 'uploads/new-file.jpg').
   * @param fileData - The file content as a Buffer.
   * @param fileMimeType - The MIME type of the file (e.g., 'image/jpeg').
   * @param checksum - (Optional) An uppercase SHA256 checksum for integrity validation.
   * @returns A promise that resolves to a success response object.
   */
  async uploadFile(destinationPath, fileData, fileMimeType = "application/octet-stream", checksum) {
    const headers = {
      AccessKey: this.apiKey,
      "Content-Type": fileMimeType
    };
    if (checksum) {
      headers["Checksum"] = checksum;
    }
    const blobPart = fileData instanceof ArrayBuffer ? fileData : Uint8Array.from(fileData).buffer;
    const response = await fetch(this.getApiUrl(destinationPath), {
      method: "PUT",
      headers,
      body: new Blob([blobPart], { type: fileMimeType })
    });
    return this.handleResponse(response);
  }
  /**
   * Deletes an object (a file or a directory) from the storage zone.
   * If the target is a directory, all of its contents will be deleted recursively.
   * @param objectPath - The path to the file or directory to delete. To delete a directory,
   *                     ensure the path ends with a '/'. (e.g., 'old-file.txt' or 'temp-uploads/').
   * @returns A promise that resolves to a success response object.
   */
  async deleteObject(objectPath) {
    const response = await fetch(this.getApiUrl(objectPath), {
      method: "DELETE",
      headers: {
        AccessKey: this.apiKey
      }
    });
    return this.handleResponse(response);
  }
}
const bunnyStorageService = new BunnyStorageService();

const headers = {
  "Content-Type": "application/json"
};
const DEFAULT_POST_AVATAR = "/images/post_img.png";
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const POST_VISIBILITY_VALUES = /* @__PURE__ */ new Set(["Public", "Friends", "Only Me"]);
const BUNNY_PUBLIC_BASE_URL = process.env.BUNNY_PUBLIC_BASE_URL?.replace(
  /\/+$/,
  ""
);
function sanitizeFileName(fileName) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
}
function createDataUrl(bytes, mimeType) {
  return `data:${mimeType};base64,${bytes.toString("base64")}`;
}
function serializeComment(commentDocument) {
  const comment = typeof commentDocument?.toJSON === "function" ? commentDocument.toJSON() : commentDocument;
  return {
    id: String(comment?.id ?? comment?._id ?? ""),
    postId: String(comment?.postId ?? ""),
    author: {
      id: String(comment?.author?.id ?? comment?.author?.authorid ?? ""),
      name: String(comment?.author?.name ?? ""),
      avatar: String(comment?.author?.avatar ?? DEFAULT_POST_AVATAR)
    },
    content: String(comment?.content ?? ""),
    createdAt: comment?.createdAt ? new Date(comment.createdAt).toISOString() : (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: comment?.updatedAt ? new Date(comment.updatedAt).toISOString() : void 0
  };
}
function serializeReaction(reactionDocument) {
  const reaction = typeof reactionDocument?.toJSON === "function" ? reactionDocument.toJSON() : reactionDocument;
  return {
    id: String(reaction?.id ?? reaction?._id ?? ""),
    postId: String(reaction?.postId ?? ""),
    userId: String(reaction?.userId ?? ""),
    type: String(reaction?.type ?? "Like"),
    createdAt: reaction?.createdAt ? new Date(reaction.createdAt).toISOString() : (/* @__PURE__ */ new Date()).toISOString()
  };
}
async function storePostImage(file) {
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
function serializePost(postDocument) {
  const post = typeof postDocument.toJSON === "function" ? postDocument.toJSON() : postDocument;
  return {
    id: String(post.id ?? post._id),
    author: {
      id: String(post.author?.id ?? post.author?.authorid ?? ""),
      name: String(post.author?.name ?? ""),
      avatar: String(post.author?.avatar ?? DEFAULT_POST_AVATAR)
    },
    title: String(post.title ?? ""),
    image: post.image ? String(post.image) : void 0,
    visibility: String(post.visibility ?? "Public"),
    time: String(post.time ?? post.createdAt ?? (/* @__PURE__ */ new Date()).toISOString()),
    createdAt: post.createdAt ? new Date(post.createdAt).toISOString() : (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: post.updatedAt ? new Date(post.updatedAt).toISOString() : void 0,
    reactionCount: Number(post.reactionCount ?? 0),
    commentCount: Number(post.commentCount ?? 0),
    shareCount: Number(post.shareCount ?? 0),
    commentPreview: post.commentPreview ? String(post.commentPreview) : void 0,
    topReactions: Array.isArray(post.topReactions) ? post.topReactions : [],
    comments: Array.isArray(post.comments) ? post.comments.map(serializeComment) : [],
    reactions: Array.isArray(post.reactions) ? post.reactions.map(serializeReaction) : [],
    viewerHasLiked: false
  };
}
const POST = async ({ request }) => {
  try {
    const formData = await request.formData();
    const authorId = String(formData.get("authorId") ?? "").trim();
    const title = String(formData.get("title") ?? "").trim();
    const visibilityValue = String(formData.get("visibility") ?? "Public").trim();
    const visibility = POST_VISIBILITY_VALUES.has(visibilityValue) ? visibilityValue : "Public";
    const imageInput = formData.get("image");
    if (!authorId) {
      return new Response(
        JSON.stringify({
          message: "Author is required"
        }),
        {
          status: 400,
          headers
        }
      );
    }
    if (!title) {
      return new Response(
        JSON.stringify({
          message: "Post text is required"
        }),
        {
          status: 400,
          headers
        }
      );
    }
    await connect();
    const user = await userDetails.findById(authorId);
    if (!user) {
      return new Response(
        JSON.stringify({
          message: "User not found"
        }),
        {
          status: 404,
          headers
        }
      );
    }
    let image;
    if (imageInput instanceof File && imageInput.size > 0) {
      if (!imageInput.type.startsWith("image/")) {
        return new Response(
          JSON.stringify({
            message: "Only image files are allowed"
          }),
          {
            status: 400,
            headers
          }
        );
      }
      if (imageInput.size > MAX_IMAGE_SIZE_BYTES) {
        return new Response(
          JSON.stringify({
            message: "Image size must be 5MB or smaller"
          }),
          {
            status: 400,
            headers
          }
        );
      }
      image = await storePostImage(imageInput);
    }
    const authorName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || String(user.email).split("@")[0];
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const post = await Post.create({
      author: {
        id: String(user._id),
        name: authorName,
        avatar: DEFAULT_POST_AVATAR
      },
      title,
      image,
      visibility,
      time: now,
      reactionCount: 0,
      commentCount: 0,
      shareCount: 0,
      topReactions: [],
      comments: [],
      reactions: []
    });
    return new Response(
      JSON.stringify({
        message: "Post created successfully",
        post: serializePost(post)
      }),
      {
        status: 201,
        headers
      }
    );
  } catch (error) {
    console.error("Create post error:", error);
    return new Response(
      JSON.stringify({
        message: "Failed to create post"
      }),
      {
        status: 500,
        headers
      }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

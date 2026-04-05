import type { APIRoute } from "astro";
import connect from "@/lib/connection";
import Post from "@/model/post";

const headers = {
  "Content-Type": "application/json",
};

const DEFAULT_POST_AVATAR = "/images/post_img.png";

function serializeComment(commentDocument: any) {
  const comment = typeof commentDocument?.toJSON === "function"
    ? commentDocument.toJSON()
    : commentDocument;

  return {
    id: String(comment?.id ?? comment?._id ?? ""),
    postId: String(comment?.postId ?? ""),
    author: {
      id: String(comment?.author?.id ?? comment?.author?.authorid ?? ""),
      name: String(comment?.author?.name ?? ""),
      avatar: String(comment?.author?.avatar ?? DEFAULT_POST_AVATAR),
    },
    content: String(comment?.content ?? ""),
    createdAt: comment?.createdAt
      ? new Date(comment.createdAt).toISOString()
      : new Date().toISOString(),
    updatedAt: comment?.updatedAt
      ? new Date(comment.updatedAt).toISOString()
      : undefined,
  };
}

function serializePost(postDocument: any) {
  const post = typeof postDocument.toJSON === "function"
    ? postDocument.toJSON()
    : postDocument;

  return {
    id: String(post.id ?? post._id),
    author: {
      id: String(post.author?.id ?? post.author?.authorid ?? ""),
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
    comments: Array.isArray(post.comments)
      ? post.comments.map(serializeComment)
      : [],
  };
}

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const page = Math.max(1, Number(url.searchParams.get("page") ?? "1"));
    const limit = Math.min(
      20,
      Math.max(1, Number(url.searchParams.get("limit") ?? "5")),
    );
    const skip = (page - 1) * limit;

    await connect();

    const [posts, totalPosts] = await Promise.all([
      Post.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Post.countDocuments(),
    ]);
    const hasMore = skip + posts.length < totalPosts;

    return new Response(
      JSON.stringify({
        posts: posts.map(serializePost),
        page,
        limit,
        hasMore,
        totalPosts,
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

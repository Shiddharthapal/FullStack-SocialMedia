import type { APIRoute } from "astro";
import connect from "@/lib/connection";
import mongoose from "mongoose";
import Post from "@/model/post";
import UserDetails from "@/model/User";

const headers = {
  "Content-Type": "application/json",
};

const DEFAULT_POST_AVATAR = "/images/post_img.png";

// ✅ FIXED: read "authorid" not "id"
function serializeComment(commentDocument: any) {
  const comment =
    typeof commentDocument?.toJSON === "function"
      ? commentDocument.toJSON()
      : commentDocument;

  return {
    id: String(comment?.id ?? comment?._id ?? ""),
    postId: String(comment?.postId ?? ""),
    author: {
      id: String(comment?.author?.authorid ?? ""), // ✅ FIXED
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
  const post =
    typeof postDocument?.toJSON === "function"
      ? postDocument.toJSON()
      : postDocument;

  return {
    id: String(post?.id ?? post?._id ?? ""),
    author: {
      id: String(post.author?.authorid ?? ""), // ✅ FIXED
      name: String(post.author?.name ?? ""),
      avatar: String(post.author?.avatar ?? DEFAULT_POST_AVATAR),
    },
    title: String(post?.title ?? ""),
    image: post?.image ? String(post.image) : undefined,
    visibility: String(post?.visibility ?? "Public"),
    time: String(post?.time ?? post?.createdAt ?? new Date().toISOString()),
    createdAt: post?.createdAt
      ? new Date(post.createdAt).toISOString()
      : new Date().toISOString(),
    updatedAt: post?.updatedAt
      ? new Date(post.updatedAt).toISOString()
      : undefined,
    reactionCount: Number(post?.reactionCount ?? 0),
    commentCount: Number(post?.commentCount ?? 0),
    shareCount: Number(post?.shareCount ?? 0),
    commentPreview: post?.commentPreview
      ? String(post.commentPreview)
      : undefined,
    topReactions: Array.isArray(post?.topReactions) ? post.topReactions : [],
    comments: Array.isArray(post?.comments)
      ? post.comments.map(serializeComment)
      : [],
  };
}

export const PATCH: APIRoute = async ({ request }) => {
  try {
    const { postId, authorId, content } = await request.json();

    if (!postId) {
      return new Response(JSON.stringify({ message: "Post is required" }), {
        status: 400,
        headers,
      });
    }

    if (!authorId) {
      return new Response(JSON.stringify({ message: "Author is required" }), {
        status: 400,
        headers,
      });
    }

    if (!content) {
      return new Response(
        JSON.stringify({ message: "Comment cannot be empty" }),
        { status: 400, headers },
      );
    }

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return new Response(JSON.stringify({ message: "Invalid post ID" }), {
        status: 400,
        headers,
      });
    }
    if (!mongoose.Types.ObjectId.isValid(authorId)) {
      return new Response(JSON.stringify({ message: "Invalid author ID" }), {
        status: 400,
        headers,
      });
    }

    await connect();

    const [user, post] = await Promise.all([
      UserDetails.findById(authorId),
      Post.findById(postId),
    ]);

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
        headers,
      });
    }

    if (!post) {
      return new Response(JSON.stringify({ message: "Post not found" }), {
        status: 404,
        headers,
      });
    }

    const authorName =
      `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() ||
      String(user.email).split("@")[0];

    if (!Array.isArray(post.comments)) {
      post.comments = [];
    }

    let newcomments = {
      postId: String(post._id),
      author: {
        authorid: String(user._id),
        name: authorName,
        avatar: DEFAULT_POST_AVATAR,
      },
      content: content,
      
    };
    post.comments.push(newcomments);

    post.commentCount = post.comments.length;
    post.commentPreview = content;
    post.markModified("comments");

    console.log("post ==> ", post);

    await post.save();
    const updatedPost = await Post.findById(postId);

    return new Response(
      JSON.stringify({
        message: "Comment added successfully",
        post: serializePost(updatedPost ?? post),
      }),
      {
        status: 200,
        headers,
      },
    );
  } catch (error) {
    console.error("Add comment error:", error);

    return new Response(JSON.stringify({ message: "Failed to add comment" }), {
      status: 500,
      headers,
    });
  }
};

export const POST: APIRoute = PATCH;

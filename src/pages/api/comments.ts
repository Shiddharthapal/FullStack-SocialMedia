import type { APIRoute } from "astro";
import connect from "@/lib/connection";
import mongoose from "mongoose";
import Post from "@/model/Post";
import UserDetails from "@/model/user";

const headers = {
  "Content-Type": "application/json",
};

// PATCH /api/comments appends a nested comment to a post document and returns
// the refreshed post so the UI can update without refetching the whole feed.
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
  const post =
    typeof postDocument?.toJSON === "function"
      ? postDocument.toJSON()
      : postDocument;

  return {
    id: String(post?.id ?? post?._id ?? ""),
    author: {
      id: String(post?.author?.id ?? post?.author?.authorid ?? ""),
      name: String(post?.author?.name ?? ""),
      avatar: String(post?.author?.avatar ?? DEFAULT_POST_AVATAR),
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
    const trimmedPostId = String(postId ?? "").trim();
    const trimmedAuthorId = String(authorId ?? "").trim();
    const trimmedContent = String(content ?? "").trim();

    if (!trimmedPostId) {
      return new Response(JSON.stringify({ message: "Post is required" }), {
        status: 400,
        headers,
      });
    }

    if (!trimmedAuthorId) {
      return new Response(JSON.stringify({ message: "Author is required" }), {
        status: 400,
        headers,
      });
    }

    if (!trimmedContent) {
      return new Response(
        JSON.stringify({ message: "Comment cannot be empty" }),
        { status: 400, headers },
      );
    }

    if (!mongoose.Types.ObjectId.isValid(trimmedPostId)) {
      return new Response(JSON.stringify({ message: "Invalid post ID" }), {
        status: 400,
        headers,
      });
    }
    if (!mongoose.Types.ObjectId.isValid(trimmedAuthorId)) {
      return new Response(JSON.stringify({ message: "Invalid author ID" }), {
        status: 400,
        headers,
      });
    }

    await connect();

    const [user, post] = await Promise.all([
      UserDetails.findById(trimmedAuthorId),
      Post.findById(trimmedPostId),
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

    // Comments are embedded inside the post document so the feed card can render
    // the post and its recent comments from one API response.
    const newComment = {
      id: new mongoose.Types.ObjectId().toString(),
      postId: String(post._id),
      author: {
        id: String(user._id),
        name: authorName,
        avatar: DEFAULT_POST_AVATAR,
      },
      content: trimmedContent,
    };

    const updatedPost = await Post.findByIdAndUpdate(
      trimmedPostId,
      {
        $push: { comments: newComment },
        $set: { commentPreview: trimmedContent },
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedPost) {
      return new Response(JSON.stringify({ message: "Post not found" }), {
        status: 404,
        headers,
      });
    }

    updatedPost.commentCount = Array.isArray(updatedPost.comments)
      ? updatedPost.comments.length
      : 0;
    await updatedPost.save();

    return new Response(
      JSON.stringify({
        message: "Comment added successfully",
        post: serializePost(updatedPost),
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

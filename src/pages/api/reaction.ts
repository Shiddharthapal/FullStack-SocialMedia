import type { APIRoute } from "astro";
import connect from "@/lib/connection";
import mongoose from "mongoose";
import Post from "@/model/Post";
import UserDetails from "@/model/user";

const headers = {
  "Content-Type": "application/json",
};

// PATCH /api/reaction toggles a single "Like" reaction for one user on one post.
// The updated post is returned so the feed can refresh in place.
const DEFAULT_POST_AVATAR = "/images/post_img.png";

// Serializers normalize nested Mongoose documents before sending them to React.
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

function serializeReaction(reactionDocument: any) {
  const reaction = typeof reactionDocument?.toJSON === "function"
    ? reactionDocument.toJSON()
    : reactionDocument;

  return {
    id: String(reaction?.id ?? reaction?._id ?? ""),
    postId: String(reaction?.postId ?? ""),
    userId: String(reaction?.userId ?? ""),
    type: String(reaction?.type ?? "Like"),
    createdAt: reaction?.createdAt
      ? new Date(reaction.createdAt).toISOString()
      : new Date().toISOString(),
  };
}

function serializePost(postDocument: any, currentUserId = "") {
  const post = typeof postDocument?.toJSON === "function"
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
    reactions: Array.isArray(post?.reactions)
      ? post.reactions.map(serializeReaction)
      : [],
    viewerHasLiked: currentUserId
      ? Array.isArray(post?.reactions) &&
        post.reactions.some(
          (reaction: any) => String(reaction?.userId ?? "") === currentUserId,
        )
      : false,
  };
}

export const PATCH: APIRoute = async ({ request }) => {
  try {
    const { postId, userId } = await request.json();

    const trimmedPostId = String(postId ?? "").trim();
    const trimmedUserId = String(userId ?? "").trim();

    if (!trimmedPostId) {
      return new Response(JSON.stringify({ message: "Post is required" }), {
        status: 400,
        headers,
      });
    }

    if (!trimmedUserId) {
      return new Response(JSON.stringify({ message: "User is required" }), {
        status: 400,
        headers,
      });
    }

    if (!mongoose.Types.ObjectId.isValid(trimmedPostId)) {
      return new Response(JSON.stringify({ message: "Invalid post ID" }), {
        status: 400,
        headers,
      });
    }

    if (!mongoose.Types.ObjectId.isValid(trimmedUserId)) {
      return new Response(JSON.stringify({ message: "Invalid user ID" }), {
        status: 400,
        headers,
      });
    }

    await connect();

    const [user, post] = await Promise.all([
      UserDetails.findById(trimmedUserId),
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

    const currentReactions = Array.isArray(post.reactions) ? post.reactions : [];
    const hasExistingReaction = currentReactions.some(
      (reaction: any) => String(reaction?.userId ?? "") === trimmedUserId,
    );

    let action: "liked" | "unliked";
    let updatedPost;

    if (hasExistingReaction) {
      // Remove the user's existing reaction to implement "unlike".
      updatedPost = await Post.findOneAndUpdate(
        { _id: trimmedPostId },
        {
          $pull: {
            reactions: {
              userId: trimmedUserId,
            },
          },
        },
        {
          new: true,
        },
      );
      action = "unliked";
    } else {
      const now = new Date();

      // The query guard ensures the same user is not added twice.
      updatedPost = await Post.findOneAndUpdate(
        {
          _id: trimmedPostId,
          "reactions.userId": {
            $ne: trimmedUserId,
          },
        },
        {
          $push: {
            reactions: {
              id: new mongoose.Types.ObjectId().toString(),
              postId: trimmedPostId,
              userId: trimmedUserId,
              type: "Like",
              createdAt: now,
              updatedAt: now,
            },
          },
        },
        {
          new: true,
        },
      );
      action = "liked";
    }

    if (!updatedPost) {
      return new Response(JSON.stringify({ message: "Post not found" }), {
        status: 404,
        headers,
      });
    }

    const updatedReactions = Array.isArray(updatedPost.reactions)
      ? updatedPost.reactions
      : [];

    // Keep counters denormalized for fast feed rendering.
    updatedPost.reactionCount = updatedReactions.length;
    updatedPost.topReactions = updatedReactions.length > 0 ? ["Like"] : [];
    updatedPost.markModified("reactions");
    await updatedPost.save();

    return new Response(
      JSON.stringify({
        message: action === "liked"
          ? "Post liked successfully"
          : "Post unliked successfully",
        action,
        post: serializePost(updatedPost, trimmedUserId),
      }),
      {
        status: 200,
        headers,
      },
    );
  } catch (error) {
    console.error("Toggle reaction error:", error);

    return new Response(
      JSON.stringify({ message: "Failed to update reaction" }),
      {
        status: 500,
        headers,
      },
    );
  }
};

export const POST: APIRoute = PATCH;

import { c as connect } from './connection_CMlIs3zC.mjs';
import mongoose from 'mongoose';
import { P as Post } from './Post_0HHjDp38.mjs';
import { u as userDetails } from './user_C73S1FJ6.mjs';

const headers = {
  "Content-Type": "application/json"
};
const DEFAULT_POST_AVATAR = "/images/post_img.png";
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
function serializePost(postDocument, currentUserId = "") {
  const post = typeof postDocument?.toJSON === "function" ? postDocument.toJSON() : postDocument;
  return {
    id: String(post?.id ?? post?._id ?? ""),
    author: {
      id: String(post?.author?.id ?? post?.author?.authorid ?? ""),
      name: String(post?.author?.name ?? ""),
      avatar: String(post?.author?.avatar ?? DEFAULT_POST_AVATAR)
    },
    title: String(post?.title ?? ""),
    image: post?.image ? String(post.image) : void 0,
    visibility: String(post?.visibility ?? "Public"),
    time: String(post?.time ?? post?.createdAt ?? (/* @__PURE__ */ new Date()).toISOString()),
    createdAt: post?.createdAt ? new Date(post.createdAt).toISOString() : (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: post?.updatedAt ? new Date(post.updatedAt).toISOString() : void 0,
    reactionCount: Number(post?.reactionCount ?? 0),
    commentCount: Number(post?.commentCount ?? 0),
    shareCount: Number(post?.shareCount ?? 0),
    commentPreview: post?.commentPreview ? String(post.commentPreview) : void 0,
    topReactions: Array.isArray(post?.topReactions) ? post.topReactions : [],
    comments: Array.isArray(post?.comments) ? post.comments.map(serializeComment) : [],
    reactions: Array.isArray(post?.reactions) ? post.reactions.map(serializeReaction) : [],
    viewerHasLiked: currentUserId ? Array.isArray(post?.reactions) && post.reactions.some(
      (reaction) => String(reaction?.userId ?? "") === currentUserId
    ) : false
  };
}
const PATCH = async ({ request }) => {
  try {
    const { postId, userId } = await request.json();
    const trimmedPostId = String(postId ?? "").trim();
    const trimmedUserId = String(userId ?? "").trim();
    if (!trimmedPostId) {
      return new Response(JSON.stringify({ message: "Post is required" }), {
        status: 400,
        headers
      });
    }
    if (!trimmedUserId) {
      return new Response(JSON.stringify({ message: "User is required" }), {
        status: 400,
        headers
      });
    }
    if (!mongoose.Types.ObjectId.isValid(trimmedPostId)) {
      return new Response(JSON.stringify({ message: "Invalid post ID" }), {
        status: 400,
        headers
      });
    }
    if (!mongoose.Types.ObjectId.isValid(trimmedUserId)) {
      return new Response(JSON.stringify({ message: "Invalid user ID" }), {
        status: 400,
        headers
      });
    }
    await connect();
    const [user, post] = await Promise.all([
      userDetails.findById(trimmedUserId),
      Post.findById(trimmedPostId)
    ]);
    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
        headers
      });
    }
    if (!post) {
      return new Response(JSON.stringify({ message: "Post not found" }), {
        status: 404,
        headers
      });
    }
    const currentReactions = Array.isArray(post.reactions) ? post.reactions : [];
    const hasExistingReaction = currentReactions.some(
      (reaction) => String(reaction?.userId ?? "") === trimmedUserId
    );
    let action;
    let updatedPost;
    if (hasExistingReaction) {
      updatedPost = await Post.findOneAndUpdate(
        { _id: trimmedPostId },
        {
          $pull: {
            reactions: {
              userId: trimmedUserId
            }
          }
        },
        {
          new: true
        }
      );
      action = "unliked";
    } else {
      const now = /* @__PURE__ */ new Date();
      updatedPost = await Post.findOneAndUpdate(
        {
          _id: trimmedPostId,
          "reactions.userId": {
            $ne: trimmedUserId
          }
        },
        {
          $push: {
            reactions: {
              id: new mongoose.Types.ObjectId().toString(),
              postId: trimmedPostId,
              userId: trimmedUserId,
              type: "Like",
              createdAt: now,
              updatedAt: now
            }
          }
        },
        {
          new: true
        }
      );
      action = "liked";
    }
    if (!updatedPost) {
      return new Response(JSON.stringify({ message: "Post not found" }), {
        status: 404,
        headers
      });
    }
    const updatedReactions = Array.isArray(updatedPost.reactions) ? updatedPost.reactions : [];
    updatedPost.reactionCount = updatedReactions.length;
    updatedPost.topReactions = updatedReactions.length > 0 ? ["Like"] : [];
    updatedPost.markModified("reactions");
    await updatedPost.save();
    return new Response(
      JSON.stringify({
        message: action === "liked" ? "Post liked successfully" : "Post unliked successfully",
        action,
        post: serializePost(updatedPost, trimmedUserId)
      }),
      {
        status: 200,
        headers
      }
    );
  } catch (error) {
    console.error("Toggle reaction error:", error);
    return new Response(
      JSON.stringify({ message: "Failed to update reaction" }),
      {
        status: 500,
        headers
      }
    );
  }
};
const POST = PATCH;

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  PATCH,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

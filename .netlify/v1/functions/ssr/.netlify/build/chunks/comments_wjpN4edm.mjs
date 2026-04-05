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
function serializePost(postDocument) {
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
    comments: Array.isArray(post?.comments) ? post.comments.map(serializeComment) : []
  };
}
const PATCH = async ({ request }) => {
  try {
    const { postId, authorId, content } = await request.json();
    const trimmedPostId = String(postId ?? "").trim();
    const trimmedAuthorId = String(authorId ?? "").trim();
    const trimmedContent = String(content ?? "").trim();
    if (!trimmedPostId) {
      return new Response(JSON.stringify({ message: "Post is required" }), {
        status: 400,
        headers
      });
    }
    if (!trimmedAuthorId) {
      return new Response(JSON.stringify({ message: "Author is required" }), {
        status: 400,
        headers
      });
    }
    if (!trimmedContent) {
      return new Response(
        JSON.stringify({ message: "Comment cannot be empty" }),
        { status: 400, headers }
      );
    }
    if (!mongoose.Types.ObjectId.isValid(trimmedPostId)) {
      return new Response(JSON.stringify({ message: "Invalid post ID" }), {
        status: 400,
        headers
      });
    }
    if (!mongoose.Types.ObjectId.isValid(trimmedAuthorId)) {
      return new Response(JSON.stringify({ message: "Invalid author ID" }), {
        status: 400,
        headers
      });
    }
    await connect();
    const [user, post] = await Promise.all([
      userDetails.findById(trimmedAuthorId),
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
    const authorName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || String(user.email).split("@")[0];
    const newComment = {
      id: new mongoose.Types.ObjectId().toString(),
      postId: String(post._id),
      author: {
        id: String(user._id),
        name: authorName,
        avatar: DEFAULT_POST_AVATAR
      },
      content: trimmedContent
    };
    const updatedPost = await Post.findByIdAndUpdate(
      trimmedPostId,
      {
        $push: { comments: newComment },
        $set: { commentPreview: trimmedContent }
      },
      {
        new: true,
        runValidators: true
      }
    );
    if (!updatedPost) {
      return new Response(JSON.stringify({ message: "Post not found" }), {
        status: 404,
        headers
      });
    }
    updatedPost.commentCount = Array.isArray(updatedPost.comments) ? updatedPost.comments.length : 0;
    await updatedPost.save();
    return new Response(
      JSON.stringify({
        message: "Comment added successfully",
        post: serializePost(updatedPost)
      }),
      {
        status: 200,
        headers
      }
    );
  } catch (error) {
    console.error("Add comment error:", error);
    return new Response(JSON.stringify({ message: "Failed to add comment" }), {
      status: 500,
      headers
    });
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

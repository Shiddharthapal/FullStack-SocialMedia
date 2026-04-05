import mongoose, { Schema } from "mongoose";
import type { PostVisibility, ReactionType } from "@/types/post";

const POST_VISIBILITY_VALUES = ["Public", "Friends", "Only Me"] as const satisfies readonly PostVisibility[];
const REACTION_TYPE_VALUES = ["Like", "Love", "Haha", "Wow", "Sad", "Angry"] as const satisfies readonly ReactionType[];


const postAuthorSchema = new Schema(
  {
    authorid: { type: String },
    name:     { type: String },
    avatar:   { type: String },
  },
  { _id: false } 
);

const postCommentSchema = new Schema(
  {
    postId: { type: String },
    author: { type: postAuthorSchema },
    content: { type: String },
  },
  {
    timestamps: true,
  },
);

const postSchema = new Schema(
  {
    author:         { type: postAuthorSchema },
    title:          { type: String, minlength: [1, "Post title cannot be empty"] },
    image:          { type: String, default: undefined },
    visibility:     { type: String, enum: POST_VISIBILITY_VALUES, required: true, default: "Public" },
    time:           { type: String, required: true, default: () => new Date().toISOString(), trim: true },
    reactionCount:  { type: Number, default: 0, min: 0 },
    commentCount:   { type: Number, default: 0, min: 0 },
    shareCount:     { type: Number, default: 0, min: 0 },
    commentPreview: { type: String, default: undefined },
    comments:       { type: [postCommentSchema], default: [] },
    topReactions:   [{ type: String, enum: REACTION_TYPE_VALUES }],
  },
  {
    timestamps: true,
  },
);

postSchema.virtual("id").get(function () {
  return this._id.toString();
});

postSchema.index({ "author.authorid": 1 }); // ✅ FIXED from "author.id"
postSchema.index({ visibility: 1, createdAt: -1 });

const Post = mongoose.models.Post || mongoose.model("Post", postSchema);
export default Post;
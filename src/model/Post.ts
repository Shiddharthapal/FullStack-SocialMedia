import mongoose, { Schema } from "mongoose";
import type { PostVisibility, ReactionType } from "@/types/post";

const POST_VISIBILITY_VALUES = [
  "Public",
  "Friends",
  "Only Me",
] as const satisfies readonly PostVisibility[];

const REACTION_TYPE_VALUES = [
  "Like",
  "Love",
  "Haha",
  "Wow",
  "Sad",
  "Angry",
] as const satisfies readonly ReactionType[];

const postAuthorSchema = new Schema(
  {
    id: {
      type: String,
     
    },
    name: {
      type: String,
      
    },
    avatar: {
      type: String,
      
    },
  },
  { _id: false },
);

const postSchema = new Schema(
  {
    author: {
      type: postAuthorSchema,
      
    },
    title: {
      type: String,
      minlength: [1, "Post title cannot be empty"],
    },
    image: {
      type: String,
      default: undefined,
    },
    visibility: {
      type: String,
      enum: POST_VISIBILITY_VALUES,
      required: [true, "Post visibility is required"],
      default: "Public",
    },
    time: {
      type: String,
      required: [true, "Post time is required"],
      default: () => new Date().toISOString(),
      trim: true,
    },
    reactionCount: {
      type: Number,
      default: 0,
      min: [0, "Reaction count cannot be negative"],
    },
    commentCount: {
      type: Number,

      default: 0,
      min: [0, "Comment count cannot be negative"],
    },
    shareCount: {
      type: Number,

      default: 0,
      min: [0, "Share count cannot be negative"],
    },
    commentPreview: {
      type: String,
      default: undefined,
    },
    topReactions: [
      {
        type: String,
        enum: REACTION_TYPE_VALUES,
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

postSchema.virtual("id").get(function () {
  return this._id.toString();
});

postSchema.index({ "author.id": 1 });
postSchema.index({ visibility: 1, createdAt: -1 });

const Post =
  mongoose.models.Post || mongoose.model("Post", postSchema);

export default Post;

import mongoose from 'mongoose';

const POST_VISIBILITY_VALUES = ["Public", "Friends", "Only Me"];
const REACTION_TYPE_VALUES = ["Like", "Love", "Haha", "Wow", "Sad", "Angry"];
const postAuthorSchema = new mongoose.Schema(
  {
    id: { type: String },
    name: { type: String },
    avatar: { type: String }
  },
  { _id: false }
);
const postCommentSchema = new mongoose.Schema(
  {
    postId: { type: String },
    author: { type: postAuthorSchema },
    content: { type: String }
  },
  {
    timestamps: true
  }
);
const postReactionSchema = new mongoose.Schema(
  {
    id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    postId: { type: String },
    userId: { type: String },
    type: { type: String, enum: REACTION_TYPE_VALUES, default: "Like" }
  },
  {
    timestamps: true,
    _id: false
  }
);
const postSchema = new mongoose.Schema(
  {
    author: { type: postAuthorSchema },
    title: { type: String, minlength: [1, "Post title cannot be empty"] },
    image: { type: String, default: void 0 },
    visibility: { type: String, enum: POST_VISIBILITY_VALUES, required: true, default: "Public" },
    time: { type: String, required: true, default: () => (/* @__PURE__ */ new Date()).toISOString(), trim: true },
    reactionCount: { type: Number, default: 0, min: 0 },
    commentCount: { type: Number, default: 0, min: 0 },
    shareCount: { type: Number, default: 0, min: 0 },
    commentPreview: { type: String, default: void 0 },
    comments: { type: [postCommentSchema], default: [] },
    reactions: { type: [postReactionSchema], default: [] },
    topReactions: [{ type: String, enum: REACTION_TYPE_VALUES }]
  },
  {
    timestamps: true
  }
);
const existingPostModel = mongoose.models.Post;
if (existingPostModel && (!existingPostModel.schema.path("comments") || !existingPostModel.schema.path("reactions"))) {
  mongoose.deleteModel("Post");
}
const Post = mongoose.models.Post || mongoose.model("Post", postSchema);

export { Post as P };

// Shared post contracts used by the React feed and the Astro API routes.
// Keeping these in one file helps the frontend and backend agree on shape.

export type PostVisibility = "Public" | "Friends" | "Only Me";

export type ReactionType = "Like" | "Love" | "Haha" | "Wow" | "Sad" | "Angry";

export interface PostAuthor {
  // New code should prefer `id`. `authorid` is kept as a compatibility fallback
  // because some legacy records and serializers still reference that name.
  id: string;
  authorid?: string;
  name: string;
  avatar: string;
}

export interface PostReaction {
  id: string;
  postId: string;
  userId: string;
  type: ReactionType;
  createdAt: string; // ISO date string
}

export interface PostComment {
  id: string;
  _id?: string;
  postId: string;
  author: PostAuthor;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

export interface PostShare {
  id: string;
  _id?: string;
  postId: string;
  userId: string;
  createdAt: string;
}

export interface Post {
  id: string;
  _id?: string;
  author: PostAuthor;
  title: string;
  image?: string;
  visibility: PostVisibility;
  time: string;
  reactionCount: number;
  commentCount: number;
  shareCount: number;
  // `path` exists in the historical type shape even though the current feed
  // does not rely on it directly.
  path: string;
  commentPreview?: string;
  topReactions: ReactionType[];
  comments: PostComment[];
  reactions?: PostReaction[];
  viewerHasLiked?: boolean;
  createdAt: string;
  updatedAt?: string;
}

// Payload used by the create-post flow.
export interface CreatePostInput {
  authorId: string;
  title: string;
  image?: string;
  visibility: PostVisibility;
}

// Payload used by edit flows if post editing is added later.
export interface UpdatePostInput {
  id: string;
  title?: string;
  image?: string;
  visibility?: PostVisibility;
  updatedAt: string;
}

// Payload used by the nested comment API.
export interface CreatePostCommentInput {
  postId: string;
  authorId: string;
  content: string;
}

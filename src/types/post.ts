// types/post.ts

export type PostVisibility = "Public" | "Friends" | "Only Me";

export type ReactionType = "Like" | "Love" | "Haha" | "Wow" | "Sad" | "Angry";

export interface PostAuthor {
  id: string;
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
  postId: string;
  author: PostAuthor;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

export interface PostShare {
  id: string;
  postId: string;
  userId: string;
  createdAt: string;
}

export interface Post {
  id: string;
  author: PostAuthor;
  title: string;
  image?: string;           // optional — post may not have an image
  visibility: PostVisibility;
  time: string;             // e.g. "2 hours ago" or ISO date string
  createdAt: string;        // ISO date string for DB sorting
  updatedAt?: string;

  // counts (denormalized for fast reads)
  reactionCount: number;
  commentCount: number;     
  shareCount: number;       

  // preview of latest comment shown under the post
  commentPreview?: string;  // maps to post.preview in component

  // reaction summary icons shown 
  topReactions: ReactionType[];
}

// For creating a new post
export interface CreatePostInput {
  authorId: string;
  title: string;
  image?: string;
  visibility: PostVisibility;
}

// For updating an existing post
export interface UpdatePostInput {
  id: string;
  title?: string;
  image?: string;
  visibility?: PostVisibility;
  updatedAt: string;
}
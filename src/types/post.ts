// types/post.ts

export type PostVisibility = "Public" | "Friends" | "Only Me";

export type ReactionType = "Like" | "Love" | "Haha" | "Wow" | "Sad" | "Angry";

export interface PostAuthor {
  authorid: string;
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
    _id:string;
  postId: string;
  author: PostAuthor;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

export interface PostShare {
  _id: string;
  postId: string;
  userId: string;
  createdAt: string;
}

export interface Post {
    _id: string;
  author: PostAuthor;
  title: string;
  image?: string; 
  visibility: PostVisibility;
  time: string; 
  reactionCount: number;
  commentCount: number;
  shareCount: number;
  path: string;
  commentPreview?: string; 
  topReactions: ReactionType[];
  comments: PostComment[];
  createdAt: string; 
  updatedAt?: string;
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

export interface CreatePostCommentInput {
  postId: string;
  authorId: string;
  content: string;
}

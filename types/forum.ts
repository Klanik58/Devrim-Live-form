import type { ReactNode } from 'react';

export interface Post {
    id: number;
    categoryId: number;
    userId: number;
    title: string;
    content: string;
    createdAt: string;
    likes: number[]; // Array of user IDs
    source?: string; // e.g., 'Wikipedia'
    sourceUrl?: string; // URL to the source
}

export interface Comment {
    id: number;
    postId: number;
    userId: number;
    content: string;
    createdAt: string;
    likes: number[]; // Array of user IDs
}

export interface LastPostInfo {
  title: string;
  user: string;
  time: string;
  threadUrl: string;
  postId: number;
}

export interface ForumCategoryData {
  id: number;
  icon: ReactNode;
  title: string;
  description: string;
}

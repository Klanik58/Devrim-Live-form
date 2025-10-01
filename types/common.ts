import type { User, Post, Comment } from './';

export type Lang = 'tr' | 'en';
export type Page = { name: string; params?: Record<string, any> };

export interface AppState {
    users: User[];
    posts: Post[];
    comments: Comment[];
}

export interface SidebarLink {
  title: string;
  url: string;
  user: string;
  time: string;
}
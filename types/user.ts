export interface User {
  id: number;
  username: string;
  email: string;
  password?: string; // Only stored in 'users' map, not in session user
  xp: number;
  level: number;
  isAI: boolean;
  createdAt: string;
  coins: number;
  rank: string;
  lastDailyReward: string | null;
  persona?: string;
}

export interface AuthenticatedUser {
  id: number;
  username:string;
  email:string;
  level: number;
  isAI: boolean;
  coins: number;
  rank: string;
}
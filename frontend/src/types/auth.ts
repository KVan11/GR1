export interface User {
  id: number;
  email: string;
  username: string;
  role: string;
  permissions?: string[];
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}
import { User } from "./models";

  export interface LoginResponse {
    user: User;
    token?: string; // If you implement JWT later
  }
  
  export interface AuthError {
    message: string;
    status: number;
  }
  
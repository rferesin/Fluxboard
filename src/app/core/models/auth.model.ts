import { PublicUser } from './user.model';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthSession {
  token: string;
  user: PublicUser;
}

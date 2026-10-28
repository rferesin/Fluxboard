export type UserRole = 'admin' | 'member';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  avatarColor: string;
  initials: string;
  role: UserRole;
}

export type PublicUser = Omit<User, 'password'>;

export const InitialProfile: UserProfile = { name: '', email: '', picture: '' };

export interface UserProfile {
  name: string;
  email: string;
  picture: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  username: string;
  email: string;
  password: string;
}

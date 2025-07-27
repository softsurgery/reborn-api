export interface GithubUserResponse {
  login: string;
  email: string | null;
}

export interface GithubEmail {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: 'public' | 'private' | null;
}

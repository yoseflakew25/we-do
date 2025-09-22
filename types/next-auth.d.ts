import NextAuth from 'next-auth/next';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      accessToken: string;
      refreshToken: string;
      name: string;
      email: string;
      profilePicUrl: string;
      role: 'org' | 'superadmin' | 'user' | '';
      profileComplete: boolean;
      profileStatus:
        | 'incomplete'
        | 'complete'
        | 'rejected'
        | 'verified'
        | 'disabled';
    };
  }
}

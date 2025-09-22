import type { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

export const options: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || '',
      clientSecret: process.env.GOOGLE_SECRET || '',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'text',
          placeholder: 'Your Email',
        },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: 'Your password',
        },
      },
      async authorize(credentials, _) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
        });

        // Return null if user data could not be retrieved
        const jsonResponse = await res.json();

        // If no error and we have user data, return it
        if (res.ok && jsonResponse.success) {
          return jsonResponse.data;
        } else {
          throw new Error(jsonResponse.message);
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
    signOut: '/logout',
  },
  callbacks: {
    jwt: async ({ token, user, trigger, session, account }) => {
      if (account?.provider === 'google') {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/continue-with-google`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              provider: account?.provider,
              token: account?.id_token,
              role: '',
            }),
          }
        );
        // Return null if user data could not be retrieved
        const jsonResponse = await res.json();
        // If no error and we have user data, return it
        if (res.ok && jsonResponse.success) {
          return { ...token, ...jsonResponse.data };
        } else {
          throw new Error(jsonResponse.message);
        }
      } else if (
        trigger === 'update' ||
        new Date().valueOf() >= (token.exp as number)
      ) {
        // refetch token when it needs it
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            refreshToken: token.refreshToken,
          }),
        });

        // Return null if user data could not be retrieved
        const jsonResponse = await res.json();

        // If no error and we have user data, return it
        if (res.ok && jsonResponse.success) {
          return { ...token, ...jsonResponse.data, ...session };
        } else {
          throw new Error(jsonResponse.message);
        }
      }

      return { ...token, ...user };
    },
    session: ({ session, token }) => {
      session.user = token as any;
      return session;
    },
  },
};

export default NextAuth(options);

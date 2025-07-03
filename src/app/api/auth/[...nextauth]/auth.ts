import { NextAuthOptions, Session, User, DefaultSession } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import { compare } from 'bcryptjs';
import { Role } from '@/types/user';
import { JWT } from 'next-auth/jwt';
import { TOKEN_EXPIRATION, TOKEN_TYPE, TOKEN_TYPES } from '@/constants/auth';
import { AdapterUser } from 'next-auth/adapters';

// Helper function to generate tokens
function generateTokens(userId: string) {
  const now = Math.floor(Date.now() / 1000);
  return {
    accessToken: Buffer.from(`${userId}:${now + TOKEN_EXPIRATION.ACCESS_TOKEN}`).toString('base64'),
    refreshToken: Buffer.from(`${userId}:${now + TOKEN_EXPIRATION.REFRESH_TOKEN}`).toString('base64'),
    accessTokenExpiresAt: new Date(now * 1000 + TOKEN_EXPIRATION.ACCESS_TOKEN * 1000),
    refreshTokenExpiresAt: new Date(now * 1000 + TOKEN_EXPIRATION.REFRESH_TOKEN * 1000),
  };
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: TOKEN_EXPIRATION.SESSION,
  },
  pages: {
    signIn: '/auth/signin',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          select: {
            id: true,
            email: true,
            password: true,
            name: true,
            role: true,
          },
        });

        if (!user || !user.password || !user.email) {
          throw new Error('User not found');
        }

        const isValid = await compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error('Invalid password');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name || null,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }): Promise<JWT> {
      if (user) {
        // Initial sign in
        const tokens = generateTokens(user.id);
        
        // Update or create account
        await prisma.account.upsert({
          where: {
            provider_providerAccountId: {
              provider: 'credentials',
              providerAccountId: user.id,
            },
          },
          create: {
            userId: user.id,
            type: 'credentials',
            provider: 'credentials',
            providerAccountId: user.id,
            access_token: tokens.accessToken,
            refresh_token: tokens.refreshToken,
            expires_at: Math.floor(tokens.accessTokenExpiresAt.getTime() / 1000),
            token_type: TOKEN_TYPE,
          },
          update: {
            access_token: tokens.accessToken,
            refresh_token: tokens.refreshToken,
            expires_at: Math.floor(tokens.accessTokenExpiresAt.getTime() / 1000),
          },
        });

        // Store tokens in the JWT
        token.id = user.id;
        token.role = user.role as Role;
        token.accessToken = tokens.accessToken;
        token.refreshToken = tokens.refreshToken;
        token.accessTokenExpiresAt = tokens.accessTokenExpiresAt.getTime();
        token.refreshTokenExpiresAt = tokens.refreshTokenExpiresAt.getTime();
      } else if (token.accessTokenExpiresAt && token.refreshTokenExpiresAt) {
        // Subsequent requests - check token expiration
        const now = Date.now();
        if (token.accessTokenExpiresAt < now) {
          if (token.refreshTokenExpiresAt < now) {
            // Both tokens expired - force sign out
            return {} as JWT;
          }
          // Access token expired but refresh token valid - generate new tokens
          const tokens = generateTokens(token.id as string);
          
          // Update account with new tokens
          await prisma.account.update({
            where: {
              provider_providerAccountId: {
                provider: 'credentials',
                providerAccountId: token.id as string,
              },
            },
            data: {
              access_token: tokens.accessToken,
              refresh_token: tokens.refreshToken,
              expires_at: Math.floor(tokens.accessTokenExpiresAt.getTime() / 1000),
            },
          });

          // Update token with new values
          token.accessToken = tokens.accessToken;
          token.refreshToken = tokens.refreshToken;
          token.accessTokenExpiresAt = tokens.accessTokenExpiresAt.getTime();
          token.refreshTokenExpiresAt = tokens.refreshTokenExpiresAt.getTime();
        }
      }
      return token;
    },
    async session({ session, token }): Promise<Session> {
      if (token) {
        // Add user info to session
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
        session.accessToken = token.accessToken as string;
        session.accessTokenExpiresAt = token.accessTokenExpiresAt as number;

        // Update or create session in database
        await prisma.session.upsert({
          where: { sessionToken: session.accessToken },
          create: {
            sessionToken: session.accessToken,
            userId: session.user.id,
            expires: new Date(session.accessTokenExpiresAt),
          },
          update: {
            expires: new Date(session.accessTokenExpiresAt),
          },
        });
      }
      return session;
    },
  },
  events: {
    async signOut({ token }) {
      // Delete session and update account on sign out
      if (token) {
        await prisma.session.deleteMany({
          where: { userId: token.id as string },
        });

        await prisma.account.updateMany({
          where: { userId: token.id as string },
          data: {
            access_token: null,
            refresh_token: null,
            expires_at: null,
          },
        });
      }
    },
  },
};

// Extend next-auth types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: Role;
    } & DefaultSession['user'];
    accessToken: string;
    accessTokenExpiresAt: number;
  }

  interface User {
    id: string;
    email: string;
    name: string | null;
    role: Role;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: Role;
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpiresAt?: number;
    refreshTokenExpiresAt?: number;
  }
} 
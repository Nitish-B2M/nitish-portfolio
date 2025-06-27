import { NextAuthOptions, User, Session } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import { compare } from 'bcryptjs';
import { Role } from '@/types/user';
import { JWT } from 'next-auth/jwt';

interface CustomSession extends Session {
  sessionToken?: string;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
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
          throw new Error('Invalid credentials');
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
          select: {
            id: true,
            email: true,
            password: true,
            name: true,
            role: true,
            active: true,
          },
        });

        if (!user || !user.password) {
          throw new Error('Invalid credentials');
        }

        if (!user.active) {
          throw new Error('User account is inactive');
        }

        const isValid = await compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error('Invalid credentials');
        }

        return {
          id: user.id,
          email: user.email ?? '',
          name: user.name ?? '',
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        // Check if user still exists and is active on every token refresh
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { active: true, role: true },
        });

        if (!dbUser || !dbUser.active) {
          throw new Error('User no longer exists or is inactive');
        }

        // Only create/update account on initial sign in
        if (account) {
          // Check if account exists
          const existingAccount = await prisma.account.findUnique({
            where: {
              provider_providerAccountId: {
                provider: 'credentials',
                providerAccountId: user.id,
              },
            },
          });

          if (!existingAccount) {
            // Create new account only if it doesn't exist
            await prisma.account.create({
              data: {
                userId: user.id,
                type: 'credentials',
                provider: 'credentials',
                providerAccountId: user.id,
              },
            });
          }
        }

        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      const customSession = session as CustomSession;
      if (token) {
        customSession.user.id = token.id as string;
        customSession.user.role = token.role as Role;

        // Update session in database
        if (customSession.sessionToken) {
          await prisma.session.upsert({
            where: {
              sessionToken: customSession.sessionToken,
            },
            create: {
              sessionToken: customSession.sessionToken,
              userId: token.id as string,
              expires: session.expires,
            },
            update: {
              expires: session.expires,
            },
          });
        }
      }
      return customSession;
    },
  },
  events: {
    async signOut({ token, session }) {
      const customSession = session as CustomSession;
      if (token?.id && customSession?.sessionToken) {
        // Delete the specific session
        await prisma.session.delete({
          where: {
            sessionToken: customSession.sessionToken,
          },
        });
      }
    },
  },
}; 
import NextAuth from 'next-auth';
import { authOptions } from './auth';

const handler = NextAuth(authOptions);

// Export the handler using the new Next.js API route format
export const GET = handler;
export const POST = handler;

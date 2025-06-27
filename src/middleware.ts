import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Create a new ratelimiter that allows 10 requests per 10 seconds
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  analytics: true,
});

// Get the client IP address from various headers
function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  return '127.0.0.1';
}

export const config = {
  matcher: [
    '/api/:path*',
    '/admin/:path*'
  ]
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  try {
    // Only apply rate limiting to API routes
    if (request.nextUrl.pathname.startsWith('/api')) {
      // Get IP for rate limiting
      const ip = getClientIp(request);
      const { success, limit, reset, remaining } = await ratelimit.limit(
        `ratelimit_middleware_${ip}`
      );

      response.headers.set('X-RateLimit-Limit', limit.toString());
      response.headers.set('X-RateLimit-Remaining', remaining.toString());
      response.headers.set('X-RateLimit-Reset', reset.toString());

      if (!success) {
        return new NextResponse('Too Many Requests', {
          status: 429,
          statusText: 'Too Many Requests',
          headers: {
            'Retry-After': reset.toString(),
          },
        });
      }

      // Token verification for protected routes
      if (
        request.nextUrl.pathname.startsWith('/api') &&
        !request.nextUrl.pathname.startsWith('/api/auth')
      ) {
        const token = await getToken({ req: request });

        if (!token) {
          return new NextResponse('Unauthorized', { status: 401 });
        }

        // Add user info to request headers for downstream use
        if ('id' in token && 'role' in token) {
          response.headers.set('X-User-Id', token.id as string);
          response.headers.set('X-User-Role', token.role as string);
        }
      }
    }

    // Protect admin routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
      const token = await getToken({ req: request });

      if (!token) {
        return NextResponse.redirect(new URL('/auth/signin', request.url));
      }

      if (!('role' in token) || token.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }

    return response;
  } catch (error) {
    console.error('Middleware error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 
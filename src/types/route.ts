import { NextRequest } from 'next/server';

export type RouteSegment = string | number | null;

export interface RouteContext {
  params: Record<string, RouteSegment>;
}

export type RouteHandler<T = unknown> = (
  req: NextRequest,
  context: RouteContext
) => Promise<T>;

export type RouteParams<T> = {
  params: Promise<T>;
};

export type IdRouteParams = RouteParams<{
  id: string;
}>; 
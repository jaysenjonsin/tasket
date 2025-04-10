//this is an optional (double square brackets) catch all route for all api routes. think of it as index.ts

import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import auth from '@/features/auth/server/route';
import workspaces from '@/features/workspaces/server/route';
import members from '@/features/members/server/route';
const app = new Hono().basePath('/api');

const routes = app
  .route('/auth', auth)
  .route('/workspaces', workspaces)
  .route('/members', members);

export const GET = handle(app); //handle adapts the hono app to work with vercel edge runtime, makes sure all routing and middleware work correctly. hono and vercel have diff ways of handling HTTP requests and handle bridges the gap
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);
export type AppType = typeof routes;

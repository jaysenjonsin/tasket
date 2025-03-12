//this is an optional (double square brackets) catch all route for all api routes.

import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import auth from '@/features/auth/server/route';

const app = new Hono().basePath('/api');

const routes = app.route('/auth', auth);

export const GET = handle(app); //handle adapts the hono app to work with vercel edge runtime, makes sure all routing and middleware work correctly. hono and vercel have diff ways of handling HTTP requests and handle bridges the gap

export type AppType = typeof routes;

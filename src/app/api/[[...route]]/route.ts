//this is an optional (double square brackets) catch all route for all api routes.

import { Hono } from 'hono';
import { handle } from 'hono/vercel';

const app = new Hono().basePath('/api');

app.get('/hello', (c) => {
  return c.json({ message: 'Hello World' });
});

export const GET = handle(app); //handle adapts the hono app to work with vercel edge runtime, makes sure all routing and middleware work correctly. hono and vercel have diff ways of handling HTTP requests and handle bridges the gap

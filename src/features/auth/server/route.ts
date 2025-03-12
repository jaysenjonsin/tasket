import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { loginSchema } from '../../schemas';

const app = new Hono().post('/login', zValidator('json', loginSchema), (c) => {
  return c.json({ message: 'Hello World' });
});
//zValidator is a middleware that validates the request body against the schema for type safety

export default app;

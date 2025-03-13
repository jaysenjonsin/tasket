import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { loginSchema, registerSchema } from '../../schemas';

//AuthRouter
const app = new Hono()
  .post('/login', zValidator('json', loginSchema), async (c) => {
    //.valid() is a method that validates the request body against the schema for type safety, can only use when using zValidator otherwise just use c.req.json() to get the request body, but no type safety
    const { email, password } = c.req.valid('json');
    console.log({ email, password });
    return c.json({ email, password });
  })
  .post('/register', zValidator('json', registerSchema), async (c) => {
    const { email, password } = c.req.valid('json');
    console.log({ email, password });
    return c.json({ email, password });
  });
//zValidator is a middleware that validates the request body against the schema for type safety

export default app;

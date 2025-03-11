import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator} from '@hono/zod-validator';

const app = new Hono().post('/login', zValidator('json', z.object({
  email: z.string().email(),
  password: z.string()
})) (c) => {
  return c.json({ message: 'Hello World' });
});

export default app;

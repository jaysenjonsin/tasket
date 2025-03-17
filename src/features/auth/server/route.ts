import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { loginSchema, registerSchema } from '@/features/schemas';
import { createAdminClient } from '@/lib/appwrite';
import { setCookie, deleteCookie } from 'hono/cookie';
import { ID } from 'node-appwrite'; //ID is a unique identifier for the user made by appwrite
import { AUTH_COOKIE } from '../constants';
import { sessionMiddleware } from '../../../lib/session-middleware';

//AuthRouter
const app = new Hono()
  .post('/login', zValidator('json', loginSchema), async (c) => {
    //zValidator is a middleware that validates the request body against the schema for type safety
    //c is a context object that contains the request and response
    const { email, password } = c.req.valid('json');
    console.log('data from login', { email, password });
    //.valid() is a method that validates the request body against the schema for type safety, can only use when using zValidator. otherwise just use c.req.json() to get the request body, but no type safety
    //create admin client to interact with appwrite
    const { account } = await createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);
    //using hono cookie instead of nextjs cookie
    setCookie(c, AUTH_COOKIE, session.secret, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30,
    });
    return c.json({ success: true });
  })
  .post('/register', zValidator('json', registerSchema), async (c) => {
    const { name, email, password } = c.req.valid('json');
    console.log('data from register', { name, email, password });
    const { account } = await createAdminClient();
    const user = await account.create(ID.unique(), email, password, email);
    const session = await account.createEmailPasswordSession(email, password);
    setCookie(c, AUTH_COOKIE, session.secret, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30,
    });
    return c.json({ success: true });
  })
  .post('/logout', sessionMiddleware, async (c) => {
    const account = c.get('account');
    deleteCookie(c, AUTH_COOKIE);
    await account.deleteSession('current');
    return c.json({ success: true });
  });

export default app;

import 'server-only';
import { getCookie } from 'hono/cookie';
import { AUTH_COOKIE } from '@/features/auth/constants';
import { createMiddleware } from 'hono/factory';
import {
  Account,
  Client,
  Databases,
  Models,
  Storage,
  type Account as AccountType,
  type Databases as DatabasesType,
  type Storage as StorageType,
  type Users as UsersType,
} from 'node-appwrite';

//in docs: Create Variables: {yourvariables} for type safety
type AdditionalContext = {
  Variables: {
    account: AccountType;
    databases: DatabasesType;
    storage: StorageType;
    users: UsersType;
    user: Models.User<Models.Preferences>;
  };
};

//this middleware is used to set the session for the current user(appwrite doesnt have a custom middleware with hono)
export const sessionMiddleware = createMiddleware<AdditionalContext>(
  async (c, next) => {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);
    //dont set key here, client should only be as powerful as the current user
    const session = getCookie(c, AUTH_COOKIE);

    if (!session) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    client.setSession(session);

    const account = new Account(client);
    const databases = new Databases(client);
    const storage = new Storage(client);
    const user = await account.get();

    //set the client as properties on the context object to be used in next middleware
    c.set('account', account);
    c.set('databases', databases);
    c.set('storage', storage);
    c.set('user', user);

    await next();
  }
);

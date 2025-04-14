import { Hono } from 'hono';
import { sessionMiddleware } from '@/lib/session-middleware';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { getMember } from '@/features/members/utils';
import { PROJECTS_ID } from '@/config';
import { DATABASE_ID } from '@/config';
import { Query } from 'node-appwrite';

const app = new Hono().get(
  '/',
  sessionMiddleware,
  zValidator('query', z.object({ workspaceId: z.string() })),
  async (c) => {
    const user = c.get('user');
    const databases = c.get('databases');

    const { workspaceId } = c.req.valid('query');

    if (!workspaceId) {
      return c.json({ error: 'Missing workspaceId' }, 400);
    }

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });
    if (!member) {
      return c.json({ error: 'Not Authorized' }, 401);
    }

    const projects = await databases.listDocuments(DATABASE_ID, PROJECTS_ID, [
      Query.equal('workspaceId', workspaceId),
      Query.orderAsc('$createdAt'),
    ]);

    return c.json({ data: projects });
  }
);

export default app;

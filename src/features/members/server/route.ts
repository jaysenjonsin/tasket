import { Hono } from 'hono';
import { sessionMiddleware } from '../../../lib/session-middleware';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { createAdminClient } from '../../../lib/appwrite';
import { getMember } from '../utils';
import { DATABASE_ID, MEMBERS_ID } from '../../../config';
import { Query } from 'node-appwrite';
import { MemberRole, Member } from '../types';
const app = new Hono()
  .get(
    '/',
    sessionMiddleware,
    zValidator('query', z.object({ workspaceId: z.string() })),
    async (c) => {
      const { users } = await createAdminClient();
      const databases = c.get('databases');
      const user = c.get('user');
      const { workspaceId } = c.req.valid('query');
      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });
      if (!member) {
        return c.json({ error: 'Not Authorized' }, 401);
      }

      const members = await databases.listDocuments<Member>(
        DATABASE_ID,
        MEMBERS_ID,
        [Query.equal('workspaceId', workspaceId)]
      );

      //populate the members with the user name and email because this information is not stored in the members collection
      const populatedMembers = await Promise.all(
        members.documents.map(async (member) => {
          const user = await users.get(member.userId);
          return {
            ...member,
            name: user.name || user.email,
            email: user.email,
          };
        })
      );
      return c.json({
        data: {
          ...members,
          //override the original documents with the populated documents
          documents: populatedMembers,
        },
      });
    }
  )
  .delete('/:memberId', sessionMiddleware, async (c) => {
    const { memberId } = c.req.param();
    const user = c.get('user');
    const databases = c.get('databases');

    const memberToDelete = await databases.getDocument(
      DATABASE_ID,
      MEMBERS_ID,
      memberId
    );

    const allMembersInWorkspace = await databases.listDocuments(
      DATABASE_ID,
      MEMBERS_ID,
      [Query.equal('workspaceId', memberToDelete.workspaceId)]
    );

    const member = await getMember({
      databases,
      workspaceId: memberToDelete.workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return c.json({ error: 'Not Authorized' }, 401);
    }

    //if trying to remove someone else
    if (member.id !== memberToDelete.id && member.role !== MemberRole.ADMIN) {
      return c.json({ error: 'Not Authorized' }, 401);
    }

    if (allMembersInWorkspace.total === 1) {
      return c.json({ error: 'Cannot remove only member' }, 400);
    }

    await databases.deleteDocument(DATABASE_ID, MEMBERS_ID, memberId);

    return c.json({ data: { $id: memberToDelete.$id } });
  })
  .patch(
    '/:memberId',
    sessionMiddleware,
    zValidator(
      'json',
      z.object({
        role: z.nativeEnum(MemberRole),
      })
    ),
    async (c) => {
      const { memberId } = c.req.param();
      const { role } = c.req.valid('json');
      const user = c.get('user');
      const databases = c.get('databases');

      const memberToUpdate = await databases.getDocument(
        DATABASE_ID,
        MEMBERS_ID,
        memberId
      );

      const allMembersInWorkspace = await databases.listDocuments(
        DATABASE_ID,
        MEMBERS_ID,
        [Query.equal('workspaceId', memberToUpdate.workspaceId)]
      );

      const member = await getMember({
        databases,
        workspaceId: memberToUpdate.workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: 'Not Authorized' }, 401);
      }

      if (member.role !== MemberRole.ADMIN) {
        return c.json({ error: 'Not Authorized' }, 401);
      }

      if (allMembersInWorkspace.total === 1) {
        return c.json({ error: 'Cannot downgrade the only member' }, 400);
      }

      await databases.updateDocument(DATABASE_ID, MEMBERS_ID, memberId, {
        role,
      });

      return c.json({ data: { $id: memberToUpdate.$id } });
    }
  );

export default app;

import { zValidator } from '@hono/zod-validator';
import { sessionMiddleware } from '../../../lib/session-middleware';
import { createTaskScehma } from '../schemas';
import { Hono } from 'hono';
import { getMember } from '@/features/members/utils';
import {
  DATABASE_ID,
  MEMBERS_ID,
  PROJECTS_ID,
  TASKS_ID,
} from '../../../config';
import { ID, Query } from 'node-appwrite';
import { z } from 'zod';
import { TaskStatus } from '../types';
import { createAdminClient } from '../../../lib/appwrite';
import { Project } from '../../projects/types';
const app = new Hono()
  .get(
    '/',
    sessionMiddleware,
    zValidator(
      'query',
      z.object({
        workspaceId: z.string(),
        projectId: z.string().nullish(),
        assigneeId: z.string().nullish(),
        status: z.nativeEnum(TaskStatus).nullish(),
        search: z.string().nullish(),
        dueDate: z.string().nullish(),
      })
    ),
    async (c) => {
      const { users } = await createAdminClient();
      const databases = c.get('databases');
      const user = c.get('user');

      const { workspaceId, projectId, assigneeId, status, search, dueDate } =
        c.req.valid('query');

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const query = [
        Query.equal('workspaceId', workspaceId),
        Query.orderDesc('$createdAt'),
      ];

      if (projectId) {
        console.log('projectId', projectId);
        query.push(Query.equal('projectId', projectId));
      }
      if (status) {
        console.log('status', status);
        query.push(Query.equal('status', status));
      }
      if (assigneeId) {
        console.log('assigneId', assigneeId);
        query.push(Query.equal('assigneId', assigneeId));
      }
      if (dueDate) {
        console.log('dueDate', dueDate);
        query.push(Query.equal('dueDate', dueDate));
      }
      if (search) {
        console.log('search', search);
        query.push(Query.search('name', search));
      }

      const tasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, query);

      const projectIds = tasks.documents.map((task) => task.projectId);
      const assigneeIds = tasks.documents.map((task) => task.assigneeId);

      const projects = await databases.listDocuments<Project>(
        DATABASE_ID,
        PROJECTS_ID,
        projectIds.length > 0 ? [Query.contains('$id', projectIds)] : []
      );

      const assignees = await databases.listDocuments(
        DATABASE_ID,
        MEMBERS_ID,
        assigneeIds.length > 0 ? [Query.contains('$id', assigneeIds)] : []
      );

      //populate the tasks with the project and assignee
      const populatedTasks = tasks.documents.map((task) => {
        const project = projects.documents.find(
          (project) => project.$id === task.projectId
        );
        const assignee = assignees.documents.find(
          (assigneer) => assigneer.$id === task.assigneeId
        );
        return {
          ...task,
          project,
          assignee,
        };
      });

      return c.json({
        data: {
          ...tasks,
          documents: populatedTasks,
        },
      });
    }
  )
  .post(
    '/',
    sessionMiddleware,
    zValidator('json', createTaskScehma),
    async (c) => {
      const user = c.get('user');
      const databases = c.get('databases');
      const {
        name,
        status,
        workspaceId,
        projectId,
        dueDate,
        assigneeId,
        description,
      } = c.req.valid('json');

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const highestPositionTask = await databases.listDocuments(
        DATABASE_ID,
        TASKS_ID,
        [
          Query.equal('status', status),
          Query.equal('workspaceId', workspaceId),
          Query.orderAsc('position'),
          Query.limit(1),
        ]
      );
      //if there are no tasks, set the position to 1000, otherwise set the position to the highest position + 1000
      const newPosition =
        highestPositionTask.documents.length > 0
          ? highestPositionTask.documents[0].position + 1000
          : 1000;

      const task = await databases.createDocument(
        DATABASE_ID,
        TASKS_ID,
        ID.unique(),
        {
          name,
          status,
          workspaceId,
          projectId,
          dueDate,
          assigneeId,
          description,
          position: newPosition,
        }
      );

      return c.json({ data: { task } });
    }
  );

export default app;

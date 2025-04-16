import { DATABASE_ID, PROJECTS_ID } from '../../config';
import { createSessionClient } from '../../lib/appwrite';
import { getMember } from '../members/utils';
import { Workspace } from '../workspaces/types';
import { Project } from './types';

interface getProjectProps {
  projectId: string;
}
export const getProject = async ({ projectId }: getProjectProps) => {
  const { databases, account } = await createSessionClient();

  const user = await account.get();

  const project = await databases.getDocument<Project>(
    DATABASE_ID,
    PROJECTS_ID,
    projectId
  );

  //check if the user is a member of the workspace, if not, dont return the project
  const member = await getMember({
    databases,
    userId: user.$id,
    workspaceId: project.workspaceId,
  });

  if (!member) throw new Error('Unauthorized');

  return project;
};

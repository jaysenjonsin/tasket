import { Query } from 'node-appwrite';
import { DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from '../../config';
import { getMember } from '@/features/members/utils';
import { Workspace } from './types';
import { createSessionClient } from '@/lib/appwrite';
export const getWorkspaces = async () => {
  try {
    const { databases, account } = await createSessionClient();
    const user = await account.get();

    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal('userId', user.$id),
    ]);

    if (members.total === 0) {
      return { documents: [], total: 0 };
    }
    const workspaceIds = members.documents.map((member) => member.workspaceId);

    const workspaces = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACES_ID,
      [Query.orderDesc('$createdAt'), Query.contains('$id', workspaceIds)]
    );

    return workspaces;
    //workspaces looks like:
    // {
    //   documents: [
    //     {
    //       $id: '1',
    //       $createdAt: '2021-01-01',
    //       $updatedAt: '2021-01-01',
  } catch {
    return { documents: [], total: 0 };
  }
};

interface GetWorkspaceProps {
  workspaceId: string;
}
export const getWorkspace = async ({ workspaceId }: GetWorkspaceProps) => {
  try {
    const { databases, account } = await createSessionClient();
    const user = await account.get();

    //check if the user is a member of the workspace
    const member = await getMember({
      databases,
      userId: user.$id,
      workspaceId,
    });
    if (!member) return null;

    //type as Workspace to get type safety - otherwise it would be the generic document type from appwrite
    const workspace = await databases.getDocument<Workspace>(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId
    );

    return workspace;
  } catch {
    return null;
  }
};

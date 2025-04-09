import { getCurrent } from '@/features/auth/queries';
import { redirect } from 'next/navigation';

const WorkspaceIdPage = async ({ params }: any) => {
  const user = await getCurrent();
  if (!user) redirect('/sign-in');
  return <div>Workspace Id: {params.workspaceId}</div>;
};

export default WorkspaceIdPage;

import { getCurrent } from '@/features/auth/actions';
import { redirect } from 'next/navigation';

interface WorkspaceIdSettingsPageProps {
  params: {
    workspaceId: string;
  };
}
const WorkspaceIdSettingsPage = async ({
  params,
}: WorkspaceIdSettingsPageProps) => {
  const user = await getCurrent();
  if (!user) redirect('/sign-in');

  return <div>workspace settings page: {params.workspaceId}</div>;
};
export default WorkspaceIdSettingsPage;

import { CreateWorkspaceForm } from '@/features/workspaces/components/create-workspace-form';
import { getCurrent } from '@/features/auth/queries';
import { redirect } from 'next/navigation';

//not putting page in dashboard/workspaces/create because it will have its own layout
const Workspace = async () => {
  const user = await getCurrent();
  if (!user) redirect('/sign-in');
  return (
    <div className='w-full lg:max-w-xl'>
      <CreateWorkspaceForm />
    </div>
  );
};

export default Workspace;

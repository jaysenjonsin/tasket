'use client';

import { RiAddCircleFill } from 'react-icons/ri';
import { useGetProjects } from '@/features/projects/api/use-get-projects';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Projects = () => {
  const workspaceId = useWorkspaceId();
  const { data } = useGetProjects({
    workspaceId,
  });
  const pathname = usePathname();
  return (
    <div className='flex flex-col gap-y-2'>
      <div className='flex items-center justify-between'>
        <p className='text-xs uppercase text-neutral-500'>Projects</p>
        <RiAddCircleFill
          onClick={() => {}}
          className='size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition'
        />
      </div>
      {data?.documents.map((project) => {
        const href = `/workspaces/${workspaceId}/projects/${project.$id}`;
        const isActive = pathname === href;
        return <Link href={href} key={project.$id}></Link>;
      })}
    </div>
  );
};

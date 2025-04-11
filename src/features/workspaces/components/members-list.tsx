'use client';

import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';
import { DottedSeperator } from '@/components/dotted-seperator';
import { useGetMembers } from '../../members/api/use-get-members';
export const MembersList = () => {
  const workspaceId = useWorkspaceId();
  const { data } = useGetMembers({ workspaceId });
  return (
    <Card className='w-full h-full border-none shadow-none'>
      <CardHeader className='flex flex-row items-center gap-x-4 p-7 space-y-0'>
        <Button asChild variant='secondary' size='sm'>
          <Link href={`/workspaces/${workspaceId}`}>
            <ArrowLeftIcon className='size-4 mr-2' />
            Back
          </Link>
        </Button>
        <CardTitle className='text-xl font-bold'>Members List</CardTitle>
      </CardHeader>
      <div className='px-7'>
        <DottedSeperator />
      </div>
      <CardContent className='p-7'>
        {data?.documents.map((member, index) => (
          <div key={member.$id}>
            <div className='flex items-center gap-2'>
              <MemberAvatar />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

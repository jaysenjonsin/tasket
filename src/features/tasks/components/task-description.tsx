import { Task } from '../types';
import { useState } from 'react';
import { PencilIcon, XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useUpdateTask } from '../api/use-update-task';
import { DottedSeparator } from '@/components/dotted-separator';

interface TaskDescriptionProps {
  task: Task;
}

export const TaskDescription = ({ task }: TaskDescriptionProps) => {
  return (
    <div className='p-4 border rounded-lg'>
      <div className='flex items-center justify-between'>
        <p className='text-lg font-semibold'>Overview</p>
        <Button size='sm' variant='secondary'>
          <PencilIcon className='size-4 mr-2' />
          Edit
        </Button>
      </div>
      <DottedSeparator className='my-4' />
      <div className='flex flex-col gap-y-4'>
        <div>
          {task.description || (
            <span className='text-muted-foreground'>No description set</span>
          )}
        </div>
      </div>
    </div>
  );
};

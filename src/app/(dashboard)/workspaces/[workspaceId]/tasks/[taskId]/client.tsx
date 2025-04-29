'use client';
import { useTaskId } from '@/features/tasks/hooks/use-task-id';
import { useGetTask } from '@/features/tasks/api/use-get-task';
import { PageError } from '@/components/page-error';
import { PageLoader } from '@/components/page-loader';
export const TaskIdClient = () => {
  const taskId = useTaskId();
  const { data, isLoading } = useGetTask({ taskId });
  if (isLoading) {
    return <PageLoader />;
  }

  if (!data) {
    return <PageError message='Task not found' />;
  }
  return <p>{JSON.stringify(data)}</p>;
};

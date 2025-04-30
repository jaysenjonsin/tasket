import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { client } from '@/lib/rpc';
import { toast } from 'sonner';
//200: explicitly type response type as a success response. we already handle errors within the mutationFn
type ResponseType = InferResponseType<
  (typeof client.api.workspaces)[':workspaceId']['$patch'],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.workspaces)[':workspaceId']['$patch']
>;

export const useUpdateWorkspace = () => {
  const queryClient = useQueryClient();
  //useMutation creates an object that contains things like mutate, isPending, isError, isSuccess, etc.
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form, param }) => {
      const response = await client.api.workspaces[':workspaceId']['$patch']({
        form,
        param,
      });
      if (!response.ok) {
        throw new Error('Failed to update workspace');
      }
      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success('Workspace Updated');
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      queryClient.invalidateQueries({ queryKey: ['workspace', data.$id] });
    },
    onError: () => {
      toast.error('Failed to create workspace');
    },
  });

  return mutation;
};

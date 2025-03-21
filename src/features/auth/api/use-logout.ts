import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { client } from '@/lib/rpc';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

type ResponseType = InferResponseType<(typeof client.api.auth.logout)['$post']>;

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.auth.logout['$post']();
      return await response.json();
    },
    onSuccess: () => {
      //forces a re-fetch of all server rendered components on the page without a full reload
      router.refresh();
      //invalidate the current query when successfully logged out. when user logs out, forces refetch of querykey 'current',
      queryClient.invalidateQueries({ queryKey: ['current'] });
    },
  });

  return mutation; //returns the mutation object
};

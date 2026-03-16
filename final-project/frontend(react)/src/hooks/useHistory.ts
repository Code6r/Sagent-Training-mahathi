import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { historyApi } from '../api/historyApi';
import { History } from '../api/types';

export const useHistory = () => {
  const queryClient = useQueryClient();

  const historyQuery = useQuery({
    queryKey: ['history'],
    queryFn: historyApi.getHistory,
    retry: 1,
    select: (data) => {
      if (!Array.isArray(data)) return [];
      // Normalize completedAt: if null/undefined, set a safe default so filters don't crash
      return data.map(h => ({
        ...h,
        completedAt: h.completedAt ?? '',
      }));
    },
  });

  const createHistoryMutation = useMutation({
    mutationFn: historyApi.createHistory,
    onMutate: async (newHistory) => {
      await queryClient.cancelQueries({ queryKey: ['history'] });
      const previousHistory = queryClient.getQueryData<History[]>(['history']);
      queryClient.setQueryData<History[]>(['history'], (old = []) => [
        ...old,
        { ...newHistory, id: Date.now(), completedAt: new Date().toISOString() } as History,
      ]);
      return { previousHistory };
    },
    onError: (_err, _newHistory, context) => {
      if (context?.previousHistory) {
        queryClient.setQueryData(['history'], context.previousHistory);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['history'] });
    },
  });

  const deleteHistoryMutation = useMutation({
    mutationFn: historyApi.deleteHistory,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['history'] });
      const previousHistory = queryClient.getQueryData<History[]>(['history']);
      queryClient.setQueryData<History[]>(['history'], (old = []) => old.filter((h) => h.id !== id));
      return { previousHistory };
    },
    onError: (_err, _id, context) => {
      if (context?.previousHistory) {
        queryClient.setQueryData(['history'], context.previousHistory);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['history'] });
    },
  });

  return {
    history: historyQuery.data || [],
    isLoading: historyQuery.isLoading,
    createHistory: createHistoryMutation.mutate,
    deleteHistory: deleteHistoryMutation.mutate,
  };
};

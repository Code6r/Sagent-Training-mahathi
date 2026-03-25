import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { historyApi } from '../api/historyApi';
import { History } from '../api/types';
import { format } from 'date-fns';

import { getStoredUserId } from '../utils/auth';

export const useHistory = () => {
  const queryClient = useQueryClient();
  const userId = getStoredUserId();

  const historyQuery = useQuery({
    queryKey: ['history', userId],
    queryFn: historyApi.getHistory,
    retry: 1,
    enabled: userId > 0,
    select: (data) => {
      if (!Array.isArray(data)) return [];
      const localNow = new Date();
      const localISO = format(localNow, "yyyy-MM-dd'T'HH:mm:ss");
      
      return data.map(h => {
        let completedAt = (h as any).date || h.completedAt || localISO;
        // Basic check for valid-ish format
        if (completedAt.length < 10) completedAt = localISO;
        // Standardize space-separated dates to 'T' for ISO compatibility
        completedAt = completedAt.replace(' ', 'T');
        
        return {
          ...h,
          id: (h as any).historyId || h.id,
          completedAt,
        };
      });
    },
  });

  const createHistoryMutation = useMutation({
    mutationFn: historyApi.createHistory,
    onMutate: async (newHistory) => {
      await queryClient.cancelQueries({ queryKey: ['history', userId] });
      const previousHistory = queryClient.getQueryData<History[]>(['history', userId]);
      const localNow = new Date();
      const localISO = format(localNow, "yyyy-MM-dd'T'HH:mm:ss");
      queryClient.setQueryData<History[]>(['history', userId], (old = []) => [
        ...old,
        { ...newHistory, id: Date.now(), completedAt: localISO } as History,
      ]);
      return { previousHistory };
    },
    onError: (_err, _newHistory, context) => {
      if (context?.previousHistory) {
        queryClient.setQueryData(['history', userId], context.previousHistory);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['history', userId] });
    },
  });

  const deleteHistoryMutation = useMutation({
    mutationFn: historyApi.deleteHistory,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['history', userId] });
      const previousHistory = queryClient.getQueryData<History[]>(['history', userId]);
      queryClient.setQueryData<History[]>(['history', userId], (old = []) => old.filter((h) => h.id !== id));
      return { previousHistory };
    },
    onError: (_err, _id, context) => {
      if (context?.previousHistory) {
        queryClient.setQueryData(['history', userId], context.previousHistory);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['history', userId] });
    },
  });

  const updateHistoryMutation = useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<History> }) => historyApi.updateHistory(id, updates),
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: ['history', userId] });
      const previousHistory = queryClient.getQueryData<History[]>(['history', userId]);
      queryClient.setQueryData<History[]>(['history', userId], (old = []) => 
        old.map(h => {
          const entryId = (h as any).historyId || h.id;
          return entryId === id ? { ...h, ...updates } : h;
        })
      );
      return { previousHistory };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousHistory) {
        queryClient.setQueryData(['history', userId], context.previousHistory);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['history', userId] });
    },
  });

  return {
    history: historyQuery.data || [],
    isLoading: historyQuery.isLoading,
    createHistory: createHistoryMutation.mutate,
    updateHistory: updateHistoryMutation.mutate,
    deleteHistory: deleteHistoryMutation.mutate,
  };
};

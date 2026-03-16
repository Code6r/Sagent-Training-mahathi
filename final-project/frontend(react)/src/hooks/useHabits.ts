import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { habitApi } from '../api/habitApi';
import { Habit } from '../api/types';

export const useHabits = () => {
  const queryClient = useQueryClient();

  const habitsQuery = useQuery({
    queryKey: ['habits'],
    queryFn: habitApi.getHabits,
    retry: 1,
    select: (data) => (Array.isArray(data) ? data : []),
  });

  const createHabitMutation = useMutation({
    mutationFn: habitApi.createHabit,
    onMutate: async (newHabit) => {
      await queryClient.cancelQueries({ queryKey: ['habits'] });
      const previousHabits = queryClient.getQueryData<Habit[]>(['habits']);
      queryClient.setQueryData<Habit[]>(['habits'], (old = []) => [
        ...old,
        { ...newHabit, id: Date.now(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as Habit,
      ]);
      return { previousHabits };
    },
    onError: (_err, _newHabit, context) => {
      if (context?.previousHabits) {
        queryClient.setQueryData(['habits'], context.previousHabits);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    },
  });

  const updateHabitMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Habit> }) => habitApi.updateHabit(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['habits'] });
      const previousHabits = queryClient.getQueryData<Habit[]>(['habits']);
      queryClient.setQueryData<Habit[]>(['habits'], (old = []) =>
        old.map((habit) => (habit.id === id ? { ...habit, ...data } : habit))
      );
      return { previousHabits };
    },
    onError: (_err, _newHabit, context) => {
      if (context?.previousHabits) {
        queryClient.setQueryData(['habits'], context.previousHabits);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    },
  });

  const deleteHabitMutation = useMutation({
    mutationFn: habitApi.deleteHabit,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['habits'] });
      const previousHabits = queryClient.getQueryData<Habit[]>(['habits']);
      queryClient.setQueryData<Habit[]>(['habits'], (old = []) => old.filter((h) => h.id !== id));
      return { previousHabits };
    },
    onError: (_err, _id, context) => {
      if (context?.previousHabits) {
        queryClient.setQueryData(['habits'], context.previousHabits);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    },
  });

  return {
    habits: habitsQuery.data || [],
    isLoading: habitsQuery.isLoading,
    createHabit: createHabitMutation.mutate,
    updateHabit: updateHabitMutation.mutate,
    deleteHabit: deleteHabitMutation.mutate,
  };
};

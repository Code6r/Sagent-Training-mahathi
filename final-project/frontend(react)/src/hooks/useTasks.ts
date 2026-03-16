import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskApi } from '../api/taskApi';
import { Task } from '../api/types';

export const useTasks = (habitId?: number) => {
  const queryClient = useQueryClient();

  // If habitId provided → fetch tasks for that habit specifically; else fetch all
  const queryKey = habitId ? ['tasks', habitId] : ['tasks'];
  const queryFn = habitId
    ? () => taskApi.getTasksByHabit(habitId)
    : taskApi.getTasks;

  const tasksQuery = useQuery({
    queryKey,
    queryFn,
    retry: 1,
    select: (data) => {
      if (!Array.isArray(data)) return [];
      // If fetching by habit, ensure habitId is set on each task (backend might not return it)
      return data.map(t => ({
        ...t,
        habitId: t.habitId ?? habitId,
      }));
    },
    enabled: habitId !== undefined ? habitId > 0 : true,
  });

  const createTaskMutation = useMutation({
    mutationFn: taskApi.createTask,
    onMutate: async (newTask) => {
      const qk = newTask.habitId ? ['tasks', newTask.habitId] : ['tasks'];
      await queryClient.cancelQueries({ queryKey: qk });
      const previousTasks = queryClient.getQueryData<Task[]>(qk);
      // Optimistically add the task immediately (with temp id)
      queryClient.setQueryData<Task[]>(qk, (old = []) => [
        ...old,
        {
          id: -Date.now(), // temp negative id
          habitId: newTask.habitId!,
          title: newTask.title || '',
          completed: false,
          dueDate: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as Task,
      ]);
      return { previousTasks, qk };
    },
    onError: (_err, _newTask, context) => {
      if (context?.previousTasks && context.qk) {
        queryClient.setQueryData(context.qk, context.previousTasks);
      }
    },
    onSettled: (_data, _err, newTask) => {
      // Invalidate both the habit-specific and global task caches
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      if (newTask?.habitId) {
        queryClient.invalidateQueries({ queryKey: ['tasks', newTask.habitId] });
      }
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Task> }) => taskApi.updateTask(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey });
      const previousTasks = queryClient.getQueryData<Task[]>(queryKey);
      queryClient.setQueryData<Task[]>(queryKey, (old = []) =>
        old.map((task) => (task.id === id ? { ...task, ...data } : task))
      );
      return { previousTasks };
    },
    onError: (_err, _v, context) => {
      if (context?.previousTasks) queryClient.setQueryData(queryKey, context.previousTasks);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: taskApi.deleteTask,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey });
      const previousTasks = queryClient.getQueryData<Task[]>(queryKey);
      queryClient.setQueryData<Task[]>(queryKey, (old = []) => old.filter((t) => t.id !== id));
      return { previousTasks };
    },
    onError: (_err, _id, context) => {
      if (context?.previousTasks) queryClient.setQueryData(queryKey, context.previousTasks);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  return {
    tasks: tasksQuery.data || [],
    isLoading: tasksQuery.isLoading,
    createTask: createTaskMutation.mutate,
    updateTask: updateTaskMutation.mutate,
    deleteTask: deleteTaskMutation.mutate,
  };
};

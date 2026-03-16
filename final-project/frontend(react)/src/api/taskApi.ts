import api from './axiosClient';
import { Task } from './types';

/** Normalize a raw backend task response to the frontend Task type */
const normalizeTask = (t: any): Task => ({
  id: t.id ?? t.taskId ?? t.task_id,
  habitId: t.habitId ?? t.habit_id ?? t.taskHabitId ?? t.habit?.id,
  title: t.title || t.taskTitle || t.name || t.taskName || t.task_name || 'Unnamed Task',
  completed: t.completed ?? t.isCompleted ?? t.taskCompleted ?? false,
  dueDate: t.dueDate || t.due_date || t.taskDueDate || new Date().toISOString(),
  createdAt: t.createdAt || t.created_at || new Date().toISOString(),
  updatedAt: t.updatedAt || t.updated_at || new Date().toISOString(),
});

export const taskApi = {
  getTasks: async (): Promise<Task[]> => {
    const data = await api.get('/tasks');
    const arr = Array.isArray(data) ? data : [];
    return arr.map(normalizeTask);
  },
  getTasksByHabit: async (habitId: number): Promise<Task[]> => {
    const data = await api.get(`/tasks?habitId=${habitId}`);
    const arr = Array.isArray(data) ? data : [];
    return arr.map(normalizeTask);
  },
  getTaskById: async (id: number): Promise<Task> => {
    const data = await api.get(`/tasks/${id}`);
    return normalizeTask(data);
  },
  createTask: async (task: Partial<Task>): Promise<Task> => {
    const payload = {
      title: task.title,
      name: task.title,
      taskName: task.title,
      taskTitle: task.title,
      habitId: task.habitId,
      habit_id: task.habitId,
      completed: task.completed ?? false,
      dueDate: task.dueDate || new Date().toISOString(),
    };
    const data = await api.post('/tasks', payload);
    return normalizeTask(data);
  },
  updateTask: async (id: number, task: Partial<Task>): Promise<Task> => {
    const data = await api.put(`/tasks/${id}`, task);
    return normalizeTask(data);
  },
  deleteTask: (id: number): Promise<void> => api.delete(`/tasks/${id}`),
};

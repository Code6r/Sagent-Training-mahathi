import api from './axiosClient';
import { Habit } from './types';
import { getStoredUserId } from '../utils/auth';

const VALID_CATEGORIES = new Set(['HEALTH', 'CAREER', 'LEARNING', 'MINDFULNESS']);
const VALID_DIFFICULTIES = new Set(['EASY', 'MEDIUM', 'HARD']);

/** Normalize a raw backend habit response to the frontend Habit type */
const normalize = (h: any): Habit => ({
  id: h.id ?? h.habitId ?? h.habit_id,
  userId: h.userId ?? h.user_id ?? h.habitUserId ?? getStoredUserId(),
  name: h.name || h.habitName || h.habit_name || h.title || h.habitTitle || 'Unnamed Habit',
  description: h.description || h.habitDescription || h.habit_description || '',
  category: (VALID_CATEGORIES.has((h.category || '').toUpperCase())
    ? (h.category || '').toUpperCase()
    : VALID_CATEGORIES.has((h.habitCategory || '').toUpperCase())
    ? (h.habitCategory || '').toUpperCase()
    : 'HEALTH') as Habit['category'],
  difficulty: (VALID_DIFFICULTIES.has((h.difficulty || '').toUpperCase())
    ? (h.difficulty || '').toUpperCase()
    : VALID_DIFFICULTIES.has((h.habitDifficulty || '').toUpperCase())
    ? (h.habitDifficulty || '').toUpperCase()
    : 'EASY') as Habit['difficulty'],
  createdAt: h.createdAt || h.created_at || h.habitCreatedAt || new Date().toISOString(),
  updatedAt: h.updatedAt || h.updated_at || h.habitUpdatedAt || new Date().toISOString(),
  dependsOnId: h.dependsOnId ?? h.depends_on_id,
  templateId: h.templateId ?? h.template_id,
});

export const habitApi = {
  getHabits: async (): Promise<Habit[]> => {
    const userId = getStoredUserId();
    const data = await api.get(`/habits?userId=${userId}`);
    const arr = Array.isArray(data) ? data : [];
    return arr.map(normalize);
  },
  createHabit: async (habit: Partial<Habit>): Promise<Habit> => {
    const userId = getStoredUserId();
    const data = await api.post('/habits', {
      ...habit,
      name: habit.name,
      habitName: habit.name,     // Spring Boot entity field
      title: habit.name,
      description: habit.description,
      habitDescription: habit.description,
      category: habit.category,
      habitCategory: habit.category,
      difficulty: habit.difficulty,
      habitDifficulty: habit.difficulty,
      userId,
    });
    return normalize(data);
  },
  updateHabit: async (id: number, habit: Partial<Habit>): Promise<Habit> => {
    const data = await api.put(`/habits/${id}`, {
      ...habit,
      name: habit.name,
      habitName: habit.name,
    });
    return normalize(data);
  },
  deleteHabit: (id: number): Promise<void> => api.delete(`/habits/${id}`),
};

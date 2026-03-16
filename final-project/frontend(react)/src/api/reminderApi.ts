import api from './axiosClient';
import { Reminder } from './types';

export const reminderApi = {
  getReminders: (): Promise<Reminder[]> => api.get('/reminders'),
  createReminder: (reminder: Partial<Reminder>): Promise<Reminder> => api.post('/reminders', reminder),
  updateReminder: (id: number, reminder: Partial<Reminder>): Promise<Reminder> => api.put(`/reminders/${id}`, reminder),
  deleteReminder: (id: number): Promise<void> => api.delete(`/reminders/${id}`),
};

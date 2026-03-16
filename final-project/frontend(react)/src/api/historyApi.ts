import api from './axiosClient';
import { History } from './types';
import { getStoredUserId } from '../utils/auth';

export const historyApi = {
  getHistory: (): Promise<History[]> => {
    const userId = getStoredUserId();
    return api.get(`/history?userId=${userId}`);
  },
  getHistoryById: (id: number): Promise<History> => api.get(`/history/${id}`),
  createHistory: (history: Partial<History>): Promise<History> => {
    const userId = getStoredUserId();
    return api.post('/history', { ...history, userId });
  },
  updateHistory: (id: number, history: Partial<History>): Promise<History> => api.put(`/history/${id}`, history),
  deleteHistory: (id: number): Promise<void> => api.delete(`/history/${id}`),
};

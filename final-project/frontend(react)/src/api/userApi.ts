import api from './axiosClient';
import { User } from './types';

export const userApi = {
  getUser: (): Promise<User> => api.get('/users/me'),
  updateUser: (user: Partial<User>): Promise<User> => api.put('/users/me', user),
  login: async (credentials: any): Promise<{ token: string; user: User }> => {
    const users: User[] = await api.get('/users');
    const user = users.find(u => u.email === credentials.email && u.password === credentials.password);
    if (!user) {
      return Promise.reject({ response: { data: { message: 'Invalid email or password' } } });
    }
    return { token: 'mock-jwt-token', user };
  },
  signup: async (data: any): Promise<{ token: string; user: User }> => {
    const user: User = await api.post('/users', data);
    return { token: 'mock-jwt-token', user };
  },
};

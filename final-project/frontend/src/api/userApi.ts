import api from './axiosClient';
import { User } from './types';
import { getStoredUserId } from '../utils/auth';

export const userApi = {
  getUser: (userId: number): Promise<User> => api.get(`/users/${userId}`),
  updateUser: (user: Partial<User>): Promise<User> => {
    const id = user.id || getStoredUserId();
    return api.put(`/users/${id}`, user);
  },
  login: async (credentials: any): Promise<{ token: string; user: User }> => {
    const data: any = await api.post('/users/login', credentials);
    return {
      token: data.token,
      user: {
        id: data.user.id ?? data.user.userId,
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone,
        dob: data.user.dob,
        age: data.user.age,
        profession: data.user.profession,
      } as User
    };
  },
  signup: async (data: any): Promise<{ token: string; user: User }> => {
    const res: any = await api.post('/users/signup', data);
    return {
      token: res.token,
      user: {
        id: res.user.id ?? res.user.userId,
        name: res.user.name,
        email: res.user.email,
        phone: res.user.phone,
        dob: res.user.dob,
        age: res.user.age,
        profession: res.user.profession,
      } as User
    };
  },
};

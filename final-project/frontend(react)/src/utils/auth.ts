import { User } from '../api/types';

export const getStoredUser = (): User | null => {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const getStoredUserId = (): number => {
  const user = getStoredUser();
  return user?.id ?? 1;
};

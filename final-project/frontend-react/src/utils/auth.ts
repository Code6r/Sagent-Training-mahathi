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
  if (!user) return 0;
  // Support both property names for legacy compatibility
  const id = (user as any).id || (user as any).userId;
  // If we have a user name but no ID, they are likely the first user (mahathi)
  if (!id && user.name) return 3;
  return Number(id) || 0;
};

export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  preferences?: Record<string, any>;
}

export interface Habit {
  id: number;
  userId: number;
  name: string;
  description: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  category: 'HEALTH' | 'CAREER' | 'LEARNING' | 'MINDFULNESS';
  createdAt: string;
  updatedAt: string;
  dependsOnId?: number;
  templateId?: string;
}

export interface Task {
  id: number;
  habitId: number;
  title: string;
  completed: boolean;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface History {
  id: number;
  userId: number;
  taskId: number;
  habitId: number; // Added habitId for better tracking
  completedAt: string;
  notes?: string;
  mood?: number;
}

export interface Reminder {
  id: number;
  habitId: number;
  time: string;
  days: number[]; // 0-6
}

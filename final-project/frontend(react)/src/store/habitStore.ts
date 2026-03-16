import { create } from 'zustand';

interface HabitState {
  selectedHabitId: number | null;
  setSelectedHabitId: (id: number | null) => void;
  isFocusModeEnabled: boolean;
  toggleFocusMode: () => void;
}

export const useHabitStore = create<HabitState>((set) => ({
  selectedHabitId: null,
  setSelectedHabitId: (id) => set({ selectedHabitId: id }),
  isFocusModeEnabled: false,
  toggleFocusMode: () => set((state) => ({ isFocusModeEnabled: !state.isFocusModeEnabled })),
}));

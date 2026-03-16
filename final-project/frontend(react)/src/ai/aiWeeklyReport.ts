export interface WeeklyReport {
  consistency: number;
  topHabit: string;
  weakestHabit: string;
  recommendations: string[];
}

export const generateWeeklyReport = async (_stats: Record<string, any>): Promise<WeeklyReport> => {
  // Mock logic since AI is generally generated on the backend
  return {
    consistency: 78,
    topHabit: "Drink Water",
    weakestHabit: "Read 10 Pages",
    recommendations: [
      "Try moving your reading session to the morning.",
      "You built a great streak for hydration!",
      "Aim for 80% overall consistency next week."
    ]
  };
};

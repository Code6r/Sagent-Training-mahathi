const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const generateHabitPlan = async (goal: string): Promise<string[]> => {
  if (GEMINI_API_KEY) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Act as an expert Habit Coach. The user's ultimate goal is: "${goal}". Break this goal down into a realistic, specific 4-step daily routine. Return ONLY a valid, raw JSON array of exactly 4 short strings representing the tasks. Do not use markdown blocks like \`\`\`. Example output: ["Task 1", "Task 2", "Task 3", "Task 4"]`
            }]
          }]
        })
      });
      const data = await response.json();
      const rawText = data.candidates[0].content.parts[0].text;
      const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (e) {
      console.error("Gemini AI Generation failed", e);
    }
  }

  // Dynamic Contextual Fallbacks
  const keywords = goal.toLowerCase();
  
  if (keywords.includes('ui') || keywords.includes('ux') || keywords.includes('design')) {
    return [
      "Review 1 highly-rated UI case study",
      "Sketch low-fidelity frames for 15 mins",
      "Recreate 1 popular component in Figma",
      "Read an article on color theory or typography"
    ];
  }
  
  if (keywords.includes('front') || keywords.includes('react') || keywords.includes('dev')) {
    return [
      "Read 1 page of React/Framework docs",
      "Build a tiny isolated component",
      "Review PRs or open source code for 10 mins",
      "Solve 1 basic algorithm challenge"
    ];
  }

  if (keywords.includes('health') || keywords.includes('weight') || keywords.includes('fit')) {
    return [
      "Drink 500ml of water right after waking",
      "Do a 10-minute stretching routine",
      "Eat one serving of vegetables",
      "Walk outside for at least 15 minutes",
    ];
  }
  
  // Generic Fallback
  return [
    `Research a 5-minute hack for: ${goal}`,
    `Define exactly when you will work on ${goal}`,
    `Execute the smallest first step toward ${goal}`,
    `Write down 1 thing you learned about ${goal}`,
  ];
};

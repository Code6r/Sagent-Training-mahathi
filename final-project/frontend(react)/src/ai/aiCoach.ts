const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const generateCoachResponse = async (userMessage: string, context: Record<string, any>): Promise<string> => {
  if (GEMINI_API_KEY) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are Ascend AI, an empathetic, evidence-based habit coach. The user asks: "${userMessage}". Context: ${JSON.stringify(context)}. Provide a tailored, actionable response strictly under 2 sentences. No emojis.`
            }]
          }]
        })
      });
      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (e) {
      console.error("Gemini API Error", e);
    }
  }

  // Dynamic Contextual Fallback
  const lowerMsg = userMessage.toLowerCase();
  
  if (lowerMsg.includes('leetcode')) {
    return "Leetcode everyday is a marathon. Start by just opening a single easy problem without expecting to solve it immediately; consistency beats intensity.";
  }
  if (lowerMsg.includes('exercise') || lowerMsg.includes('gym') || lowerMsg.includes('workout')) {
    return "Getting out the door is the hardest part. Just put your shoes on and commit to a 5-minute warmup—you'll usually feel like doing more.";
  }
  if (lowerMsg.includes('sleep') || lowerMsg.includes('tired')) {
    return "Prioritize your wind-down routine tonight. Keep screens away 30 minutes before bed to protect your circadian rhythm.";
  }
  if (lowerMsg.includes('procrastinat') || lowerMsg.includes('focus')) {
    return "Procrastination is often disguised anxiety. Break down your current task into a micro-step that takes literally 2 minutes to complete.";
  }
  if (lowerMsg.includes('diet') || lowerMsg.includes('eat')) {
    return "Don't restrict too heavily. Focus on adding one healthy element (like more protein or water) rather than subtracting what you love.";
  }
  
  return "That's a very specific challenge. The key is to break it down into the smallest possible step that you can do within 2 minutes today.";
};

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Fail-safe coaching responses for when the API is down or rate-limited
const getFallbackResponse = (userMessage: string): string => {
  const msg = userMessage.toLowerCase();
  if (msg.includes('leetcode') || msg.includes('coding') || msg.includes('programming')) {
    return "Consistency is key for coding! Try 1-2 problems daily rather than a marathon. Break down complex algorithms into smaller parts. You've got this! 💻🔥";
  }
  if (msg.includes('routine') || msg.includes('morning') || msg.includes('habit')) {
    return "Building a solid routine starts with 'atomic' steps. Try anchoring your new habit to an existing one. Discipline beats motivation every time! 🎯✨";
  }
  if (msg.includes('procrastinat') || msg.includes('lazy') || msg.includes('unable')) {
    return "Resistance is normal. Try the '2-minute rule': just start for two minutes. Often, the hardest part is just beginning. Let's get moving! 🚀";
  }
  return "I'm here to support your growth! Focus on one small win today. What's the smallest step you can take toward your goal right now? 🌟";
};

export const generateCoachResponse = async (userMessage: string, context: Record<string, any>): Promise<string> => {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY') {
    return getFallbackResponse(userMessage);
  }

  try {
    // Using gemini-1.5-flash for reliability and higher quotas
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are Ascend AI, a world-class productivity and habit coach. 

            STRICT DOMAIN POLICY:
            - You ONLY discuss habits, productivity, focus, and personal growth.
            - If irrelevant, say: "I'm sorry, that is out of my scope as a habit coach. I'm here to help you achieve mastery in your daily routines! 🎯"

            Context: ${JSON.stringify(context)}.
            User Message: "${userMessage}".
            
            Task: Provide a motivating, expert coaching response (max 3 sentences). Use 1-2 emojis.`
          }]
        }]
      })
    });
    
    if (!response.ok) {
      console.warn(`Gemini API returned ${response.status}. Falling back to internal coaching logic.`);
      return getFallbackResponse(userMessage);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    return text ? text.trim() : getFallbackResponse(userMessage);

  } catch (e) {
    console.error("Gemini Error:", e);
    return getFallbackResponse(userMessage);
  }
};

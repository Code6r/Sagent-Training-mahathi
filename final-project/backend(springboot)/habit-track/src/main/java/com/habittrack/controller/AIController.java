package com.habittrack.controller;

import com.habittrack.service.AIService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * AI Controller to handle chatbot and generation requests.
 * Production-ready with safe user context extraction.
 */
@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AIController {

    private final AIService aiService;

    public AIController(AIService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/chat")
    public Map<String, String> chat(@RequestBody Map<String, Object> payload) {
        String message = (String) payload.get("message");
        if (message == null) message = "Hello";
        
        Long userId = 3L; // Default Context (Mahathi)
        try {
            if (payload.containsKey("userId") && payload.get("userId") != null) {
                String idStr = payload.get("userId").toString();
                if (!idStr.isEmpty() && !"null".equalsIgnoreCase(idStr)) {
                    userId = Long.parseLong(idStr);
                }
            }
        } catch (Exception e) {
            System.err.println(">>> [WARN] Invalid UserId in Request, using default: " + e.getMessage());
        }

        String reply = aiService.generateChatResponse(userId, message);
        return Map.of("reply", reply);
    }

    @PostMapping("/generate-plan")
    public Map<String, Object> generatePlan(@RequestBody Map<String, String> payload) {
        String goal = payload.get("goal");
        if (goal == null) goal = "Improve My Life";
        
        List<String> steps = aiService.generateHabitPlan(goal);
        return Map.of("plan", steps);
    }
}

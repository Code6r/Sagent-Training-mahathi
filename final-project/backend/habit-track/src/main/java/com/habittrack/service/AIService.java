package com.habittrack.service;

import com.habittrack.entity.Habit;
import com.habittrack.entity.History;
import com.habittrack.entity.Task;
import com.habittrack.repository.HabitRepository;
import com.habittrack.repository.HistoryRepository;
import com.habittrack.repository.TaskRepository;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.client.SimpleClientHttpRequestFactory;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Optimized AI Habit Coach Service.
 * Strict Domain Control, Concise Bullet-Point Responses, and Llama 3.3 Versatile Integration.
 */
@Service
public class AIService {

    private final String GROQ_API_KEY = System.getenv("GROQ_API_KEY") != null ? System.getenv("GROQ_API_KEY") : "YOUR_GITHUB_SCANNED_GROQ_KEY";
    private final String GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
    private final String ACTIVE_MODEL = "llama-3.3-70b-versatile";

    private final HabitRepository habitRepository;
    private final TaskRepository taskRepository;
    private final HistoryRepository historyRepository;
    private final RestTemplate restTemplate;

    public AIService(HabitRepository habitRepository, 
                     TaskRepository taskRepository, 
                     HistoryRepository historyRepository) {
        this.habitRepository = habitRepository;
        this.taskRepository = taskRepository;
        this.historyRepository = historyRepository;
        
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(8000);
        factory.setReadTimeout(8000);
        this.restTemplate = new RestTemplate(factory);
    }

    @SuppressWarnings("unchecked")
    public String generateChatResponse(Long userId, String userMessage) {
        // 1. DOMAIN FILTERING: Pre-check for obviously unrelated queries
        String msg = userMessage.toLowerCase();
        boolean isUnrelated = msg.contains("movie") || msg.contains("ticket") || msg.contains("shopping") || 
                             msg.contains("buy") || msg.contains("weather") || msg.contains("random") ||
                             msg.contains("joke") || msg.contains("song");
        
        // This is a safety layer, the AI will also handle this via the prompt.
        if (isUnrelated && !msg.contains("habit") && !msg.contains("task") && !msg.contains("goal")) {
            return "I'm designed to help with habits, productivity, and your tasks. Please ask something related to your goals.";
        }

        // 2. DATA CONTEXT: Fetch real-time data from DB
        List<Task> pendingTasks = taskRepository.findByUserIdAndCompletedFalse(userId);
        String today = LocalDate.now().toString();
        List<History> history = historyRepository.findByUserId(userId);
        long completedTodayCount = history.stream()
                .filter(h -> h.getDate() != null && h.getDate().startsWith(today))
                .count();

        String pendingTasksStr = pendingTasks.isEmpty() ? "No pending tasks." : 
            pendingTasks.stream().map(Task::getTaskName).collect(Collectors.joining(", "));

        // 3. STRICT SYSTEM PROMPT
        String systemPrompt = "You are a strict AI Habit Coach. Rules:\n" +
                              "* Answer in 2–3 short bullet points only\n" +
                              "* Be direct and concise\n" +
                              "* Do NOT add extra explanations\n" +
                              "* Use user data ONLY when relevant\n" +
                              "* If asked anything unrelated to habits, productivity, or goals, say EXACTLY: 'I'm designed to help with habits, productivity, and your tasks. Please ask something related to your goals.'";

        String userPrompt = String.format("User Data:\nPending Tasks: %s\nCompleted Today: %d\n\nUser Question: %s", 
                pendingTasksStr, completedTodayCount, userMessage);

        // 4. API CALL
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", ACTIVE_MODEL);
        requestBody.put("messages", List.of(
            Map.of("role", "system", "content", systemPrompt),
            Map.of("role", "user", "content", userPrompt)
        ));
        requestBody.put("temperature", 0.5); // Lower temperature for more focused responses

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(GROQ_API_KEY);

        try {
            ResponseEntity<Map> responseEntity = restTemplate.postForEntity(GROQ_URL, new HttpEntity<>(requestBody, headers), Map.class);
            Map<String, Object> response = responseEntity.getBody();

            if (response != null && response.containsKey("choices")) {
                List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
                if (!choices.isEmpty()) {
                    Map<String, Object> firstChoice = choices.get(0);
                    Map<String, Object> messageMap = (Map<String, Object>) firstChoice.get("message");
                    String content = (String) messageMap.get("content");
                    
                    // Final safety for domain
                    if (content.length() > 200 && (content.toLowerCase().contains("movie") || content.toLowerCase().contains("shopping"))) {
                         return "I'm designed to help with habits, productivity, and your tasks. Please ask something related to your goals.";
                    }
                    
                    return content;
                }
            }
            throw new RuntimeException("Empty AI Response");
        } catch (Exception e) {
            throw new RuntimeException("AI failed: " + e.getMessage());
        }
    }

    @SuppressWarnings("unchecked")
    public List<String> generateHabitPlan(String goal) {
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", ACTIVE_MODEL);
        requestBody.put("messages", List.of(
            Map.of("role", "system", "content", "Return ONLY a JSON array of 4 short routine steps. No preamble. Example: [\"Step 1\", \"Step 2\", \"Step 3\", \"Step 4\"]"),
            Map.of("role", "user", "content", "Goal: " + goal)
        ));
        requestBody.put("temperature", 0.5);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(GROQ_API_KEY);

        try {
            ResponseEntity<Map> responseEntity = restTemplate.postForEntity(GROQ_URL, new HttpEntity<>(requestBody, headers), Map.class);
            Map<String, Object> response = responseEntity.getBody();
            List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
            String content = (String) ((Map<String, Object>) choices.get(0).get("message")).get("content");
            
            String clean = content.replaceAll("```json", "").replaceAll("```", "").trim();
            if (clean.startsWith("[") && clean.endsWith("]")) {
                clean = clean.substring(1, clean.length() - 1);
                String[] parts = clean.split("\",\"");
                List<String> list = new ArrayList<>();
                for (String s : parts) list.add(s.replace("\"", "").trim());
                if (list.size() >= 4) return list.subList(0, 4);
            }
            throw new RuntimeException("Plan generation failed");
        } catch (Exception e) {
            throw new RuntimeException("Plan failed: " + e.getMessage());
        }
    }
}

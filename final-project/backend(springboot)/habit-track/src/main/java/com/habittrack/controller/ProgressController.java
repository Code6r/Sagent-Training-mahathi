package com.habittrack.controller;

import com.habittrack.entity.Habit;
import com.habittrack.entity.History;
import com.habittrack.entity.Task;
import com.habittrack.repository.HabitRepository;
import com.habittrack.repository.HistoryRepository;
import com.habittrack.repository.TaskRepository;
<<<<<<< HEAD
=======
import com.habittrack.service.HabitService;
import com.habittrack.service.TaskService;
>>>>>>> 2ee9d72654f3118279ef1e3d923893e10808dddc
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/progress")
@CrossOrigin(origins = "*")
public class ProgressController {

    private final HistoryRepository historyRepository;
    private final HabitRepository habitRepository;
    private final TaskRepository taskRepository;
<<<<<<< HEAD

    public ProgressController(HistoryRepository historyRepository, 
                              HabitRepository habitRepository, 
                              TaskRepository taskRepository) {
        this.historyRepository = historyRepository;
        this.habitRepository = habitRepository;
        this.taskRepository = taskRepository;
=======
    private final HabitService habitService;
    private final TaskService taskService;

    public ProgressController(HistoryRepository historyRepository, 
                              HabitRepository habitRepository, 
                              TaskRepository taskRepository,
                              HabitService habitService,
                              TaskService taskService) {
        this.historyRepository = historyRepository;
        this.habitRepository = habitRepository;
        this.taskRepository = taskRepository;
        this.habitService = habitService;
        this.taskService = taskService;
>>>>>>> 2ee9d72654f3118279ef1e3d923893e10808dddc
    }

    @GetMapping("/history")
    public List<Map<String, Object>> getProgressHistory(@RequestParam(required = false) Long userId) {
<<<<<<< HEAD
        List<History> historyList;
        if (userId != null) {
            historyList = historyRepository.findByUserId(userId);
        } else {
            historyList = historyRepository.findAll();
        }
        List<Map<String, Object>> result = new ArrayList<>();

        for (History history : historyList) {
            Map<String, Object> item = new HashMap<>();
            item.put("id", history.getHistoryId());
            item.put("completedDate", history.getDate());
            item.put("status", "Completed");

            if (history.getTaskId() != null) {
                Task task = taskRepository.findById(history.getTaskId()).orElse(null);
                item.put("name", task != null ? task.getTaskName() : "Unknown Task");
                item.put("type", "TASK");
            } else if (history.getHabitId() != null) {
                Habit habit = habitRepository.findById(history.getHabitId()).orElse(null);
                item.put("name", habit != null ? habit.getHabitName() : "Unknown Habit");
                item.put("type", "HABIT");
            } else {
                continue; // Skip if neither task nor habit
            }
            result.add(item);
        }
=======
        // Synonym Sync: Mahathi is 3L or 1L. We force 3L for consistency.
        if (userId == null || userId == 1L) userId = 3L;

        List<History> historyList = historyRepository.findByUserId(userId);
        List<Task> allTasks = taskService.getByUserId(userId);
        List<Habit> allHabits = habitService.getByUserId(userId);
        
        List<Map<String, Object>> result = new ArrayList<>();
        String today = java.time.LocalDate.now().toString();

        // 1. Process Historical COMPLETIONS (Persistent Records)
        for (History history : historyList) {
            Map<String, Object> item = new HashMap<>();
            String date = history.getDate();
            if (date == null && history.getCompletedAt() != null) {
                date = history.getCompletedAt().substring(0, 10);
            }
            if (date == null) date = "N/A";
            
            item.put("completedAtRaw", date);
            item.put("completedDate", date);
            item.put("status", "Completed");

            if (history.getTaskId() != null) {
                item.put("id", "HIST-T-" + history.getHistoryId());
                Task task = allTasks.stream().filter(t -> t.getTaskId().equals(history.getTaskId())).findFirst().orElse(null);
                item.put("name", task != null ? task.getTaskName() : "Completed Task");
                item.put("type", "TASK");
            } else if (history.getHabitId() != null) {
                item.put("id", "HIST-H-" + history.getHistoryId());
                Habit habit = allHabits.stream().filter(h -> h.getHabitId().equals(history.getHabitId())).findFirst().orElse(null);
                item.put("name", habit != null ? habit.getHabitName() : "Completed Habit");
                item.put("type", "HABIT");
            } else {
                continue; 
            }
            result.add(item);
        }

        // 2. DAILY AUDIT: Ensure all habits are represented today
        for (Habit habit : allHabits) {
            // Check if this specific habit instance was already recorded as COMPLETED today
            boolean alreadyFinishedToday = result.stream().anyMatch(r -> 
                "HABIT".equals(r.get("type")) && 
                habit.getHabitName().equalsIgnoreCase((String) r.get("name")) && 
                today.equals(r.get("completedDate"))
            );
            
            if (alreadyFinishedToday) continue;

            Map<String, Object> item = new HashMap<>();
            item.put("id", "AUDIT-HB-" + habit.getHabitId());
            item.put("name", habit.getHabitName());
            item.put("type", "HABIT");
            item.put("completedAtRaw", today);
            item.put("completedDate", today);

            // A habit is "Pending" if it has any task that is NOT yet completed
            boolean hasIncompleteTasks = allTasks.stream()
                .anyMatch(t -> t.getHabitId().equals(habit.getHabitId()) && !t.isCompleted());
            
            item.put("status", hasIncompleteTasks ? "Pending" : "Completed");
            result.add(item);
        }

        // 3. PENDING TASKS AUDIT (Items to be done)
        for (Task task : allTasks) {
            if (!task.isCompleted()) {
                Map<String, Object> item = new HashMap<>();
                item.put("id", "TODO-TK-" + task.getTaskId());
                item.put("name", task.getTaskName());
                item.put("type", "TASK");
                
                String dueDate = task.getDueDate();
                if (dueDate == null) dueDate = today;
                item.put("completedDate", dueDate);
                item.put("completedAtRaw", dueDate);

                if (dueDate.compareTo(today) < 0) {
                    item.put("status", "Overdue");
                } else {
                    item.put("status", "Pending");
                }
                result.add(item);
            }
        }

        // 4. Sort: Date desc, Status (Overdue > Pending > Completed)
        result.sort((a, b) -> {
            String dateA = (String) a.get("completedAtRaw");
            String dateB = (String) b.get("completedAtRaw");
            int dateCmp = dateB.compareTo(dateA);
            if (dateCmp != 0) return dateCmp;
            
            Map<String, Integer> priority = Map.of("Overdue", 4, "Pending", 3, "Completed", 2);
            return priority.getOrDefault(b.get("status"), 0).compareTo(priority.getOrDefault(a.get("status"), 0));
        });

>>>>>>> 2ee9d72654f3118279ef1e3d923893e10808dddc
        return result;
    }
}

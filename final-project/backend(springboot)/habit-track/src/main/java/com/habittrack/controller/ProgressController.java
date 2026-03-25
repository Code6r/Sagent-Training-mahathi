package com.habittrack.controller;

import com.habittrack.entity.Habit;
import com.habittrack.entity.History;
import com.habittrack.entity.Task;
import com.habittrack.repository.HabitRepository;
import com.habittrack.repository.HistoryRepository;
import com.habittrack.repository.TaskRepository;
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

    public ProgressController(HistoryRepository historyRepository, 
                              HabitRepository habitRepository, 
                              TaskRepository taskRepository) {
        this.historyRepository = historyRepository;
        this.habitRepository = habitRepository;
        this.taskRepository = taskRepository;
    }

    @GetMapping("/history")
    public List<Map<String, Object>> getProgressHistory(@RequestParam(required = false) Long userId) {
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
        return result;
    }
}

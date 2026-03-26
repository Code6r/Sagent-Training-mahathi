package com.habittrack.controller;

import com.habittrack.entity.Habit;
import com.habittrack.entity.Task;
import com.habittrack.entity.History;
import com.habittrack.service.HabitService;
import com.habittrack.service.TaskService;
import com.habittrack.service.HistoryService;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import org.springframework.jdbc.core.JdbcTemplate;

@RestController
@RequestMapping("/api/migration")
@CrossOrigin(origins = "*")
public class MigrationController {

    private final HabitService habitService;
    private final TaskService taskService;
    private final HistoryService historyService;
    private final JdbcTemplate jdbcTemplate;

    public MigrationController(HabitService habitService, TaskService taskService, HistoryService historyService, JdbcTemplate jdbcTemplate) {
        this.habitService = habitService;
        this.taskService = taskService;
        this.historyService = historyService;
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/fix-schema")
    public Map<String, Object> fixSchema() {
        Map<String, Object> result = new HashMap<>();
        try {
            // Drop the incorrect unique constraint that prevents multiple history entries for same task
            jdbcTemplate.execute("ALTER TABLE history DROP INDEX UKdw887jxcyr3bydlwsvwpa8hac");
            result.put("status", "Success - Incorrect unique constraint dropped");
        } catch (Exception e) {
            result.put("status", "Error or already dropped: " + e.getMessage());
        }
        return result;
    }

    @GetMapping("/fix-all")
    public Map<String, Object> fixAll() {
        Map<String, Object> result = new HashMap<>();
        Long mahathiId = 3L; // Verified from database list
        
        List<Habit> habits = habitService.getAll();
        int habitsFixed = 0;
        for (Habit h : habits) {
            // FIX: If assigned to wrong placeholder user (1) or null, move to Mahathi (3)
            if (h.getUserId() == null || h.getUserId() == 0 || h.getUserId() == 1L) {
                h.setUserId(mahathiId);
                habitService.create(h);
                habitsFixed++;
            }
        }
        
        List<Task> tasks = taskService.getAll();
        int tasksFixed = 0;
        for (Task t : tasks) {
            if (t.getUserId() == null || t.getUserId() == 0 || t.getUserId() == 1L) {
                t.setUserId(mahathiId);
                taskService.create(t);
                tasksFixed++;
            }
        }

        List<History> historyArr = historyService.getAll();
        int historyFixed = 0;
        String now = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss"));
        for (History h : historyArr) {
            boolean changed = false;
            // Legacy/orphaned merge
            if (h.getUserId() == null || h.getUserId() == 0 || h.getUserId() == 1L) {
                h.setUserId(mahathiId);
                changed = true;
            }
            // Fix missing dates for visualization
            if (h.getCompletedAt() == null || h.getCompletedAt().isEmpty()) {
                h.setCompletedAt(now);
                h.setDate(now.substring(0, 10));
                changed = true;
            }
            // Fix missing habitId by looking up the task
            if (h.getHabitId() == null || h.getHabitId() == 0) {
                Long tid = h.getTaskId();
                if (tid != null) {
                    Task t = taskService.getById(tid);
                    if (t != null) {
                        h.setHabitId(t.getHabitId());
                        changed = true;
                    }
                }
            }
            // Final fallback to 8 if still missing
            if (h.getHabitId() == null || h.getHabitId() == 0) {
                h.setHabitId(8L);
                changed = true;
            }
            if (changed) {
                historyService.create(h);
                historyFixed++;
            }
        }
        
        result.put("habitsFixed", habitsFixed);
        result.put("tasksFixed", tasksFixed);
        result.put("historyFixed", historyFixed);
        result.put("mahathiIdUsed", mahathiId);
        result.put("status", "Success - All data moved to Mahathi (User #3)");
        return result;
    }
}

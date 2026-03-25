package com.habittrack.service;

import com.habittrack.entity.Task;
import com.habittrack.repository.TaskRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TaskService {

    private final TaskRepository repo;

    public TaskService(TaskRepository repo){ this.repo = repo; }

    public List<Task> getAll(){ return repo.findAll(); }

    public List<Task> getByHabitId(Long habitId){ return repo.findByHabitId(habitId); }
    public List<Task> getByUserId(Long userId){ 
        List<Task> tasks = repo.findByUserId(userId);
        // Robust Migration: For primary user (Mahathi is ID 3, fallback 1), permanently fix any null or 0 userId tasks
        if (userId != null && (userId == 1 || userId == 3)) {
            boolean changed = false;
            for (Task t : tasks) {
                if (t.getUserId() == null || t.getUserId() == 0) {
                    t.setUserId(userId);
                    repo.save(t);
                    changed = true;
                }
            }
            if (changed) tasks = repo.findByUserId(userId); // Refetch clean data
        }
        return tasks;
    }

    public List<Task> getByUserId(Long userId){ return repo.findByUserId(userId); }

    public Task getById(Long id){ return repo.findById(id).orElse(null); }

    public Task create(Task task){ return repo.save(task); }

    public Task update(Long id, Task task){
        Task existing = repo.findById(id).orElse(null);
        if (existing == null) return null;
        
        if (task.getTaskName() != null) existing.setTaskName(task.getTaskName());
        if (task.getStatus() != null) existing.setStatus(task.getStatus());
        existing.setCompleted(task.isCompleted());
        if (task.getDueDate() != null) existing.setDueDate(task.getDueDate());
        
        return repo.save(existing);
    }

    public void delete(Long id){ repo.deleteById(id); }
}
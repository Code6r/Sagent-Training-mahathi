package com.habittrack.service;

import com.habittrack.entity.Habit;
import com.habittrack.repository.HabitRepository;
import org.springframework.stereotype.Service;
import java.util.List;

import com.habittrack.repository.TaskRepository;
import com.habittrack.repository.HistoryRepository;
import com.habittrack.repository.ReminderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class HabitService {

    private final HabitRepository repo;
    private final TaskRepository taskRepo;
    private final HistoryRepository historyRepo;
    private final ReminderRepository reminderRepo;

    public HabitService(HabitRepository repo, TaskRepository taskRepo, HistoryRepository historyRepo, ReminderRepository reminderRepo){
        this.repo = repo;
        this.taskRepo = taskRepo;
        this.historyRepo = historyRepo;
        this.reminderRepo = reminderRepo;
    }

    public List<Habit> getAll(){ return repo.findAll(); }

    public List<Habit> getByUserId(Long userId){ 
        List<Habit> habits = repo.findByUserId(userId);
        // Robust Migration: For primary user (Mahathi is ID 3, fallback 1), permanently fix any null or 0 userId habits
        if (userId != null && (userId == 1 || userId == 3)) {
            boolean changed = false;
            for (Habit h : habits) {
                if (h.getUserId() == null || h.getUserId() == 0) {
                    h.setUserId(userId);
                    repo.save(h);
                    changed = true;
                }
            }
            if (changed) habits = repo.findByUserId(userId); // Refetch clean data
        }
        return habits;
    }

    public Habit getById(Long id){ return repo.findById(id).orElse(null); }

    public Habit create(Habit habit){ return repo.save(habit); }

    public Habit update(Long id, Habit habit){
        Habit existing = repo.findById(id).orElse(null);
        if (existing == null) return null;
        
        if (habit.getHabitName() != null) existing.setHabitName(habit.getHabitName());
        if (habit.getDescription() != null) existing.setDescription(habit.getDescription());
        if (habit.getCategory() != null) existing.setCategory(habit.getCategory());
        if (habit.getDifficulty() != null) existing.setDifficulty(habit.getDifficulty());
        if (habit.getFrequency() != null) existing.setFrequency(habit.getFrequency());
        if (habit.getStatus() != null) existing.setStatus(habit.getStatus());
        if (habit.getStreaks() > 0) existing.setStreaks(habit.getStreaks());
        
        // userId should never change via this update
        return repo.save(existing);
    }

    @Transactional
    public void delete(Long id){
        // Manually cascade delete associated data
        historyRepo.deleteByHabitId(id);
        taskRepo.deleteByHabitId(id);
        reminderRepo.deleteByHabitId(id);
        repo.deleteById(id);
    }
}
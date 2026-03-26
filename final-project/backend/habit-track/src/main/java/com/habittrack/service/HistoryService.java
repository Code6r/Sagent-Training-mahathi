package com.habittrack.service;

import com.habittrack.entity.History;
import com.habittrack.repository.HistoryRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class HistoryService {

    private final HistoryRepository repo;

    public HistoryService(HistoryRepository repo){ this.repo = repo; }

    public List<History> getAll(){ return repo.findAll(); }

    public List<History> getByUserId(Long userId){ 
        List<History> historyArr = repo.findByUserId(userId);
        // Robust Migration: For primary user (Mahathi is ID 3, fallback 1), permanently fix any null or 0 userId history entries
        if (userId != null && (userId == 1 || userId == 3)) {
            boolean changed = false;
            for (History h : historyArr) {
                if (h.getUserId() == null || h.getUserId() == 0) {
                    h.setUserId(userId);
                    repo.save(h);
                    changed = true;
                }
            }
            if (changed) historyArr = repo.findByUserId(userId); // Refetch clean data
        }
        return historyArr; 
    }

    public List<History> getByTaskId(Long taskId){ return repo.findByTaskId(taskId); }

    public List<History> getByHabitId(Long habitId){ return repo.findByHabitId(habitId); }

    public History getById(Long id){ return repo.findById(id).orElse(null); }

    public History create(History history){ return repo.save(history); }

    public History update(Long id, History updates){
        History existing = repo.findById(id).orElse(null);
        if (existing == null) return null;
        
        if (updates.getNotes() != null) existing.setNotes(updates.getNotes());
        if (updates.getMood() != null) existing.setMood(updates.getMood());
        if (updates.getStatus() != null) existing.setStatus(updates.getStatus());
        if (updates.getCompletedAt() != null) existing.setCompletedAt(updates.getCompletedAt());
        
        return repo.save(existing);
    }

    public void delete(Long id){ repo.deleteById(id); }
}
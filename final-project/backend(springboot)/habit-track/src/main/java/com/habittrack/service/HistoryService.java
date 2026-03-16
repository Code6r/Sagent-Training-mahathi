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

    public List<History> getByUserId(Long userId){ return repo.findByUserId(userId); }

    public List<History> getByTaskId(Long taskId){ return repo.findByTaskId(taskId); }

    public List<History> getByHabitId(Long habitId){ return repo.findByHabitId(habitId); }

    public History getById(Long id){ return repo.findById(id).orElse(null); }

    public History create(History history){ return repo.save(history); }

    public History update(Long id, History history){
        history.setHistoryId(id);
        return repo.save(history);
    }

    public void delete(Long id){ repo.deleteById(id); }
}
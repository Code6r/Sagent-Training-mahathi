package com.habittrack.service;

import com.habittrack.entity.Habit;
import com.habittrack.repository.HabitRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class HabitService {

    private final HabitRepository repo;

    public HabitService(HabitRepository repo){ this.repo = repo; }

    public List<Habit> getAll(){ return repo.findAll(); }

    public List<Habit> getByUserId(Long userId){ return repo.findByUserId(userId); }

    public Habit getById(Long id){ return repo.findById(id).orElse(null); }

    public Habit create(Habit habit){ return repo.save(habit); }

    public Habit update(Long id, Habit habit){
        habit.setHabitId(id);
        return repo.save(habit);
    }

    public void delete(Long id){ repo.deleteById(id); }
}
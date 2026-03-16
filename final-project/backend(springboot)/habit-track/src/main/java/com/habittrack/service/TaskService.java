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

    public Task getById(Long id){ return repo.findById(id).orElse(null); }

    public Task create(Task task){ return repo.save(task); }

    public Task update(Long id, Task task){
        task.setTaskId(id);
        return repo.save(task);
    }

    public void delete(Long id){ repo.deleteById(id); }
}
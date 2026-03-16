package com.habittrack.controller;

import com.habittrack.entity.Task;
import com.habittrack.service.TaskService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    private final TaskService service;

    public TaskController(TaskService service){ this.service = service; }

    @GetMapping
    public List<Task> getAll(@RequestParam(required = false) Long habitId){
        if (habitId != null) return service.getByHabitId(habitId);
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Task getById(@PathVariable Long id){
        return service.getById(id);
    }

    @PostMapping
    public Task create(@RequestBody Task task){
        return service.create(task);
    }

    @PutMapping("/{id}")
    public Task update(@PathVariable Long id, @RequestBody Task task){
        return service.update(id, task);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        service.delete(id);
    }
}
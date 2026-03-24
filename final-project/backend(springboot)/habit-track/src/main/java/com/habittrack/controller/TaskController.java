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
    public List<Task> getAll(
            @RequestParam(name = "habitId", required = false) Long habitId,
            @RequestParam(name = "userId", required = false) Long userId){
        if (habitId != null) return service.getByHabitId(habitId);
        if (userId != null) return service.getByUserId(userId);
        return List.of();
    }

    @GetMapping("/{id}")
    public Task getById(@PathVariable(name = "id") Long id){
        return service.getById(id);
    }

    @PostMapping
    public Task create(@RequestBody Task task){
        return service.create(task);
    }

    @PutMapping("/{id}")
    public Task update(@PathVariable(name = "id") Long id, @RequestBody Task task){
        return service.update(id, task);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable(name = "id") Long id){
        service.delete(id);
    }
}
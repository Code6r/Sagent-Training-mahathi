package com.habittrack.controller;

import com.habittrack.entity.History;
import com.habittrack.service.HistoryService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/history")
@CrossOrigin(origins = "*")
public class HistoryController {

    private final HistoryService service;

    public HistoryController(HistoryService service){ this.service = service; }

    @GetMapping
    public List<History> getAll(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) Long taskId,
            @RequestParam(required = false) Long habitId){
        if (userId != null)  return service.getByUserId(userId);
        if (taskId != null)  return service.getByTaskId(taskId);
        if (habitId != null) return service.getByHabitId(habitId);
        return service.getAll();
    }

    @GetMapping("/{id}")
    public History getById(@PathVariable Long id){
        return service.getById(id);
    }

    @PostMapping
    public History create(@RequestBody History history){
        return service.create(history);
    }

    @PutMapping("/{id}")
    public History update(@PathVariable Long id, @RequestBody History history){
        return service.update(id, history);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        service.delete(id);
    }
}
package com.habittrack.controller;

import com.habittrack.entity.Habit;
import com.habittrack.service.HabitService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/habits")
@CrossOrigin(origins = "*")
public class HabitController {

    private final HabitService service;

    public HabitController(HabitService service){ this.service = service; }

    @GetMapping
    public List<Habit> getAll(@RequestParam(required = false) Long userId){
        if (userId != null) return service.getByUserId(userId);
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Habit getById(@PathVariable Long id){
        return service.getById(id);
    }

    @PostMapping
    public Habit create(@RequestBody Habit habit){
        return service.create(habit);
    }

    @PutMapping("/{id}")
    public Habit update(@PathVariable Long id, @RequestBody Habit habit){
        return service.update(id, habit);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        service.delete(id);
    }
}
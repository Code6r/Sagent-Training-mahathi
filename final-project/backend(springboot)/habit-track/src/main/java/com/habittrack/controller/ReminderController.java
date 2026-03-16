package com.habittrack.controller;

import com.habittrack.entity.Reminder;
import com.habittrack.service.ReminderService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reminders")
@CrossOrigin(origins="*")
public class ReminderController {

    private final ReminderService service;

    public ReminderController(ReminderService service){
        this.service = service;
    }

    @GetMapping
    public List<Reminder> getAll(){
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Reminder getById(@PathVariable Long id){
        return service.getById(id);
    }

    @PostMapping
    public Reminder create(@RequestBody Reminder reminder){
        return service.create(reminder);
    }

    @PutMapping("/{id}")
    public Reminder update(@PathVariable Long id,@RequestBody Reminder reminder){
        return service.update(id,reminder);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        service.delete(id);
    }
}
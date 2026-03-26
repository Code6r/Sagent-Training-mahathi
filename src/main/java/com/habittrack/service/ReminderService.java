package com.habittrack.service;

import com.habittrack.entity.Reminder;
import com.habittrack.repository.ReminderRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReminderService {

    private final ReminderRepository repo;

    public ReminderService(ReminderRepository repo){
        this.repo = repo;
    }

    public List<Reminder> getAll(){
        return repo.findAll();
    }

    public Reminder getById(Long id){
        return repo.findById(id).orElse(null);
    }

    public Reminder create(Reminder reminder){
        return repo.save(reminder);
    }

    public Reminder update(Long id,Reminder reminder){
        reminder.setReminderId(id);
        return repo.save(reminder);
    }

    public void delete(Long id){
        repo.deleteById(id);
    }
}
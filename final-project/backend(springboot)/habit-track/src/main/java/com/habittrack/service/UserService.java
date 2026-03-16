package com.habittrack.service;

import com.habittrack.entity.User;
import com.habittrack.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository repo;

    public UserService(UserRepository repo){
        this.repo = repo;
    }

    public List<User> getAll(){
        return repo.findAll();
    }

    public User getById(Long id){
        return repo.findById(id).orElse(null);
    }

    public User create(User user){
        return repo.save(user);
    }

    public User update(Long id,User user){
        user.setUserId(id);
        return repo.save(user);
    }

    public void delete(Long id){
        repo.deleteById(id);
    }
}
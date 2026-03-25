package com.habittrack.repository;

import com.habittrack.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByHabitId(Long habitId);
    List<Task> findByUserId(Long userId);
}
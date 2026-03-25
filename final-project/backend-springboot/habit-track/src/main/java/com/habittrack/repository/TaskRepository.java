package com.habittrack.repository;

import com.habittrack.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByHabitId(Long habitId);
<<<<<<< HEAD
    List<Task> findByUserId(Long userId);
=======
    
    @org.springframework.data.jpa.repository.Query("SELECT t FROM Task t WHERE t.userId = :userId OR (t.userId IS NULL AND (:userId = 1 OR :userId = 3))")
    List<Task> findByUserId(@org.springframework.data.repository.query.Param("userId") Long userId);

    @org.springframework.data.jpa.repository.Query("SELECT t FROM Task t WHERE (t.userId = :userId OR (t.userId IS NULL AND (:userId = 1 OR :userId = 3))) AND t.completed = true")
    List<Task> findByUserIdAndCompletedTrue(@org.springframework.data.repository.query.Param("userId") Long userId);

    @org.springframework.data.jpa.repository.Query("SELECT t FROM Task t WHERE (t.userId = :userId OR (t.userId IS NULL AND (:userId = 1 OR :userId = 3))) AND t.completed = false")
    List<Task> findByUserIdAndCompletedFalse(@org.springframework.data.repository.query.Param("userId") Long userId);

    @Transactional
    void deleteByHabitId(Long habitId);
>>>>>>> 2ee9d72654f3118279ef1e3d923893e10808dddc
}
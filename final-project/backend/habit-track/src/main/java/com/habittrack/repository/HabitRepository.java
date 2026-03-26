package com.habittrack.repository;

import com.habittrack.entity.Habit;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface HabitRepository extends JpaRepository<Habit, Long> {
    @org.springframework.data.jpa.repository.Query("SELECT h FROM Habit h WHERE h.userId = :userId OR (h.userId IS NULL AND (:userId = 1 OR :userId = 3))")
    List<Habit> findByUserId(@org.springframework.data.repository.query.Param("userId") Long userId);
}
package com.habittrack.repository;

import com.habittrack.entity.History;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Repository
public interface HistoryRepository extends JpaRepository<History, Long> {
    @org.springframework.data.jpa.repository.Query("SELECT h FROM History h WHERE h.userId = :userId OR (h.userId IS NULL AND (:userId = 1 OR :userId = 3))")
    List<History> findByUserId(@org.springframework.data.repository.query.Param("userId") Long userId);
    List<History> findByTaskId(Long taskId);
    List<History> findByHabitId(Long habitId);

    @Transactional
    void deleteByHabitId(Long habitId);
}
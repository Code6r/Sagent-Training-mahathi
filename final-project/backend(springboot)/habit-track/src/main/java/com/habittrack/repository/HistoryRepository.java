package com.habittrack.repository;

import com.habittrack.entity.History;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HistoryRepository extends JpaRepository<History, Long> {
    List<History> findByUserId(Long userId);
    List<History> findByTaskId(Long taskId);
    List<History> findByHabitId(Long habitId);
}
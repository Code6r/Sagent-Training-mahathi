package com.habittrack.repository;

import com.habittrack.entity.Reminder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Repository
public interface ReminderRepository extends JpaRepository<Reminder, Long> {
    List<Reminder> findByHabitId(Long habitId);

    @Transactional
    void deleteByHabitId(Long habitId);
}
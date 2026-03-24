package com.habittrack.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Entity
public class History {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long historyId;

    @Column(name = "task_id_v2")
    private Long taskId;

    @Column(name = "task_id")
    private Long legacyTaskId;
    private Long habitId;
    private Long userId;
    private String completedAt;   // ISO string e.g. "2026-03-12T17:00:00"
    private String date;          // kept for backward compat
    private String status;
    private String notes;
    private Integer mood;

    public History() {
        this.completedAt = LocalDateTime.now()
                .format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss"));
        this.date = this.completedAt.substring(0, 10);
        this.status = "DONE";
    }

    public Long getHistoryId() { return historyId; }
    public void setHistoryId(Long historyId) { this.historyId = historyId; }

    public Long getTaskId() { 
        if (taskId != null) return taskId;
        return legacyTaskId;
    }
    public void setTaskId(Long taskId) { this.taskId = taskId; }

    public Long getLegacyTaskId() { return legacyTaskId; }
    public void setLegacyTaskId(Long legacyTaskId) { this.legacyTaskId = legacyTaskId; }

    public Long getHabitId() { return habitId; }
    public void setHabitId(Long habitId) { this.habitId = habitId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getCompletedAt() { return completedAt; }
    public void setCompletedAt(String completedAt) { this.completedAt = completedAt; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Integer getMood() { return mood; }
    public void setMood(Integer mood) { this.mood = mood; }
}
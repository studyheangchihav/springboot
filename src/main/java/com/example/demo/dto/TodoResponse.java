package com.example.demo.dto;

import com.example.demo.entity.Todo;
import com.example.demo.enums.Priority;
import java.time.LocalDateTime;

public class TodoResponse {

    private Long id;
    private String title;
    private String description;
    private boolean completed;
    private Priority priority;
    private LocalDateTime createdAt;

    public TodoResponse() {
    }

    public TodoResponse(Long id, String title, String description, boolean completed, Priority priority, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.completed = completed;
        this.priority = priority;
        this.createdAt = createdAt;
    }

    public static TodoResponse fromEntity(Todo todo) {
        return new TodoResponse(
            todo.getId(),
            todo.getTitle(),
            todo.getDescription(),
            todo.isCompleted(),
            todo.getPriority(),
            todo.getCreatedAt()
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public Priority getPriority() {
        return priority;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

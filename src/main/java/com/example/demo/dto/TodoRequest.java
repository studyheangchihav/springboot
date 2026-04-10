package com.example.demo.dto;

import com.example.demo.enums.Priority;

public class TodoRequest {

    private String title;
    private String description;
    private boolean completed;
    private Priority priority;

    public TodoRequest() {
    }

    public TodoRequest(String title, String description, boolean completed, Priority priority) {
        this.title = title;
        this.description = description;
        this.completed = completed;
        this.priority = priority;
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
}

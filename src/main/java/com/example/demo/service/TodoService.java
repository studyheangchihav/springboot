package com.example.demo.service;

import com.example.demo.dto.TodoRequest;
import com.example.demo.dto.TodoResponse;
import com.example.demo.entity.Todo;
import com.example.demo.exception.TodoNotFoundException;
import com.example.demo.repository.TodoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TodoService {

    private final TodoRepository todoRepository;

    public TodoService(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    public List<TodoResponse> getAllTodos() {
        return todoRepository.findAll().stream()
            .map(TodoResponse::fromEntity)
            .toList();
    }

    public TodoResponse getTodoById(Long id) {
        return todoRepository.findById(id)
            .map(TodoResponse::fromEntity)
            .orElseThrow(() -> new TodoNotFoundException("Todo not found with id " + id));
    }

    public TodoResponse createTodo(TodoRequest request) {
        Todo todo = new Todo(
            request.getTitle(),
            request.getDescription(),
            request.isCompleted(),
            request.getPriority()
        );
        return TodoResponse.fromEntity(todoRepository.save(todo));
    }

    public TodoResponse updateTodo(Long id, TodoRequest request) {
        Todo todo = todoRepository.findById(id)
            .orElseThrow(() -> new TodoNotFoundException("Todo not found with id " + id));

        todo.setTitle(request.getTitle());
        todo.setDescription(request.getDescription());
        todo.setCompleted(request.isCompleted());
        todo.setPriority(request.getPriority());

        return TodoResponse.fromEntity(todoRepository.save(todo));
    }

    public void deleteTodo(Long id) {
        if (!todoRepository.existsById(id)) {
            throw new TodoNotFoundException("Todo not found with id " + id);
        }
        todoRepository.deleteById(id);
    }
}

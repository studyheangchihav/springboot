const apiBase = '/api/todos';
const messageEl = document.getElementById('message');
const listEl = document.getElementById('todo-list');
const form = document.getElementById('todo-form');
const resetButton = document.getElementById('reset-button');
const detailModal = document.getElementById('detail-modal');
const detailId = document.getElementById('detail-id');
const detailTitle = document.getElementById('detail-title');
const detailDescription = document.getElementById('detail-description');
const detailCompleted = document.getElementById('detail-completed');
const detailCloseButton = document.getElementById('detail-close');
const detailCloseFooterButton = document.getElementById('detail-close-btn');

const todoIdInput = document.getElementById('todo-id');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const priorityInput = document.getElementById('priority');
const completedInput = document.getElementById('completed');

const editModal = document.getElementById('edit-modal');
const editForm = document.getElementById('edit-form');
const editModalTitle = document.getElementById('edit-modal-title');
const editIdInput = document.getElementById('edit-todo-id');
const editTitleInput = document.getElementById('edit-title');
const editDescriptionInput = document.getElementById('edit-description');
const editPriorityInput = document.getElementById('edit-priority');
const editCompletedInput = document.getElementById('edit-completed');
const editCancelButton = document.getElementById('edit-cancel');
const editCloseButton = document.getElementById('edit-modal-close');

async function fetchTodos() {
    const response = await fetch(apiBase);
    const data = await response.json();
    renderTodos(data);
}

function renderTodos(todos) {
    if (!todos.length) {
        listEl.innerHTML = '<p class="empty">No todos yet. Add one above.</p>';
        return;
    }

    listEl.innerHTML = todos.map(todo => `
        <div class="todo-card">
            <div class="todo-card-header">
                <h3>${escapeHtml(todo.title)}</h3>
                <div class="tag-row">
                    <span class="tag priority ${todo.priority ? todo.priority.toLowerCase() : 'low'}">${formatPriority(todo.priority)}</span>
                    <span class="status ${todo.completed ? 'done' : 'todo'}">${todo.completed ? 'Done' : 'Open'}</span>
                </div>
            </div>
            <p>${escapeHtml(todo.description || '')}</p>
            <div class="todo-actions">
                <button data-action="detail" data-id="${todo.id}">View</button>
                <button data-action="edit" data-id="${todo.id}">Edit</button>
                <button data-action="delete" data-id="${todo.id}" class="danger">Delete</button>
            </div>
        </div>
    `).join('');
}

function escapeHtml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function showMessage(text, type = 'info') {
    messageEl.textContent = text;
    messageEl.className = `message ${type}`;
    setTimeout(() => {
        messageEl.textContent = '';
        messageEl.className = 'message';
    }, 3500);
}

function openModal(modal) {
    modal.hidden = false;
    document.body.classList.add('modal-open');
}

function closeModal(modal) {
    modal.hidden = true;
    if (!document.querySelector('.modal-overlay:not([hidden])')) {
        document.body.classList.remove('modal-open');
    }
}

async function loadTodoDetail(id) {
    const response = await fetch(`${apiBase}/${id}`);
    if (!response.ok) {
        showMessage('Failed to load todo detail', 'error');
        return;
    }
    const todo = await response.json();
    detailId.textContent = todo.id;
    detailTitle.textContent = todo.title;
    detailDescription.textContent = todo.description || 'No description';
    detailCompleted.textContent = todo.completed ? 'Yes' : 'No';
    document.getElementById('detail-priority').textContent = formatPriority(todo.priority);
    openModal(detailModal);
}

async function loadTodoForEdit(id) {
    const response = await fetch(`${apiBase}/${id}`);
    if (!response.ok) {
        showMessage('Failed to load todo for edit', 'error');
        return;
    }
    const todo = await response.json();
    editIdInput.value = todo.id;
    editTitleInput.value = todo.title;
    editDescriptionInput.value = todo.description || '';
    editPriorityInput.value = todo.priority || 'LOW';
    editCompletedInput.checked = todo.completed;
    editModalTitle.textContent = 'Edit Todo';
    openModal(editModal);
}

function resetEditForm() {
    editIdInput.value = '';
    editTitleInput.value = '';
    editDescriptionInput.value = '';
    editPriorityInput.value = 'LOW';
    editCompletedInput.checked = false;
}

async function deleteTodo(id) {
    const confirmed = confirm('Delete this todo?');
    if (!confirmed) return;
    const response = await fetch(`${apiBase}/${id}`, { method: 'DELETE' });
    if (!response.ok) {
        showMessage('Failed to delete todo', 'error');
        return;
    }
    showMessage('Todo deleted', 'success');
    fetchTodos();
}

form.addEventListener('submit', async event => {
    event.preventDefault();
    const payload = {
        title: titleInput.value.trim(),
        description: descriptionInput.value.trim(),
        completed: completedInput.checked,
        priority: priorityInput.value
    };

    if (!payload.title) {
        showMessage('Title is required', 'error');
        return;
    }

    const existingId = todoIdInput.value;
    const method = existingId ? 'PUT' : 'POST';
    const url = existingId ? `${apiBase}/${existingId}` : apiBase;

    const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        showMessage('Failed to save todo', 'error');
        return;
    }

    const action = existingId ? 'updated' : 'created';
    showMessage(`Todo ${action} successfully`, 'success');
    resetForm();
    fetchTodos();
});

editForm.addEventListener('submit', async event => {
    event.preventDefault();
    const id = editIdInput.value;
    if (!id) {
        showMessage('Todo ID is missing for edit', 'error');
        return;
    }

    const payload = {
        title: editTitleInput.value.trim(),
        description: editDescriptionInput.value.trim(),
        completed: editCompletedInput.checked,
        priority: editPriorityInput.value
    };

    if (!payload.title) {
        showMessage('Title is required', 'error');
        return;
    }

    const response = await fetch(`${apiBase}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        showMessage('Failed to update todo', 'error');
        return;
    }

    showMessage('Todo updated successfully', 'success');
    closeModal(editModal);
    resetEditForm();
    fetchTodos();
});

resetButton.addEventListener('click', resetForm);
editCancelButton.addEventListener('click', () => {
    resetEditForm();
    closeModal(editModal);
});
editCloseButton.addEventListener('click', () => {
    resetEditForm();
    closeModal(editModal);
});
detailCloseButton.addEventListener('click', () => closeModal(detailModal));
detailCloseFooterButton.addEventListener('click', () => closeModal(detailModal));

detailModal.addEventListener('click', event => {
    if (event.target === detailModal) {
        closeModal(detailModal);
    }
});

editModal.addEventListener('click', event => {
    if (event.target === editModal) {
        resetEditForm();
        closeModal(editModal);
    }
});

listEl.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    const action = button.dataset.action;
    const id = button.dataset.id;
    if (!action || !id) return;

    if (action === 'detail') {
        loadTodoDetail(id);
    } else if (action === 'edit') {
        loadTodoForEdit(id);
    } else if (action === 'delete') {
        deleteTodo(id);
    }
});

function resetForm() {
    todoIdInput.value = '';
    titleInput.value = '';
    descriptionInput.value = '';
    priorityInput.value = 'LOW';
    completedInput.checked = false;
}

function formatPriority(priority) {
    if (!priority) {
        return 'Low';
    }
    return priority === 'HIGH' ? 'High' : priority === 'MEDIUM' ? 'Medium' : 'Low';
}

fetchTodos();

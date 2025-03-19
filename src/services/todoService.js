const API_URL = '/api/Todo';

export async function getTodos() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Failed to fetch todos');
  return response.json();
}

export async function getTags() {
  const response = await fetch('/api/Tag');
  if (!response.ok) throw new Error('Failed to fetch tags');
  return response.json();
}

export async function createTodo(todo) {
  const endpoint = todo.parentId 
    ? `${API_URL}/${todo.parentId}/subtasks`  // 創建子任務
    : API_URL;  // 創建主任務

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: todo.title,
      description: todo.description || '',
      isCompleted: todo.isCompleted || false,
      dueDate: todo.dueDate || new Date().toISOString(),
      priority: todo.priority || 0,
      parentId: todo.parentId || null,
      tagIds: todo.tagIds || []
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create todo: ${error}`);
  }
  return response.json();
}

export async function updateTodo(id, updates) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),    
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to update todo: ${error}`);
  }
  return response.json();
}

export async function deleteTodo(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to delete todo: ${error}`);
  }
}
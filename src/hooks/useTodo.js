// hooks/useTodo.js
import { useState, useEffect } from 'react';
import { getTodos, createTodo, updateTodo, deleteTodo } from '../services/todoService';

export function useTodo() {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTodos = async () => {
    try {
      setIsLoading(true);
      const data = await getTodos();
      setTodos(data);
    } catch (error) {
      console.error('Failed to fetch todos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async (todo) => {
    try {
      await createTodo(todo);
      // 重新獲取所有待辦事項
      await fetchTodos();
    } catch (error) {
      console.error('Failed to add todo:', error);
    }
  };

  const updateTodoItem = async (id, updates) => {
    try {
      await updateTodo(id, updates);
      // 重新獲取所有待辦事項
      await fetchTodos();
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  const removeTodo = async (id) => {
    try {
      await deleteTodo(id);
      // 重新獲取所有待辦事項
      await fetchTodos();
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  return {
    todos,
    isLoading,
    addTodo,
    updateTodoItem,
    removeTodo,
    fetchTodos  // 導出 fetchTodos 以便需要時手動重新獲取
  };
}
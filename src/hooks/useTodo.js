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
      const newTodo = await createTodo(todo);
      setTodos(prevTodos => [...prevTodos, newTodo]);
      return newTodo;
    } catch (error) {
      console.error('Failed to add todo:', error);
      throw error;
    }
  };

  const updateTodoItem = async (id, updates) => {
    try {
      const updatedTodo = await updateTodo(id, updates);
      setTodos(prevTodos => 
        prevTodos.map(todo => 
          todo.id === id ? updatedTodo : todo
        )
      );
      return updatedTodo;
    } catch (error) {
      console.error('Failed to update todo:', error);
      throw error;
    }
  };

  const removeTodo = async (id) => {
    try {
      await deleteTodo(id);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Failed to delete todo:', error);
      throw error;
    }
  };

  return {
    todos,
    isLoading,
    addTodo,
    updateTodoItem,
    removeTodo,
    fetchTodos
  };
}
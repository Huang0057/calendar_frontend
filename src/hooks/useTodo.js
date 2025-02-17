// hooks/useTodo.js
import { useState, useEffect } from 'react';
import { getTodos, createTodo, updateTodo, deleteTodo } from '../services/todoService';

export function useTodo() {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTodos = async () => {
    setIsLoading(true);
    try {
      const data = await getTodos();
      setTodos(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async (todo) => {
    const newTodo = await createTodo(todo);
    setTodos(prevTodos => [...prevTodos, newTodo]);
    return newTodo;
  };

  const updateTodoItem = async (id, updates) => {
    const updatedTodo = await updateTodo(id, updates);
    setTodos(prevTodos => 
      prevTodos.map(todo => 
        todo.id === id ? { ...todo, ...updatedTodo } : todo
      )
    );
    return updatedTodo;
  };

  const removeTodo = async (id) => {
    await deleteTodo(id);
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
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
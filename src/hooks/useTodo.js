import { useState, useEffect } from 'react';
import { getTodos, getTags, createTodo, updateTodo, deleteTodo } from '../services/todoService';

export function useTodo() {
  const [todos, setTodos] = useState([]);
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTagsLoading, setIsTagsLoading] = useState(true);

  const fetchTodos = async () => {
    setIsLoading(true);
    try {
      const data = await getTodos();
      setTodos(data);
    } catch (error) {
      console.error('Failed to fetch todos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTags = async () => {
    setIsTagsLoading(true);
    try {
      const data = await getTags();
      setTags(data);
    } catch (error) {
      console.error('Failed to fetch tags:', error);
    } finally {
      setIsTagsLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
    fetchTags();
  }, []);

  const updateTodoInState = (updatedTodo) => {
    setTodos(prevTodos => {
      return prevTodos.map(todo => {
        if (todo.id === updatedTodo.id) {
          return { ...todo, ...updatedTodo };
        }
        if (todo.subTasks?.length > 0) {
          return {
            ...todo,
            subTasks: todo.subTasks.map(subtask => 
              subtask.id === updatedTodo.id 
                ? { ...subtask, ...updatedTodo }
                : subtask
            )
          };
        }
        return todo;
      });
    });
  };

  const addTodo = async (todo) => {
    try {
      const newTodo = await createTodo(todo);
      
      if (todo.parentId) {
        setTodos(prevTodos => 
          prevTodos.map(t => {
            if (t.id === todo.parentId) {
              return {
                ...t,
                subTasks: [...(t.subTasks || []), newTodo]
              };
            }
            return t;
          })
        );
      } else {
        setTodos(prevTodos => [...prevTodos, newTodo]);
      }
      
      return newTodo;
    } catch (error) {
      console.error('Failed to add todo:', error);
      throw error;
    }
  };

  const updateTodoItem = async (id, updates) => {
    try {
      let result;
      if (updates.parentId) {
        result = await createTodo(updates);
      } else {
        result = await updateTodo(id, updates);
      }

      updateTodoInState(result);
      return result;
    } catch (error) {
      console.error('Failed to update todo:', error);
      throw error;
    }
  };

  const removeTodo = async (id) => {
    try {
      await deleteTodo(id);
      
      setTodos(prevTodos => {

        const isTopLevel = prevTodos.some(todo => todo.id === id);
        
        if (isTopLevel) {
          return prevTodos.filter(todo => todo.id !== id);
        }
        
        return prevTodos.map(todo => {
          if (todo.subTasks?.length > 0) {
            return {
              ...todo,
              subTasks: todo.subTasks.filter(subtask => subtask.id !== id)
            };
          }
          return todo;
        });
      });
    } catch (error) {
      console.error('Failed to remove todo:', error);
      throw error;
    }
  };

  return {
    todos,
    isLoading,
    tags,
    isTagsLoading,
    addTodo,
    updateTodoItem,
    removeTodo,
    fetchTodos,
    fetchTags
  };
}
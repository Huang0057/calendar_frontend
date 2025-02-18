import PropTypes from 'prop-types';
import { useTodo } from '@/hooks/useTodo';
import { TodoContext } from './todo-context-instance';

export function TodoProvider({ children }) {
  const todoUtils = useTodo();
  
  return (
    <TodoContext.Provider value={todoUtils}>
      {children}
    </TodoContext.Provider>
  );
}

TodoProvider.propTypes = {
  children: PropTypes.node.isRequired
};
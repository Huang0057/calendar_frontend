import PropTypes from 'prop-types';
import TodoItem from './TodoItem';
import { useTodo } from '../../hooks/useTodo';

function TodoList() {
  const { todos, isLoading } = useTodo();
  console.log('Current todos:', todos);
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
}

TodoList.propTypes = {
    todos: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        completed: PropTypes.bool.isRequired
      })
    )
  };

export default TodoList;
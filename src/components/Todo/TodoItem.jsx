import  { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Button, Input, Checkbox, Space } from 'antd';
import { 
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined
} from '@ant-design/icons';
import { useTodo } from '@/hooks/useTodo';

function TodoItem({ todo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const { updateTodoItem, removeTodo } = useTodo();

  const handleUpdate = () => {
    if (editedTitle.trim()) {
      updateTodoItem(todo.id, { 
        ...todo,
        title: editedTitle 
      });
      setIsEditing(false);
    }
  };

  const handleToggleComplete = async () => {
    try {
      await updateTodoItem(todo.id, {
        ...todo,
        isCompleted: !todo.isCompleted
      });
    } catch (error) {
      console.error('Failed to toggle todo:', error);
    }
  };

  if (isEditing) {
    return (
      <Card variant="outlined" className="shadow-sm">
        <Space.Compact style={{ width: '100%' }}>
          <Input
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onPressEnter={handleUpdate}
            autoFocus
          />
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={handleUpdate}
          />
          <Button
            icon={<CloseOutlined />}
            onClick={() => setIsEditing(false)}
          />
        </Space.Compact>
      </Card>
    );
  }

  return (
    <Card variant="outlined" className="shadow-sm">
      <div className="flex items-center gap-4">
        <Checkbox
          checked={todo.isCompleted}
          onChange={handleToggleComplete}
        />
        <span className={`flex-1 ${todo.isCompleted ? 'line-through text-gray-500' : ''}`}>
          {todo.title}
        </span>
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => setIsEditing(true)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => removeTodo(todo.id)}
          />
        </Space>
      </div>
    </Card>
  );
}

TodoItem.propTypes = {
  todo: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    isCompleted: PropTypes.bool.isRequired,
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string,
    completedAt: PropTypes.string,
    dueDate: PropTypes.string,
    priority: PropTypes.number,
    parentId: PropTypes.number,
    subTasks: PropTypes.array
  }).isRequired
};

export default TodoItem;
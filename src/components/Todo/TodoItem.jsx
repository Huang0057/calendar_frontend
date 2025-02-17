import { useState } from 'react';
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
  const [isUpdating, setIsUpdating] = useState(false);
  const [localChecked, setLocalChecked] = useState(todo.isCompleted);
  const { updateTodoItem, removeTodo } = useTodo();

  const handleUpdate = async () => {
    if (editedTitle.trim()) {
      try {
        await updateTodoItem(todo.id, { 
          ...todo,
          title: editedTitle 
        });
        setIsEditing(false);
      } catch (error) {
        console.error('Failed to update todo:', error);
      }
    }
  };

  const handleToggleComplete = async (e) => {
    if (isUpdating) return;
    
    try {
      setIsUpdating(true);
      const newIsCompleted = e.target.checked;
      
      // 立即更新本地狀態以獲得即時反饋
      setLocalChecked(newIsCompleted);
      
      await updateTodoItem(todo.id, {
        ...todo,
        isCompleted: newIsCompleted
      });
    } catch (error) {
      // 如果 API 調用失敗，恢復本地狀態
      setLocalChecked(!e.target.checked);
      console.error('Failed to toggle todo:', error);
    } finally {
      setIsUpdating(false);
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
          checked={localChecked}
          onChange={handleToggleComplete}
          disabled={isUpdating}
        />
        <span className={`flex-1 ${localChecked ? 'line-through text-gray-500' : ''}`}>
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
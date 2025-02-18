import { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Button, Checkbox, Tag, Collapse } from 'antd';
import { 
  EditOutlined,
  DeleteOutlined,
  CalendarOutlined,
  CheckOutlined
} from '@ant-design/icons';
import { useTodo } from '@/hooks/useTodo';
import dayjs from 'dayjs';
import EditTodoModal from './EditTodoModal';

function TodoItem({ todo }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [localChecked, setLocalChecked] = useState(todo.isCompleted);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { updateTodoItem, removeTodo } = useTodo();
  const [localTodo, setLocalTodo] = useState(todo);
 
  const priorityColors = {
    0: 'success',
    1: 'warning',
    2: 'error'
  };

  const priorityLabels = {
    0: 'Low',
    1: 'Medium',
    2: 'High'
  };

  const handleUpdate = async (updatedTodo) => {
    try {
      setLocalTodo({ ...todo, ...updatedTodo }); // 先更新本地狀態
      await updateTodoItem(todo.id, updatedTodo);
    } catch (error) {
      setLocalTodo(todo); // 如果失敗，回滾到原始狀態
      console.error('Failed to update todo:', error);
      throw error;
    }
  };

  const handleToggleComplete = async (e) => {
    if (isUpdating) return;
    
    try {
      setIsUpdating(true);      
      const newIsCompleted = e.target.checked;      
      
      setLocalChecked(newIsCompleted);
      
      const updateData = {
        ...todo,
        isCompleted: newIsCompleted,
        completedAt: newIsCompleted ? new Date().toISOString() : null
      };
      
      console.log('Update data:', updateData);
    } catch (error) {      
      setLocalChecked(!e.target.checked);
      console.error('Failed to toggle todo:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <Card 
        className="shadow-sm"
        actions={[
          <Button
            key="edit"
            type="text"
            icon={<EditOutlined />}
            onClick={() => setIsEditModalOpen(true)}
          />,
          <Button
            key="delete"
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => removeTodo(localTodo.id)}
          />
        ]}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Checkbox
              checked={localChecked}
              onChange={handleToggleComplete}
              disabled={isUpdating}
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className={`text-lg ${localChecked ? 'line-through text-gray-500' : ''}`}>
                  {localTodo.title}
                </span>
                <Tag color={priorityColors[localTodo.priority]}>
                  {priorityLabels[localTodo.priority]}
                </Tag>
              </div>
            </div>
          </div>

          {localTodo.description && (
            <p className="text-gray-600 ml-7">
              {localTodo.description}
            </p>
          )}

          <div className="flex flex-wrap gap-4 ml-7 text-sm text-gray-500">
            {localTodo.dueDate && (
              <span className="flex items-center">
                <CalendarOutlined className="mr-1" />
                Due: {dayjs(localTodo.dueDate).format('YYYY-MM-DD')}
              </span>
            )}
            {localTodo.completedAt && (
              <span className="flex items-center">
                <CheckOutlined className="mr-1" />
                Completed: {dayjs(localTodo.completedAt).format('YYYY-MM-DD')}
              </span>
            )}
          </div>

          {localTodo.subTasks?.length > 0 && (
            <Collapse 
              ghost 
              className="ml-7"
              items={[
                {
                  key: '1',
                  label: 'Subtasks',
                  children: (
                    <div className="space-y-2">
                      {localTodo.subTasks.map(subtask => (
                        <TodoItem key={subtask.id} todo={subtask} />
                      ))}
                    </div>
                  )
                }
              ]}
            />
          )}
        </div>
      </Card>

      <EditTodoModal
        todo={localTodo}
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdate}
      />
    </>
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
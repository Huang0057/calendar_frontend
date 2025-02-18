import { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Button, Checkbox, Tag, Collapse, Modal, message } from 'antd';
import { 
  EditOutlined,
  DeleteOutlined,
  CalendarOutlined,
  CheckOutlined,
  PlusOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import TodoModal from './TodoModal';
import { useTodoContext } from '@/hooks/useTodoContext';

function TodoItem({ todo }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [localChecked, setLocalChecked] = useState(todo.isCompleted);
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: null  // 'edit' or 'add-subtask'
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { updateTodoItem, removeTodo } = useTodoContext();
  const [localTodo, setLocalTodo] = useState(todo);
  const [isDeleting, setIsDeleting] = useState(false);
 
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

  const handleUpdate = async (updatedData) => {
    try {
      if (modalState.mode === 'edit') {        
        const optimisticUpdate = { ...localTodo, ...updatedData };
        setLocalTodo(optimisticUpdate);
        const result = await updateTodoItem(localTodo.id, updatedData);
        setLocalTodo(result); 
      } else {            
        const newSubtask = {
          ...updatedData,
          parentId: localTodo.id,
          isCompleted: false
        };
                
        const optimisticSubtask = {
          ...newSubtask,
          id: Date.now(), 
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        setLocalTodo(prev => ({
          ...prev,
          subTasks: [...(prev.subTasks || []), optimisticSubtask]
        }));

        try {
          await updateTodoItem(localTodo.id, newSubtask);
        } catch (error) {
          setLocalTodo(prev => ({
            ...prev,
            subTasks: prev.subTasks.filter(task => task.id !== optimisticSubtask.id)
          }));
          throw error;
        }
      }
    } catch (error) {
      console.error('Failed to update todo:', error);
      throw error;
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      
      // 先在UI中隱藏
      setLocalTodo(prev => ({ ...prev, isDeleted: true }));
      
      await removeTodo(todo.id);
      message.success('Todo deleted successfully');
    } catch (error) {
      // 發生錯誤時回溯
      setLocalTodo(prev => ({ ...prev, isDeleted: false }));
      message.error('Failed to delete todo');
      console.error('Delete failed:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const showDeleteConfirm = () => {
    setIsDeleteModalOpen(true);
  };

  const handleToggleComplete = async (e) => {
    if (isUpdating) return;
    
    const newIsCompleted = e.target.checked;
    setIsUpdating(true);
    setLocalChecked(newIsCompleted);
    
    try {
      const updateData = {
        isCompleted: newIsCompleted,
        completedAt: newIsCompleted ? new Date().toISOString() : null
      };
      
      await updateTodoItem(localTodo.id, updateData);
    } catch (error) {
      setLocalChecked(!newIsCompleted);
      console.error('Failed to toggle todo:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const openModal = (mode) => {
    setModalState({
      isOpen: true,
      mode
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      mode: null
    });
  };

  // 如果已刪除，不渲染任何內容
  if (localTodo.isDeleted) {
    return null;
  }

  return (
    <>
      <Card 
        className="shadow-sm"
        actions={[
          <Button
            key="edit"
            type="text"
            icon={<EditOutlined />}
            onClick={() => openModal('edit')}
            disabled={isDeleting}
          />,
          <Button
            key="delete"
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={showDeleteConfirm}
            loading={isDeleting}
          />
        ]}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Checkbox
              checked={localChecked}
              onChange={handleToggleComplete}
              disabled={isUpdating || isDeleting}
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

          {!localTodo.parentId && (
            <Collapse 
              ghost 
              className="ml-7"
              items={[
                {
                  key: '1',
                  label: <span className="font-bold">Subtasks</span>,
                  children: (
                    <div className="space-y-4">
                      <Button 
                        type="dashed"
                        icon={<PlusOutlined />}
                        onClick={() => openModal('add-subtask')}
                        block
                        disabled={isDeleting}
                      >
                        Add Subtask
                      </Button>
                      <div className="space-y-2">
                        {localTodo.subTasks?.map(subtask => (
                          <TodoItem key={subtask.id} todo={subtask} />
                        ))}
                      </div>
                    </div>
                  )
                }
              ]}
            />
          )}
        </div>
      </Card>

      <TodoModal
        todo={modalState.mode === 'edit' ? localTodo : null}
        parentId={modalState.mode === 'add-subtask' ? localTodo.id : undefined}
        open={modalState.isOpen}
        onCancel={closeModal}
        onSubmit={handleUpdate}
      />
      
      <Modal
        title="Delete Todo"
        open={isDeleteModalOpen}
        onOk={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText="Yes"
        cancelText="No"
        okType="danger"
        centered
      >
        <p>Are you sure you want to delete this todo?</p>
      </Modal>
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
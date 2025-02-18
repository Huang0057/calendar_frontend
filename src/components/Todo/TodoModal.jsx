import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, DatePicker, Radio, Button, Modal } from 'antd';
import dayjs from 'dayjs';

const { TextArea } = Input;

function TodoModal({ todo, parentId, open, onCancel, onSubmit }) {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = Boolean(todo);
  const modalTitle = isEditMode ? 'Edit Todo' : parentId ? 'Add Subtask' : 'Add Todo';

  const handleSubmit = async (values) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const submitData = {
        ...values,
        dueDate: values.dueDate?.toISOString(),
        priority: Number(values.priority)
      };

      if (isEditMode) {
        // 編輯模式
        await onSubmit({ ...todo, ...submitData });
      } else {
        // 新增模式
        await onSubmit({
          ...submitData,
          parentId,
          isCompleted: false
        });
      }
      
      onCancel(); 
    } catch (error) {
      console.error('Failed to submit todo:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
 
  useEffect(() => {
    if (open) {
      if (isEditMode) {
        // 編輯模式
        form.setFieldsValue({
          title: todo.title,
          description: todo.description,
          dueDate: todo.dueDate ? dayjs(todo.dueDate) : null,
          priority: todo.priority
        });
      } else {
        // 新增模式
        form.resetFields();
        form.setFieldValue('priority', 1);
      }
    }
  }, [open, todo, form, isEditMode]);

  return (
    <Modal
      title={modalTitle}
      open={open}
      onCancel={onCancel}
      footer={null}
      maskClosable={false}
    >
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
      >
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: 'Please input title!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
        >
          <TextArea rows={4} />
        </Form.Item>

        <Form.Item
          name="dueDate"
          label="Due Date"
        >
          <DatePicker className="w-full" />
        </Form.Item>

        <Form.Item
          name="priority"
          label="Priority"
          rules={[{ required: true, message: 'Please select priority!' }]}
        >
          <Radio.Group>
            <Radio.Button value={0}>Low</Radio.Button>
            <Radio.Button value={1}>Medium</Radio.Button>
            <Radio.Button value={2}>High</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item className="mb-0">
          <div className="flex justify-end gap-2">
            <Button onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button 
              type="primary" 
              htmlType="submit"
              loading={isSubmitting}
            >
              {isEditMode ? 'Save Changes' : 'Add'}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
}

TodoModal.propTypes = {
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
  }),
  parentId: PropTypes.number,
  open: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default TodoModal;
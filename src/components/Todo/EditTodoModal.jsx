import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, DatePicker, Radio, Button, Modal } from 'antd';
import dayjs from 'dayjs';

const { TextArea } = Input;

function EditTodoModal({ todo, open, onCancel, onSubmit }) {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const updatedTodo={
        ...todo,
        ...values,
        dueDate: values.dueDate?.toISOString(),
        priority: Number(values.priority)
      };
      await onSubmit(updatedTodo);
      onCancel(); // 成功後直接關閉
    } catch (error) {
      console.error('Failed to update todo:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Modal 開啟時設置表單初始值
  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        title: todo.title,
        description: todo.description,
        dueDate: todo.dueDate ? dayjs(todo.dueDate) : null,
        priority: todo.priority
      });
    }
  }, [open, todo, form]);

  return (
    <Modal
      title="Edit Todo"
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
          rules={[{ required: true, message: 'Please input todo title!' }]}
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
              Save Changes
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
}

EditTodoModal.propTypes = {
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
    }).isRequired,
    open: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
  };


export default EditTodoModal;
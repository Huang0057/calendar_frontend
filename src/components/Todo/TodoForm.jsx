import { useState } from 'react';
import { Form, Input, Button, Card, Space, Modal, DatePicker, Radio } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useTodo } from '@/hooks/useTodo';
import TextArea from 'antd/es/input/TextArea';

function TodoForm() {
  const [title, setTitle] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const { addTodo } = useTodo();

  const handleInputSubmit = () => {
    if (!title.trim()) return;
    
    // 預填標題到 Modal 表單
    form.setFieldsValue({ title });
    setIsModalOpen(true);
  };

  const handleModalSubmit = (values) => {
    addTodo({
      title: values.title,
      description: values.description,
      dueDate: values.dueDate?.toISOString(),
      priority: values.priority
    });
    
    setTitle('');
    form.resetFields();
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  return (
    <>
      <Card variant="outlined" className="shadow-sm">
        <Form>
          <Form.Item className="mb-0">
            <Space.Compact style={{ width: '100%' }}>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Add new todo..."
                allowClear
                onPressEnter={handleInputSubmit}
              />
              <Button 
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleInputSubmit}
              >
                Add
              </Button>
            </Space.Compact>
          </Form.Item>
        </Form>
      </Card>

      <Modal
        title="Add New Todo"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleModalSubmit}
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
            initialValue={1}
            rules={[{ required: true, message: 'Please select a priority level!' }]}
          >
            <Radio.Group>
              <Radio.Button value={0}>Low</Radio.Button>
              <Radio.Button value={1}>Medium</Radio.Button>
              <Radio.Button value={2}>High</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item className="mb-0">
            <div className="flex justify-end gap-2">
              <Button onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default TodoForm;
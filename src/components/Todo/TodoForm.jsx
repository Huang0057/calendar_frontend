import { useState } from 'react';
import { Form, Input, Button, Card, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import TodoModal from './TodoModal';
import { useTodoContext } from '@/hooks/useTodoContext';

function TodoForm() {
  const [title, setTitle] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const { addTodo } = useTodoContext();

  const handleInputSubmit = () => {
    if (!title.trim()) return;
    
    // 預填標題
    form.setFieldsValue({ title });
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (values) => {
    await addTodo(values);
    setTitle('');
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

      <TodoModal
        open={isModalOpen}
        onCancel={handleCancel}
        onSubmit={handleModalSubmit}
      />
    </>
  );
}

export default TodoForm;
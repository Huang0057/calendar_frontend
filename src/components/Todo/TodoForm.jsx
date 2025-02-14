import  { useState } from 'react';
import { Form, Input, Button, Card, Space  } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useTodo } from '@/hooks/useTodo';

function TodoForm() {
    const [title, setTitle] = useState('');
    const { addTodo } = useTodo();
  
    const handleSubmit = () => {
      if (!title.trim()) return;
      
      addTodo({ title });
      setTitle('');
    };
  
    return (
      <Card variant="outlined" className="shadow-sm">
        <Form onFinish={handleSubmit}>
          <Form.Item className="mb-0">
            <Space.Compact style={{ width: '100%' }}>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Add new todo..."
                allowClear
                onPressEnter={handleSubmit}
              />
              <Button 
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleSubmit}
              >
                Add
              </Button>
            </Space.Compact>
          </Form.Item>
        </Form>
      </Card>
    );
  }
  
  export default TodoForm;


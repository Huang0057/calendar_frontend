
import TodoList from './components/Todo/TodoList';
import TodoForm from './components/Todo/TodoForm';
import { Layout, Space } from 'antd';

const { Header, Content } = Layout;

function App() {
  return (
    <Layout className="min-h-screen bg-white">
      <Header 
        style={{ 
          backgroundColor: '#ffffff',
          height: '64px',
          padding: '0 24px',
          lineHeight: '16px'
        }} 
        className="flex items-center justify-center border-b"
      >
        <h1 className="text-2xl font-bold m-0" style={{ color: '#000000' }}>Todo Management</h1>
      </Header>
      <Content className="p-4">
        <div style={{ maxWidth: '380px' }} className="mx-auto">
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <TodoForm />
            <TodoList />
          </Space>
        </div>
      </Content>
    </Layout>
  );
}
export default App;
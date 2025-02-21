import TodoList from './components/Todo/TodoList';
import TodoForm from './components/Todo/TodoForm';
import TagList from './components/Tag/TagList';
import { ConfigProvider } from 'antd';
import { Layout } from 'antd';
import { TodoProvider } from './contexts/TodoContext';
import { TagProvider } from './contexts/TagContext';

const { Header, Content } = Layout;

function App() {
  return (    
    <ConfigProvider>
      <TodoProvider>
        <TagProvider>
          <Layout style={{ minHeight: '100vh' }} className="bg-gray-100">
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
              <div className="flex justify-center gap-8">
                <div style={{ width: '640px' }}>
                  <TodoForm />
                  <div className="mt-4">
                    <TodoList />
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="sticky top-4">
                    <TagList />
                  </div>
                </div>
              </div>
            </Content>
          </Layout>
        </TagProvider>      
      </TodoProvider>    
    </ConfigProvider>
  );
}

export default App;
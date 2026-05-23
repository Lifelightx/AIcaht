import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedModel, setSelectedModel] = useState('qwen2.5');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
      <Layout>
        <Sidebar 
          isDarkMode={isDarkMode} 
          toggleDarkMode={toggleDarkMode}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />
        <ChatArea 
          selectedModel={selectedModel} 
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />
      </Layout>
    </div>
  );
}

export default App;

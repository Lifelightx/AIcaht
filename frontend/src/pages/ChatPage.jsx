import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Sidebar from '../components/Sidebar';
import ChatArea from '../components/ChatArea';
import { fetchModelsApi } from '../services/api';

export default function ChatPage() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedModel, setSelectedModel] = useState('');
  const [availableModels, setAvailableModels] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const loadModels = async () => {
      try {
        const models = await fetchModelsApi();
        setAvailableModels(models);
        if (Object.keys(models).length > 0) {
          if (!selectedModel || !models[selectedModel]) {
            setSelectedModel(Object.keys(models)[0]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch models:", error);
      }
    };
    loadModels();
  }, []);

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
    <Layout>
      <Sidebar 
        isDarkMode={isDarkMode} 
        toggleDarkMode={toggleDarkMode}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        availableModels={availableModels}
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      <ChatArea 
        selectedModel={selectedModel} 
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
    </Layout>
  );
}

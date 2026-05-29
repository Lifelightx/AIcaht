import React from 'react';
import { MessageSquare, Settings, Moon, Sun, Plus, Terminal, HardDrive, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isDarkMode, toggleDarkMode, selectedModel, setSelectedModel, availableModels = {}, isOpen, toggleSidebar, chats = [], currentChatId, setCurrentChatId }) => {
  const { logout, user } = useAuth();
  
  return (
    <div className={`border-r border-app-border bg-app-bg-subtle flex flex-col h-full flex-shrink-0 transition-all duration-300 ease-in-out ${isOpen ? 'w-64 opacity-100' : 'w-0 opacity-0 overflow-hidden border-none'}`}>
      {/* Header */}
      <div className="p-4 border-b border-app-border flex items-center justify-between">
        <button 
          onClick={toggleSidebar}
          className="flex items-center gap-2 text-app-text font-semibold hover:opacity-80 transition-opacity focus:outline-none"
        >
          <Terminal className="w-6 h-6 shrink-0 text-app-accent" />
          <span className="whitespace-nowrap text-lg">Nexus AI</span>
        </button>
      </div>

      {/* New Chat Action */}
      <div className="p-4">
        <button 
          onClick={() => setCurrentChatId(null)}
          className="w-full flex items-center justify-center gap-2 bg-app-btn-primary hover:bg-app-btn-primary-hover text-white py-2 px-4 rounded-md text-sm font-medium transition-colors border border-[rgba(27,31,36,0.15)] shadow-sm"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </button>
      </div>

      {/* Model Selector */}
      <div className="px-4 py-2 border-b border-app-border">
        <label className="text-xs font-semibold text-app-text-muted uppercase tracking-wider mb-2 block">
          Model
        </label>
        <div className="relative">
          <select 
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full bg-app-bg border border-app-border text-app-text text-sm rounded-md focus:ring-2 focus:ring-app-accent focus:border-transparent block p-2.5 appearance-none shadow-sm cursor-pointer"
          >
            {Object.keys(availableModels).length > 0 ? (
              Object.entries(availableModels).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.model_name || key} 
                </option>
              ))
            ) : (
              <option value="">Loading models...</option>
            )}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-app-text-muted">
            <HardDrive className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Chat History List */}
      <div className="flex-1 overflow-y-auto p-2">
        <label className="text-xs font-semibold text-app-text-muted uppercase tracking-wider px-2 mt-4 mb-2 block">
          Recent
        </label>
        <div className="space-y-1">
          {chats.map(chat => (
            <button 
              key={chat.id}
              onClick={() => setCurrentChatId(chat.id)}
              className={`w-full flex items-center gap-2 px-2 py-2 text-sm text-left transition-colors rounded-md group ${
                currentChatId === chat.id 
                  ? 'bg-app-bg border border-app-border text-app-text shadow-sm font-medium' 
                  : 'text-app-text hover:bg-app-btn-hover border border-transparent'
              }`}
            >
              <MessageSquare className={`w-4 h-4 ${currentChatId === chat.id ? 'text-app-text-muted' : 'text-app-text-muted group-hover:text-app-text'}`} />
              <span className={`truncate ${currentChatId === chat.id ? '' : 'text-app-text-muted group-hover:text-app-text'}`}>
                {chat.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Footer Settings */}
      <div className="p-4 border-t border-app-border space-y-2">
        {user && (
          <div className="px-2 py-2 mb-2 text-xs text-app-text-muted truncate">
            Logged in as <span className="font-semibold text-app-text">{user.name || user.email}</span>
          </div>
        )}
        <button 
          onClick={toggleDarkMode}
          className="w-full flex items-center gap-2 px-2 py-2 text-sm text-app-text-muted hover:text-app-text hover:bg-app-btn-hover rounded-md transition-colors"
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        <button className="w-full flex items-center gap-2 px-2 py-2 text-sm text-app-text-muted hover:text-app-text hover:bg-app-btn-hover rounded-md transition-colors">
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </button>
        <button 
          onClick={logout}
          className="w-full flex items-center gap-2 px-2 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-app-btn-hover rounded-md transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

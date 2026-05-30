import React, { useState } from 'react';
import { MessageSquare, Settings, Moon, Sun, Plus, Terminal, HardDrive, LogOut, ChevronUp, ChevronDown, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isDarkMode, toggleDarkMode, selectedModel, setSelectedModel, availableModels = {}, isOpen, toggleSidebar, chats = [], currentChatId, setCurrentChatId }) => {
  const { logout, user } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  
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
          <button 
            onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
            className="w-full bg-app-bg border border-app-border text-app-text text-sm rounded-md focus:ring-2 focus:ring-app-accent focus:border-transparent flex items-center justify-between p-2.5 shadow-sm"
          >
            <span className="truncate pr-2">
              {Object.keys(availableModels).length > 0 
                ? (availableModels[selectedModel]?.model_name || selectedModel || 'Select model') 
                : 'Loading models...'}
            </span>
            <HardDrive className="h-4 w-4 shrink-0 text-app-text-muted" />
          </button>
          
          {isModelDropdownOpen && Object.keys(availableModels).length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-app-bg border border-app-border rounded-md shadow-lg max-h-60 overflow-y-auto">
              {Object.entries(availableModels).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedModel(key);
                    setIsModelDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-app-bg-subtle transition-colors truncate ${
                    selectedModel === key ? 'bg-app-btn-hover font-medium text-app-text' : 'text-app-text-muted'
                  }`}
                >
                  {config.model_name || key}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat History List */}
      <div className="flex-1 overflow-y-auto p-2">
        <label className="text-xs font-semibold text-app-text-muted uppercase tracking-wider px-2 mt-4 mb-2 block">
          Recent
        </label>
        <div className="space-y-0.5">
          {chats.map(chat => (
            <button 
              key={chat.id}
              onClick={() => setCurrentChatId(chat.id)}
              className={`w-full flex items-center gap-2 px-2 py-1.5 text-sm text-left transition-colors rounded-md group ${
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
      <div className="p-2 border-t border-app-border space-y-1">
        {user ? (
          <div className="relative">
            <button 
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className="w-full flex items-center justify-between px-2 py-2 text-sm text-app-text-muted hover:text-app-text hover:bg-app-btn-hover rounded-md transition-colors"
            >
              <div className="flex items-center gap-2 truncate">
                <div className="w-5 h-5 rounded-full bg-app-border-muted flex items-center justify-center shrink-0">
                  <User className="w-3 h-3 text-app-text" />
                </div>
                <span className="truncate">{user.name || user.email}</span>
              </div>
              {isSettingsOpen ? <ChevronDown className="w-4 h-4 shrink-0" /> : <ChevronUp className="w-4 h-4 shrink-0" />}
            </button>
            
            <div className={`overflow-hidden transition-all duration-200 ease-in-out ${isSettingsOpen ? 'max-h-40 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
              <div className="space-y-0.5 pl-9 pr-2 pb-1">
                <button 
                  onClick={toggleDarkMode}
                  className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-app-text-muted hover:text-app-text hover:bg-app-btn-hover rounded-md transition-colors"
                >
                  {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
                <button className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-app-text-muted hover:text-app-text hover:bg-app-btn-hover rounded-md transition-colors">
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </button>
                <button 
                  onClick={logout}
                  className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-red-400 hover:text-red-300 hover:bg-app-btn-hover rounded-md transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button 
            onClick={toggleDarkMode}
            className="w-full flex items-center gap-2 px-2 py-2 text-sm text-app-text-muted hover:text-app-text hover:bg-app-btn-hover rounded-md transition-colors"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;

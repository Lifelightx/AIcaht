import React from 'react';
import { MessageSquare, Settings, Moon, Sun, Plus, Terminal, HardDrive } from 'lucide-react';

const Sidebar = ({ isDarkMode, toggleDarkMode, selectedModel, setSelectedModel, isOpen, toggleSidebar }) => {
  return (
    <div className={`border-r border-gh-border bg-gh-bg-subtle flex flex-col h-full flex-shrink-0 transition-all duration-300 ease-in-out ${isOpen ? 'w-64 opacity-100' : 'w-0 opacity-0 overflow-hidden border-none'}`}>
      {/* Header */}
      <div className="p-4 border-b border-gh-border flex items-center justify-between">
        <button 
          onClick={toggleSidebar}
          className="flex items-center gap-2 text-gh-text font-semibold hover:opacity-80 transition-opacity focus:outline-none"
        >
          <Terminal className="w-6 h-6 shrink-0" />
          <span className="whitespace-nowrap">GH Chat</span>
        </button>
      </div>

      {/* New Chat Action */}
      <div className="p-4">
        <button className="w-full flex items-center justify-center gap-2 bg-gh-btn-primary hover:bg-gh-btn-primary-hover text-white py-2 px-4 rounded-md text-sm font-medium transition-colors border border-[rgba(27,31,36,0.15)] shadow-sm">
          <Plus className="w-4 h-4" />
          New Chat
        </button>
      </div>

      {/* Model Selector */}
      <div className="px-4 py-2 border-b border-gh-border">
        <label className="text-xs font-semibold text-gh-text-muted uppercase tracking-wider mb-2 block">
          Model
        </label>
        <div className="relative">
          <select 
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full bg-gh-bg border border-gh-border text-gh-text text-sm rounded-md focus:ring-2 focus:ring-gh-accent focus:border-transparent block p-2.5 appearance-none shadow-sm cursor-pointer"
          >
            <option value="qwen2.5">Qwen 2.5</option>
            <option value="llama3">Llama 3</option>
            <option value="mistral">Mistral</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gh-text-muted">
            <HardDrive className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Chat History List */}
      <div className="flex-1 overflow-y-auto p-2">
        <label className="text-xs font-semibold text-gh-text-muted uppercase tracking-wider px-2 mt-4 mb-2 block">
          Recent
        </label>
        <div className="space-y-1">
          <button className="w-full flex items-center gap-2 px-2 py-2 text-sm text-gh-text bg-gh-bg rounded-md border border-gh-border font-medium shadow-sm">
            <MessageSquare className="w-4 h-4 text-gh-text-muted" />
            <span className="truncate">Local AI Setup</span>
          </button>
          <button className="w-full flex items-center gap-2 px-2 py-2 text-sm text-gh-text hover:bg-gh-btn-hover rounded-md transition-colors text-left group">
            <MessageSquare className="w-4 h-4 text-gh-text-muted group-hover:text-gh-text" />
            <span className="truncate text-gh-text-muted group-hover:text-gh-text">API Implementation</span>
          </button>
          <button className="w-full flex items-center gap-2 px-2 py-2 text-sm text-gh-text hover:bg-gh-btn-hover rounded-md transition-colors text-left group">
            <MessageSquare className="w-4 h-4 text-gh-text-muted group-hover:text-gh-text" />
            <span className="truncate text-gh-text-muted group-hover:text-gh-text">Docker Debugging</span>
          </button>
        </div>
      </div>

      {/* Footer Settings */}
      <div className="p-4 border-t border-gh-border space-y-2">
        <button 
          onClick={toggleDarkMode}
          className="w-full flex items-center gap-2 px-2 py-2 text-sm text-gh-text-muted hover:text-gh-text hover:bg-gh-btn-hover rounded-md transition-colors"
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        <button className="w-full flex items-center gap-2 px-2 py-2 text-sm text-gh-text-muted hover:text-gh-text hover:bg-gh-btn-hover rounded-md transition-colors">
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

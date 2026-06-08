import React, { useState, useEffect } from 'react';
import { MessageSquare, Settings, Moon, Sun, Plus, Terminal, HardDrive, LogOut, ChevronUp, ChevronDown, User, Trash2, Pencil, MoreHorizontal } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isDarkMode, toggleDarkMode, selectedModel, setSelectedModel, availableModels = {}, isOpen, toggleSidebar, chats = [], currentChatId, setCurrentChatId, onDeleteChat, onRenameChat }) => {
  const { logout, user } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);

  const [chatToDelete, setChatToDelete] = useState(null);
  const [editingChatId, setEditingChatId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    if (openMenuId) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openMenuId]);

  return (
    <>
      <div className={`border-r border-app-border bg-app-bg-subtle flex flex-col h-full flex-shrink-0 transition-all duration-300 ease-in-out ${isOpen ? 'w-64 opacity-100' : 'w-0 opacity-0 overflow-hidden border-none'}`}>
        {/* Header */}
        <div className="p-4 border-b border-app-border flex items-center justify-between">
          <button
            onClick={toggleSidebar}
            className="flex items-center gap-2 text-app-text font-semibold hover:opacity-80 transition-opacity focus:outline-none"
          >
            <Terminal className="w-6 h-6 shrink-0 text-app-accent" />
            <span className="whitespace-nowrap text-lg">astra ai</span>
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
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-app-bg-subtle transition-colors truncate ${selectedModel === key ? 'bg-app-btn-hover font-medium text-app-text' : 'text-app-text-muted'
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
              <div key={chat.id} className="relative group w-full flex items-center">
                <button
                  onClick={() => setCurrentChatId(chat.id)}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 text-sm text-left transition-colors rounded-md ${currentChatId === chat.id
                      ? 'bg-app-bg border border-app-border text-app-text shadow-sm font-medium'
                      : 'text-app-text hover:bg-app-btn-hover border border-transparent'
                    } pr-8`}
                >
                  <MessageSquare className={`w-4 h-4 shrink-0 ${currentChatId === chat.id ? 'text-app-text-muted' : 'text-app-text-muted group-hover:text-app-text'}`} />
                  {editingChatId === chat.id ? (
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onBlur={() => {
                        if (editTitle.trim() && editTitle.trim() !== chat.title) {
                          onRenameChat(chat.id, editTitle.trim());
                        }
                        setEditingChatId(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          if (editTitle.trim() && editTitle.trim() !== chat.title) {
                            onRenameChat(chat.id, editTitle.trim());
                          }
                          setEditingChatId(null);
                        } else if (e.key === 'Escape') {
                          setEditingChatId(null);
                        }
                      }}
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 bg-transparent border-none focus:ring-0 text-app-text outline-none truncate"
                    />
                  ) : (
                    <span className={`truncate ${currentChatId === chat.id ? '' : 'text-app-text-muted group-hover:text-app-text'}`}>
                      {chat.title}
                    </span>
                  )}
                </button>
                <div className={`absolute right-1 flex items-center ${openMenuId === chat.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === chat.id ? null : chat.id);
                    }}
                    className={`p-1 transition-all rounded ${openMenuId === chat.id ? 'text-app-text bg-app-border/50' : 'text-app-text-muted hover:text-app-text hover:bg-app-border/50'}`}
                    title="More options"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>

                  {openMenuId === chat.id && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-0 top-full mt-1 w-32 bg-app-bg border border-app-border rounded-md shadow-lg py-1 z-50"
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingChatId(chat.id);
                          setEditTitle(chat.title);
                          setOpenMenuId(null);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-app-text hover:bg-app-btn-hover flex items-center gap-2"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Rename
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setChatToDelete(chat);
                          setOpenMenuId(null);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-app-btn-hover flex items-center gap-2"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
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

      {/* Delete Confirmation Modal */}
      {chatToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-app-bg border border-app-border rounded-lg shadow-xl w-full max-w-sm p-6 animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-semibold text-app-text mb-2">Delete Chat</h3>
            <p className="text-app-text-muted text-sm mb-6">
              Are you sure you want to delete <span className="font-medium text-app-text">"{chatToDelete.title}"</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setChatToDelete(null)}
                className="px-4 py-2 text-sm font-medium text-app-text hover:bg-app-bg-subtle border border-app-border rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteChat(chatToDelete.id);
                  setChatToDelete(null);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;

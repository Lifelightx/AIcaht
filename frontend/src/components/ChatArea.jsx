import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Terminal, Menu } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { fetchChatResponse } from '../services/api';

const ChatArea = ({ selectedModel, isSidebarOpen, toggleSidebar }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const shouldAutoScroll = useRef(true);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    shouldAutoScroll.current = scrollHeight - scrollTop - clientHeight < 100;
  };

  const scrollToBottom = () => {
    if (shouldAutoScroll.current && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    shouldAutoScroll.current = true;
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    setIsLoading(true);

    const botMessageId = Date.now();
    setMessages(prev => [...prev, { id: botMessageId, role: 'bot', content: '' }]);

    try {
      await fetchChatResponse(userMessage.content, selectedModel, (chunk) => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === botMessageId 
              ? { ...msg, content: msg.content + chunk }
              : msg
          )
        );
      });
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => 
        prev.map(msg => 
          msg.id === botMessageId 
            ? { ...msg, content: 'Sorry, I encountered an error. Please ensure the backend is running.' }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gh-bg">
      {/* Top Navigation */}
      <div className="h-14 border-b border-gh-border flex items-center px-6 shrink-0 bg-gh-bg">
        {!isSidebarOpen && (
          <button 
            onClick={toggleSidebar}
            className="mr-4 text-gh-text-muted hover:text-gh-text transition-colors focus:outline-none"
            aria-label="Open Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <h2 className="text-sm font-semibold text-gh-text flex items-center gap-2">
          <span>Chatting with</span>
          <span className="bg-gh-bg-subtle border border-gh-border px-2 py-0.5 rounded-full text-xs font-mono text-gh-text-muted">
            {selectedModel}
          </span>
        </h2>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 md:p-6"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gh-text-muted space-y-4">
            <div className="w-16 h-16 bg-gh-bg-subtle rounded-full flex items-center justify-center border border-gh-border shadow-sm">
              <Terminal className="w-8 h-8 text-gh-text" />
            </div>
            <p className="text-lg font-medium text-gh-text">How can I help you today?</p>
            <p className="text-sm">Ask me anything, or give me a coding task.</p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-6 pb-4">
            {messages.map((msg, index) => (
              <div 
                key={msg.id || index} 
                className={`flex gap-4 p-4 rounded-lg border shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-gh-bg border-gh-border ml-8' 
                    : 'bg-gh-bg-subtle border-gh-border mr-8'
                }`}
              >
                <div className="shrink-0 mt-1">
                  {msg.role === 'user' ? (
                    <div className="w-8 h-8 rounded-full bg-gh-border-muted flex items-center justify-center border border-gh-border">
                      <User className="w-5 h-5 text-gh-text" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gh-btn-primary flex items-center justify-center border border-gh-border shadow-sm">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 overflow-hidden">
                  <div className="font-semibold text-sm mb-1 text-gh-text flex items-center gap-2">
                    {msg.role === 'user' ? 'You' : 'Assistant'}
                  </div>
                  <div className="prose prose-sm dark:prose-invert max-w-none text-gh-text prose-pre:bg-gh-bg-subtle prose-pre:border prose-pre:border-gh-border">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                    {isLoading && msg.role === 'bot' && msg.content === '' && (
                      <div className="flex gap-1 items-center mt-2 h-4">
                        <span className="w-2 h-2 rounded-full bg-gh-text-muted animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-2 h-2 rounded-full bg-gh-text-muted animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-2 h-2 rounded-full bg-gh-text-muted animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-gh-bg border-t border-gh-border">
        <div className="max-w-3xl mx-auto relative group">
          <form onSubmit={handleSubmit} className="relative flex items-end shadow-sm">
            <textarea
              value={input}
              ref={textareaRef}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything..."
              className="w-full bg-gh-bg-subtle border border-gh-border text-gh-text rounded-lg pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-gh-accent focus:bg-gh-bg transition-colors resize-none overflow-y-auto min-h-[50px] max-h-[200px]"
              rows={1}
              style={{
                height: 'auto',
              }}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
              }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 bottom-2 p-1.5 rounded-md text-gh-text-muted hover:text-gh-text hover:bg-gh-border-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <div className="text-center mt-2">
            <p className="text-xs text-gh-text-muted">
              AI can make mistakes. Consider verifying important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;

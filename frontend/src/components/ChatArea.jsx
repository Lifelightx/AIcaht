import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Terminal, Menu, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { fetchChatResponse, fetchChatMessages } from '../services/api';

const CodeBlock = ({ node, inline, className, children, ...props }) => {
  const [isCopied, setIsCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const codeString = String(children).replace(/\n$/, '');

  const handleCopy = () => {
    navigator.clipboard.writeText(codeString);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (!inline && match) {
    return (
      <div className="rounded-md overflow-hidden border border-app-border my-4 shadow-sm text-[13px]">
        <div className="flex items-center justify-between px-4 py-2 bg-[#1e1e1e] border-b border-[#2d2d2d] text-[#858585] text-xs font-mono">
          <span>{match[1]}</span>
          <button 
            onClick={handleCopy}
            className="flex items-center gap-1.5 hover:text-[#cccccc] transition-colors focus:outline-none"
            aria-label="Copy code"
          >
            {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{isCopied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
        <SyntaxHighlighter
          {...props}
          children={codeString}
          style={vscDarkPlus}
          language={match[1]}
          PreTag="div"
          customStyle={{ margin: 0, borderRadius: 0, background: '#1e1e1e' }}
        />
      </div>
    );
  }

  return (
    <code {...props} className={`${className || ''} bg-app-bg-subtle px-1.5 py-0.5 rounded-md border border-app-border font-mono text-[13px]`}>
      {children}
    </code>
  );
};

const ChatArea = ({ selectedModel, isSidebarOpen, toggleSidebar, currentChatId, setCurrentChatId, loadChats }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const shouldAutoScroll = useRef(true);
  const newlyCreatedChatId = useRef(null);

  useEffect(() => {
    if (currentChatId) {
      if (newlyCreatedChatId.current === currentChatId) {
        newlyCreatedChatId.current = null;
        return;
      }
      const loadMessages = async () => {
        try {
          const fetchedMessages = await fetchChatMessages(currentChatId);
          setMessages(fetchedMessages);
        } catch(error) {
          console.error("Failed to fetch messages:", error);
        }
      };
      loadMessages();
    } else {
      setMessages([]);
    }
  }, [currentChatId]);

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
    setMessages(prev => [...prev, { id: botMessageId, role: 'assistant', content: '' }]);

    let initialChatId = currentChatId;

    try {
      await fetchChatResponse(
        userMessage.content, 
        selectedModel, 
        (chunk) => {
          setMessages(prev => 
            prev.map(msg => 
              msg.id === botMessageId 
                ? { ...msg, content: msg.content + chunk }
                : msg
            )
          );
        },
        (newChatId) => {
          if (!initialChatId) {
            newlyCreatedChatId.current = newChatId;
            setCurrentChatId(newChatId);
            initialChatId = newChatId;
            loadChats();
          }
        },
        initialChatId
      );
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
    <div className="flex-1 flex flex-col h-full bg-app-bg">
      {/* Top Navigation */}
      <div className="h-14 border-b border-app-border flex items-center px-6 shrink-0 bg-app-bg">
        {!isSidebarOpen && (
          <button 
            onClick={toggleSidebar}
            className="mr-4 text-app-text-muted hover:text-app-text transition-colors focus:outline-none"
            aria-label="Open Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <h2 className="text-sm font-semibold text-app-text flex items-center gap-2">
          <span>Chatting with</span>
          <span className="bg-app-bg-subtle border border-app-border px-2 py-0.5 rounded-full text-xs font-mono text-app-text-muted">
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
          <div className="h-full flex flex-col items-center justify-center text-app-text-muted space-y-4">
            <div className="w-16 h-16 bg-app-bg-subtle rounded-full flex items-center justify-center border border-app-border shadow-sm">
              <Terminal className="w-8 h-8 text-app-text" />
            </div>
            <p className="text-lg font-medium text-app-text">How can I help you today?</p>
            <p className="text-sm">Ask me anything, or give me a coding task.</p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-6 pb-4">
            {messages.map((msg, index) => (
              <div 
                key={msg.id || index} 
                className={`flex gap-4 py-4 w-full group ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="shrink-0 mt-1">
                    <div className="w-8 h-8 rounded-full bg-app-btn-primary flex items-center justify-center border border-app-border shadow-sm">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  </div>
                )}
                
                <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-[80%]`}>
                  {msg.role === 'assistant' && (
                    <div className="font-semibold text-sm mb-1 text-app-text flex items-center gap-2">
                      Nexus AI
                    </div>
                  )}
                  <div className={`prose prose-sm dark:prose-invert max-w-none text-app-text prose-pre:p-0 prose-pre:bg-transparent prose-pre:border-none ${
                    msg.role === 'user' 
                      ? 'bg-app-bg-subtle border border-app-border px-4 py-2.5 rounded-2xl shadow-sm' 
                      : ''
                  }`}>
                    <ReactMarkdown
                      components={{
                        code: CodeBlock
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                    {isLoading && msg.role === 'assistant' && msg.content === '' && (
                      <div className="flex gap-1 items-center mt-2 h-4">
                        <span className="w-2 h-2 rounded-full bg-app-text-muted animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-2 h-2 rounded-full bg-app-text-muted animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-2 h-2 rounded-full bg-app-text-muted animate-bounce" style={{ animationDelay: '300ms' }}></span>
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
      <div className="p-4 bg-gradient-to-t from-app-bg pt-8">
        <div className="max-w-3xl mx-auto relative group">
          <form onSubmit={handleSubmit} className="relative flex items-end shadow-md rounded-2xl bg-app-bg-subtle border border-app-border">
            <textarea
              value={input}
              ref={textareaRef}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message Nexus AI..."
              className="w-full bg-transparent text-app-text rounded-2xl pl-4 pr-12 py-4 focus:outline-none resize-none overflow-y-auto min-h-[56px] max-h-[200px]"
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
              className="absolute right-3 bottom-3 p-2 rounded-xl bg-app-btn-primary text-white hover:bg-app-btn-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="text-center mt-2">
            <p className="text-xs text-app-text-muted">
              AI can make mistakes. Consider verifying important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;

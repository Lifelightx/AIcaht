import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Terminal, Menu, Copy, Check, Paperclip, FileText, X, Loader2, CheckCircle2, Square } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { fetchChatResponse, fetchChatMessages, uploadDocumentApi, getChatDocumentsApi, deleteDocumentApi, getDocumentStatusApi } from '../services/api';

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
      <div className="rounded-md overflow-hidden border border-app-border my-4 shadow-sm text-sm">
        <div className="flex items-center justify-between px-4 py-2 bg-[#1e1e1e] border-b border-[#333333] text-[#cccccc] text-xs font-mono">
          <span>{match[1]}</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 hover:text-white transition-colors focus:outline-none"
            aria-label="Copy code"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{isCopied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
        <SyntaxHighlighter
          {...props}
          children={codeString}
          style={vscDarkPlus}
          language={match[1]}
          PreTag="div"
          customStyle={{ margin: 0, borderRadius: 0, background: '#1e1e1e', fontSize: '14.5px', lineHeight: '1.5' }}
        />
      </div>
    );
  }

  return (
    <code {...props} className={`${className || ''} bg-black/5 dark:bg-white/10 px-1.5 py-0.5 rounded-md font-mono text-[0.875em]`}>
      {children}
    </code>
  );
};

const preprocessLaTeX = (content) => {
  if (!content) return '';
  let processed = content;
  // Replace block math \[ ... \] with $$ ... $$
  processed = processed.replace(/\\\[([\s\S]*?)\\\]/g, '$$$$$1$$$$');
  // Replace inline math \( ... \) with $ ... $
  processed = processed.replace(/\\\(([\s\S]*?)\\\)/g, '$$$1$$');
  return processed;
};

const MessageItem = React.memo(({ msg, isLoading }) => (
  <div className={`flex gap-4 py-4 w-full group ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
    {msg.role === 'assistant' && (
      <div className="shrink-0 mt-1">
        <div className="w-8 h-8 rounded-full bg-app-btn-primary flex items-center justify-center border border-app-border shadow-sm">
          <Bot className="w-5 h-5 text-white" />
        </div>
      </div>
    )}

    <div className={`flex flex-col ${msg.role === 'user' ? 'items-end max-w-[85%]' : 'items-start flex-1 max-w-full'} min-w-0`}>
      {msg.role === 'assistant' && (
        <div className="font-semibold text-sm mb-1 text-app-text flex items-center gap-2">
          Nexus AI
        </div>
      )}
      <div className={`prose prose-sm dark:prose-invert max-w-none text-app-text prose-pre:p-0 prose-pre:bg-transparent prose-pre:border-none w-full overflow-x-auto ${msg.role === 'user'
          ? 'bg-app-bg-subtle border border-app-border px-4 py-2.5 rounded-2xl shadow-sm'
          : ''
        }`}>
        <ReactMarkdown
          remarkPlugins={[remarkMath, remarkGfm]}
          rehypePlugins={[rehypeKatex]}
          components={{
            code: CodeBlock
          }}
        >
          {preprocessLaTeX(msg.content)}
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
));

const WaveLoader = () => (
  <div className="flex items-center justify-center h-full w-full space-x-1.5 py-10">
    <div className="w-1.5 h-1.5 bg-app-text-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
    <div className="w-2.5 h-2.5 bg-app-text-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
    <div className="w-3.5 h-3.5 bg-app-text-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
    <div className="w-2.5 h-2.5 bg-app-text-muted rounded-full animate-bounce" style={{ animationDelay: '450ms' }}></div>
    <div className="w-1.5 h-1.5 bg-app-text-muted rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
  </div>
);

const ChatArea = ({ selectedModel, isSidebarOpen, toggleSidebar, currentChatId, setCurrentChatId, loadChats }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMessages, setIsFetchingMessages] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const shouldAutoScroll = useRef(true);
  const newlyCreatedChatId = useRef(null);
  const abortControllerRef = useRef(null);

  const handleStopResponse = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentChatId) {
      if (newlyCreatedChatId.current === currentChatId) {
        newlyCreatedChatId.current = null;
        return;
      }
      const loadMessages = async () => {
        setIsFetchingMessages(true);
        try {
          const fetchedMessages = await fetchChatMessages(currentChatId);
          setMessages(fetchedMessages);

          try {
            const docsRes = await getChatDocumentsApi(currentChatId);
            if (docsRes && docsRes.data) {
              setDocuments(docsRes.data);
            }
          } catch (e) {
            console.error("Failed to fetch documents", e);
          }

        } catch (error) {
          console.error("Failed to fetch messages:", error);
        } finally {
          setIsFetchingMessages(false);
        }
      };
      loadMessages();
    } else {
      setMessages([]);
      setDocuments([]);
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
  }, [messages, documents]);

  // Polling for document status
  useEffect(() => {
    const pendingDocs = documents.filter(d => d.status !== 'EMBEDDED' && d.status !== 'FAILED');
    if (pendingDocs.length === 0) return;

    const intervalId = setInterval(async () => {
      const updatedDocs = await Promise.all(
        pendingDocs.map(async (doc) => {
          try {
            const statusData = await getDocumentStatusApi(doc.id);
            return { ...doc, status: statusData.status };
          } catch (e) {
            return doc;
          }
        })
      );

      setDocuments(prevDocs =>
        prevDocs.map(doc => {
          const updatedDoc = updatedDocs.find(d => d.id === doc.id);
          return updatedDoc ? updatedDoc : doc;
        })
      );
    }, 2000); // Poll every 2 seconds

    return () => clearInterval(intervalId);
  }, [documents]);

  const isAnyDocumentProcessing = documents.some(d => d.status !== 'EMBEDDED' && d.status !== 'FAILED');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading || isAnyDocumentProcessing) return;

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
    abortControllerRef.current = new AbortController();

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
        initialChatId,
        abortControllerRef.current.signal
      );
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Response generation stopped by user');
        setMessages(prev => {
          const targetMsg = prev.find(msg => msg.id === botMessageId);
          if (targetMsg && !targetMsg.content.trim()) {
            // Remove empty message if stopped instantly
            return prev.filter(msg => msg.id !== botMessageId);
          } else if (targetMsg) {
            // Append an indicator to partial messages
            return prev.map(msg =>
              msg.id === botMessageId
                ? { ...msg, content: msg.content + '\n\n*(Stopped)*' }
                : msg
            );
          }
          return prev;
        });
      } else {
        console.error('Chat error:', error);
        setMessages(prev =>
          prev.map(msg =>
            msg.id === botMessageId
              ? { ...msg, content: 'Sorry, I encountered an error. Please ensure the backend is running.' }
              : msg
          )
        );
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !currentChatId) return;

    setIsUploading(true);
    try {
      const res = await uploadDocumentApi(currentChatId, file);
      if (res && res.data) {
        setDocuments(prev => [...prev, res.data]);
      }
    } catch (error) {
      console.error("Failed to upload document", error);
      alert("Failed to upload document. Please try again.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveDocument = async (documentId) => {
    try {
      await deleteDocumentApi(documentId);
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
    } catch (error) {
      console.error("Failed to remove document", error);
    }
  };

  const DocumentItem = ({ doc }) => (
    <div className="bg-app-bg-subtle border border-app-border px-3 py-2 rounded-xl shadow-sm flex items-center gap-3 w-fit max-w-[280px]">
      <div className="p-1.5 bg-app-bg rounded-lg shrink-0 shadow-sm border border-app-border/50">
        <FileText className="w-4 h-4 text-app-btn-primary" />
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <span className="text-sm font-semibold text-app-text truncate leading-tight">{doc.filename}</span>
        <span className="text-[10px] text-app-text-muted mt-0.5 flex items-center gap-1 font-medium">
          {doc.status === 'EMBEDDED' ? (
            <><CheckCircle2 className="w-3 h-3 text-green-500" /> Ready for questions</>
          ) : doc.status === 'FAILED' ? (
            <><X className="w-3 h-3 text-red-500" /> Processing failed</>
          ) : (
            <><Loader2 className="w-3 h-3 animate-spin text-app-btn-primary" /> Processing...</>
          )}
        </span>
      </div>
      <button
        onClick={() => handleRemoveDocument(doc.id)}
        className="shrink-0 p-1 hover:bg-app-bg rounded-md text-app-text-muted hover:text-red-400 transition-colors border border-transparent hover:border-red-400/20"
        title="Remove document"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );

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
        {isFetchingMessages ? (
          <WaveLoader />
        ) : messages.length === 0 ? (
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
              <MessageItem key={msg.id || index} msg={msg} isLoading={isLoading} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-gradient-to-t from-app-bg pt-8">
        <div className="max-w-4xl mx-auto relative group flex flex-col gap-2">
          {documents.length > 0 && (
            <div className="flex flex-wrap gap-2 px-2 pb-1">
              {documents.map(doc => (
                <DocumentItem key={`doc-${doc.id}`} doc={doc} />
              ))}
            </div>
          )}
          <form onSubmit={handleSubmit} className="relative flex items-end shadow-md rounded-2xl bg-app-bg-subtle border border-app-border">
            {currentChatId && (
              <div className="absolute left-3 bottom-3 flex items-center justify-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileUpload}
                  accept=".txt,.md,.pdf,.csv,.doc,.docx"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading || !currentChatId}
                  className="p-2 rounded-xl text-app-text-muted hover:text-app-text hover:bg-app-bg transition-colors disabled:opacity-50"
                  title="Upload Document"
                >
                  {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Paperclip className="w-5 h-5" />}
                </button>
              </div>
            )}
            <textarea
              value={input}
              ref={textareaRef}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message Nexus AI..."
              className={`w-full bg-transparent text-app-text rounded-2xl ${currentChatId ? 'pl-14' : 'pl-4'} pr-12 py-4 focus:outline-none resize-none overflow-y-auto min-h-[56px] max-h-[200px]`}
              rows={1}
              style={{
                height: 'auto',
              }}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
              }}
            />
            {isLoading ? (
              <button
                type="button"
                onClick={handleStopResponse}
                className="absolute right-3 bottom-3 p-2 rounded-xl bg-app-bg border border-app-border text-app-text hover:text-red-400 hover:border-red-400/30 transition-all shadow-sm"
                title="Stop generating"
              >
                <Square className="w-4 h-4 fill-currentColor" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim() || isAnyDocumentProcessing}
                className="absolute right-3 bottom-3 p-2 rounded-xl bg-app-btn-primary text-white hover:bg-app-btn-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                title={isAnyDocumentProcessing ? "Waiting for document to finish processing" : "Send message"}
              >
                <Send className="w-4 h-4" />
              </button>
            )}
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

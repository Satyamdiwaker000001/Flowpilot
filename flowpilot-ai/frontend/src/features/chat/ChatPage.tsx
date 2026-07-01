import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Paperclip, Send, Bot, User, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { chatService, type ChatMessage } from '../../services/chatService';

const ChatPage = () => {
  const { conversationId: urlConversationId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: -1, role: 'assistant', content: 'Hello! I am FlowPilot AI. I can answer questions about the documents you uploaded to the Knowledge Base. How can I help you today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(urlConversationId ? parseInt(urlConversationId) : null);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  // Load messages if URL param changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (urlConversationId) {
        const id = parseInt(urlConversationId);
        setConversationId(id);
        try {
          const fetchedMessages = await chatService.getMessages(id);
          if (fetchedMessages && fetchedMessages.length > 0) {
             setMessages(fetchedMessages);
          }
        } catch (err) {
          console.error("Failed to load messages", err);
        }
      } else {
        setConversationId(null);
        setMessages([
          { id: -1, role: 'assistant', content: 'Hello! I am FlowPilot AI. I can answer questions about the documents you uploaded to the Knowledge Base. How can I help you today?' }
        ]);
      }
    };
    fetchMessages();
  }, [urlConversationId]);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    
    const userMsgContent = inputValue.trim();
    setInputValue('');
    
    // Optimistic update
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', content: userMsgContent }]);
    setIsTyping(true);
    
    try {
      let currentConvId = conversationId;
      if (!currentConvId) {
        // Create conversation first if not exists
        const conv = await chatService.createConversation('Document Chat');
        currentConvId = conv.id;
        setConversationId(currentConvId);
        // Navigate to the new URL without refreshing
        navigate(`/app/chat/${currentConvId}`, { replace: true });
        // Notify Sidebar to refresh the recent conversations list
        window.dispatchEvent(new Event('conversation-created'));
      }

      // Send message to backend
      const responseMsg = await chatService.sendMessage(currentConvId as number, userMsgContent);
      
      // Update with assistant's response
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: responseMsg.id || Date.now() + 1,
        role: 'assistant',
        content: responseMsg.content
      }]);

    } catch (error) {
      console.error('Failed to send message:', error);
      setIsTyping(false);
      setMessages(prev => [...prev, { 
        id: Date.now() + 2, 
        role: 'assistant', 
        content: 'Sorry, I encountered an error while processing your request.' 
      }]);
    }
  };

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto w-full relative">
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-border/40 backdrop-blur-md sticky top-0 z-20">
        <div>
          <h2 className="font-medium text-foreground tracking-tight">New Conversation</h2>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            Agent is ready
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar scroll-smooth">
        <AnimatePresence initial={false}>
          {messages.map(msg => (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card border border-border/50 text-primary'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              
              {/* Bubble */}
              <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-primary text-primary-foreground rounded-tr-sm shadow-md' 
                  : 'bg-card border border-border/50 text-foreground rounded-tl-sm shadow-sm backdrop-blur-md whitespace-pre-wrap'
              }`}>
                {msg.content}
              </div>
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex gap-4 max-w-[85%]"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm bg-card border border-border/50 text-primary">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl text-sm bg-card border border-border/50 text-muted-foreground rounded-tl-sm shadow-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Thinking...
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={endOfMessagesRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-background/50 backdrop-blur-xl border-t border-border/40 pb-6 relative z-10">
        <div className="relative flex items-end bg-card border border-border rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all p-1">
          <button className="p-3 text-muted-foreground hover:text-primary transition-colors mb-0.5">
            <Paperclip className="w-5 h-5" />
          </button>
          
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Message FlowPilot AI..."
            className="flex-1 bg-transparent border-none py-3 px-2 outline-none text-sm placeholder:text-muted-foreground resize-none max-h-32 min-h-[44px]"
            rows={1}
          />
          
          <button 
            onClick={handleSend}
            disabled={!inputValue.trim() || isTyping}
            className="p-2 mr-2 mb-1 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.95]"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="text-center mt-3 text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
          AI can make mistakes. Verify critical actions before deploying.
        </div>
      </div>
    </div>
  );
};

export default ChatPage;

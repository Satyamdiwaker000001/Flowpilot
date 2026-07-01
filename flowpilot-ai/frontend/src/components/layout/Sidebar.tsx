import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { MessageSquare, Files, Settings, LogOut, Search, PlusCircle } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { chatService } from '../../services/chatService';

const Sidebar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [conversations, setConversations] = useState<any[]>([]);

  useEffect(() => {
    const loadConversations = () => {
      chatService.getConversations().then(setConversations).catch(console.error);
    };
    
    loadConversations();
    
    // Listen for new conversations being created so we can refresh the list
    window.addEventListener('conversation-created', loadConversations);
    return () => window.removeEventListener('conversation-created', loadConversations);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNewChat = () => {
    navigate('/app/chat');
    // We can also trigger a re-render or state reset here if needed.
  };
  return (
    <aside className="w-[280px] h-full bg-sidebar/80 backdrop-blur-xl border-r border-border/50 flex flex-col text-sidebar-foreground transition-all duration-300">
      {/* Header / Brand */}
      <div className="h-16 px-6 flex items-center gap-3 border-b border-border/50">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20">
          <span className="text-primary-foreground font-bold text-lg">F</span>
        </div>
        <h1 className="font-semibold text-lg tracking-tight">FlowPilot AI</h1>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <button 
          onClick={handleNewChat}
          className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 px-4 rounded-xl font-medium transition-all shadow-md hover:shadow-lg active:scale-[0.98]">
          <PlusCircle className="w-4 h-4" />
          New Chat
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="px-3 flex-1 overflow-y-auto space-y-1 custom-scrollbar">
        <div className="mb-4">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2 mt-4">Menu</div>
          <NavLink
            to="/app/chat"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                isActive
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
              }`
            }
          >
            <MessageSquare className="w-4 h-4" />
            Chats
          </NavLink>
          <NavLink
            to="/app/files"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                isActive
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
              }`
            }
          >
            <Files className="w-4 h-4" />
            Knowledge Base
          </NavLink>
        </div>
        
        {/* Recent History */}
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2 mt-6">Recent</div>
        <div className="space-y-0.5">
          {conversations.length === 0 ? (
            <div className="px-3 py-2 text-sm text-sidebar-foreground/50">No recent chats</div>
          ) : (
            conversations.map((conv) => (
              <button 
                key={conv.id}
                onClick={() => navigate(`/app/chat/${conv.id}`)}
                className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors group">
                <Search className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity shrink-0" />
                <span className="truncate">{conv.title}</span>
              </button>
            ))
          )}
        </div>
      </nav>

      {/* Footer Profile & Settings */}
      <div className="p-4 border-t border-border/50 bg-sidebar/50">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-sidebar-accent transition-colors cursor-pointer mb-2 group">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium group-hover:scale-105 transition-transform">
            {user?.full_name?.substring(0, 2)?.toUpperCase() || 'US'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.full_name || 'User'}</p>
            <p className="text-xs text-muted-foreground truncate">Enterprise Plan</p>
          </div>
          <Settings className="w-4 h-4 text-muted-foreground group-hover:text-sidebar-foreground transition-colors" />
        </div>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-destructive/80 hover:bg-destructive/10 hover:text-destructive transition-colors text-sm font-medium">
          <LogOut className="w-4 h-4" />
          Log out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

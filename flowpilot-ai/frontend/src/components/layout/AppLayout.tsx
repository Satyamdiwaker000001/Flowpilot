import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

const AppLayout = () => {
  const location = useLocation();
  
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden selection:bg-primary/30">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-background/50 relative backdrop-blur-3xl shadow-[-10px_0_30px_rgba(0,0,0,0.05)] border-l border-border/40 z-10">
        {/* Glow effect */}
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none opacity-50 z-0"></div>
        
        <div className="flex-1 overflow-y-auto relative z-10 custom-scrollbar">
          <Outlet key={location.pathname} />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;

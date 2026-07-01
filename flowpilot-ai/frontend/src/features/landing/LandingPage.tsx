import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Bot, FileText, Zap, ChevronRight } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col overflow-x-hidden selection:bg-primary/30">
      
      {/* Navbar */}
      <nav className="w-full h-20 px-6 lg:px-12 flex items-center justify-between border-b border-border/40 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-primary-foreground font-bold text-xl">F</span>
          </div>
          <span className="font-semibold text-xl tracking-tight">FlowPilot AI</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/login')}
            className="text-sm font-medium hover:text-primary transition-colors px-4 py-2"
          >
            Sign In
          </button>
          <button 
            onClick={() => navigate('/login')}
            className="text-sm font-medium bg-primary text-primary-foreground px-5 py-2.5 rounded-full hover:bg-primary/90 shadow-md transition-all active:scale-95"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center pt-24 pb-32 px-6 relative">
        
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/20 rounded-full blur-[120px] pointer-events-none -z-10" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-4xl mx-auto text-center space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20 mb-4">
            <Zap className="w-4 h-4" />
            <span>V1 is now live</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-balance leading-tight">
            Automate your enterprise with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">AI Intelligence</span>
          </h1>
          
          <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed">
            FlowPilot AI isn't just a chatbot. It's a modular automation platform that understands your documents, learns from context, and executes workflows.
          </p>
          
          <div className="flex items-center justify-center gap-4 pt-8">
            <button 
              onClick={() => navigate('/login')}
              className="group flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-medium text-lg hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-95"
            >
              Start Automating
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>

        {/* Feature Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-32"
        >
          {/* Card 1 */}
          <div className="bg-card/50 backdrop-blur-xl border border-border/50 p-8 rounded-3xl hover:border-primary/50 transition-colors shadow-lg shadow-black/5 group">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Bot className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Contextual Chat</h3>
            <p className="text-muted-foreground leading-relaxed">
              Interact with a highly intelligent agent that remembers past interactions using PostgreSQL memory stores.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-card/50 backdrop-blur-xl border border-border/50 p-8 rounded-3xl hover:border-primary/50 transition-colors shadow-lg shadow-black/5 group">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <FileText className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Document Intelligence</h3>
            <p className="text-muted-foreground leading-relaxed">
              Upload PDFs and DOCX files. FlowPilot instantly chunks, embeds, and retrieves answers using Qdrant vector DB.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-card/50 backdrop-blur-xl border border-border/50 p-8 rounded-3xl hover:border-primary/50 transition-colors shadow-lg shadow-black/5 group">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Zap className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Agentic Workflows</h3>
            <p className="text-muted-foreground leading-relaxed">
              Powered by LangGraph, the agent dynamically routes queries to the most optimal processing node.
            </p>
          </div>
        </motion.div>
      </main>

    </div>
  );
};

export default LandingPage;

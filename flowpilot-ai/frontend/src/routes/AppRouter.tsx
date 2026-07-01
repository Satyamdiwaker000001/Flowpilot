import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import ChatPage from '../features/chat/ChatPage';
import FilesPage from '../features/files/FilesPage';
import AuthPage from '../features/auth/AuthPage';
import LandingPage from '../features/landing/LandingPage';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPage />} />
        
        {/* Main App Routes */}
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Navigate to="/app/chat" replace />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="chat/:conversationId" element={<ChatPage />} />
          <Route path="files" element={<FilesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;

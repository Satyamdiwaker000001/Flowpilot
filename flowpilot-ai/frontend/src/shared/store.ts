import { create } from 'zustand';

interface User {
  id: number;
  full_name: string;
  email: string;
}

interface AppState {
  user: User | null;
  activeConversationId: number | null;
  setUser: (user: User | null) => void;
  setActiveConversationId: (id: number | null) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  activeConversationId: null,
  
  setUser: (user) => set({ user }),
  setActiveConversationId: (id) => set({ activeConversationId: id }),
  
  logout: () => {
    localStorage.removeItem('flowpilot_token');
    set({ user: null, activeConversationId: null });
  },
}));

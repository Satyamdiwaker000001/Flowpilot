import { api } from '../lib/api';

export interface ChatMessage {
  id?: number;
  role: 'user' | 'assistant';
  content: string;
  created_at?: string;
}

export const chatService = {
  createConversation: async (title: string = 'New Conversation') => {
    const res = await api.post('/conversations/', { title });
    return res.data;
  },

  getConversations: async () => {
    const res = await api.get('/conversations/');
    return res.data;
  },

  getMessages: async (conversationId: number) => {
    // The backend returns the full conversation object at this endpoint
    const res = await api.get(`/conversations/${conversationId}`);
    const messages = res.data.messages || [];
    // Map backend schema (sender_type) to frontend schema (role)
    return messages.map((msg: any) => ({
      id: msg.id,
      role: msg.sender_type === 'user' ? 'user' : 'assistant',
      content: msg.content,
      created_at: msg.created_at
    }));
  },

  sendMessage: async (conversationId: number, content: string) => {
    const res = await api.post(`/conversations/${conversationId}/messages`, { 
      content,
      sender_type: 'user',
      message_type: 'text'
    });
    return res.data;
  }
};

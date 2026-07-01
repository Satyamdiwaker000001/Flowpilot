import { api } from '../lib/api';

export interface Message {
  id: number;
  conversation_id: number;
  sender_type: string;
  message_type: string;
  content: string;
  created_at: string;
}

export interface Conversation {
  id: number;
  title: string;
  status: string;
  created_at: string;
  messages: Message[];
}

export const conversationService = {
  getConversations: async () => {
    const res = await api.get<Conversation[]>('/conversations');
    return res.data;
  },
  
  getConversation: async (id: number) => {
    const res = await api.get<Conversation>(`/conversations/${id}`);
    return res.data;
  },

  createConversation: async (title: string) => {
    const res = await api.post<Conversation>('/conversations', { title });
    return res.data;
  },

  sendMessage: async (conversationId: number, content: string) => {
    const res = await api.post<Message>(`/conversations/${conversationId}/messages`, {
      sender_type: 'user',
      message_type: 'text',
      content
    });
    return res.data;
  }
};

import { api } from '../lib/api';

export interface UploadedFile {
  id: number;
  filename: string;
  file_url: string;
  file_type: string;
  file_size: number;
  created_at: string;
}

export const fileService = {
  getFiles: async () => {
    const res = await api.get<UploadedFile[]>('/files');
    return res.data;
  },

  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    // Send as multipart/form-data
    const res = await api.post<UploadedFile>('/files/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return res.data;
  }
};

import { useState, useEffect, useRef } from 'react';
import { UploadCloud, FileText, Trash2, Search, FileUp, MoreVertical, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { fileService, type UploadedFile } from '../../services/fileService';

const FilesPage = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const data = await fileService.getFiles();
      setFiles(data);
    } catch (error) {
      console.error('Failed to fetch files:', error);
    }
  };

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    try {
      await fileService.uploadFile(file);
      await fetchFiles(); // Refresh list after upload
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload file.');
    } finally {
      setIsUploading(false);
    }
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleUpload(e.target.files[0]);
      e.target.value = ''; // Reset input
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="h-full flex flex-col p-6 lg:p-10 max-w-7xl mx-auto w-full relative">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground mb-1">Knowledge Base</h1>
          <p className="text-muted-foreground text-sm">Upload documents for FlowPilot AI to process, analyze, and remember.</p>
        </div>
        <button 
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl font-medium shadow-md hover:shadow-lg hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileUp className="w-4 h-4" />}
          Quick Upload
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 flex-1 min-h-0">
        
        {/* Upload Zone */}
        <div className="xl:col-span-1 flex flex-col">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={onFileSelect} 
            className="hidden" 
            accept=".pdf,.docx,.txt,.csv"
          />
          <div 
            className={`flex-1 bg-card border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer shadow-sm relative overflow-hidden group ${
              isDragging ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-border hover:border-primary/50 hover:bg-accent/50'
            }`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            
            <motion.div 
              animate={{ y: isDragging ? -10 : 0 }}
              className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary shadow-inner"
            >
              {isUploading ? <Loader2 className="w-8 h-8 animate-spin" /> : <UploadCloud className="w-8 h-8" />}
            </motion.div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {isUploading ? 'Uploading...' : (isDragging ? 'Drop files here' : 'Drag & drop files')}
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-[200px] text-balance">
              Support for PDF, DOCX, CSV or TXT. Maximum file size is 50MB.
            </p>
            <button disabled={isUploading} className="px-6 py-2 rounded-full bg-background border border-border text-sm font-medium hover:border-primary/50 transition-colors shadow-sm disabled:opacity-50">
              Browse Files
            </button>
          </div>
        </div>

        {/* Files List */}
        <div className="xl:col-span-2 flex flex-col bg-card border border-border/50 rounded-3xl shadow-lg shadow-black/5 overflow-hidden">
          
          {/* Toolbar */}
          <div className="p-5 border-b border-border/40 flex items-center justify-between bg-card/50 backdrop-blur-md z-10">
            <div className="relative group">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Search knowledge base..." 
                className="pl-9 pr-4 py-2 bg-background border border-border rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 w-72 transition-all shadow-sm"
              />
            </div>
            <div className="text-sm font-medium text-muted-foreground bg-accent px-3 py-1 rounded-full border border-border/50">
              {files.length} files total
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-2 custom-scrollbar relative">
            <table className="w-full text-left text-sm border-separate border-spacing-y-1">
              <thead className="text-xs text-muted-foreground uppercase bg-background/50 sticky top-0 z-10 backdrop-blur-md">
                <tr>
                  <th className="px-4 py-3 font-semibold rounded-l-xl">File Name</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Size</th>
                  <th className="px-4 py-3 font-semibold">Date Uploaded</th>
                  <th className="px-4 py-3 font-semibold text-right rounded-r-xl"></th>
                </tr>
              </thead>
              <tbody className="">
                {files.map((f, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={f.id} 
                    className="hover:bg-accent/50 transition-colors group rounded-xl"
                  >
                    <td className="px-4 py-3 flex items-center gap-3 rounded-l-xl">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/10 flex items-center justify-center text-primary shadow-sm group-hover:scale-105 transition-transform">
                        <FileText className="w-5 h-5" />
                      </div>
                      <span className="font-medium text-foreground truncate max-w-[200px]" title={f.filename}>{f.filename}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-green-500/10 text-green-600">
                        Ready
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{(f.file_size / 1024 / 1024).toFixed(2)} MB</td>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(f.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right rounded-r-xl">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-background rounded-lg transition-colors border border-transparent hover:border-border shadow-sm">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors border border-transparent hover:border-destructive/20 shadow-sm">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
                {files.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-muted-foreground">
                      No files uploaded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FilesPage;

import React, { useState, useEffect } from 'react';
import { FileUp, Loader2 } from 'lucide-react';
import { getFiles } from '../lib/supabase';

interface FileSelectorProps {
  onFileSelect: (fileId: string) => void;
  selectedFileId?: string;
}

const FileSelector: React.FC<FileSelectorProps> = ({ onFileSelect, selectedFileId }) => {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const filesData = await getFiles();
      setFiles(filesData);
    } catch (err) {
      setError('Failed to load files');
      console.error('Error loading files:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 size={24} className="animate-spin text-slate-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-sm p-4 text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {files.length === 0 ? (
        <div className="text-center text-slate-500 dark:text-slate-400 p-4">
          <FileUp size={24} className="mx-auto mb-2" />
          <p>No files uploaded yet</p>
        </div>
      ) : (
        files.map((file) => (
          <button
            key={file.id}
            onClick={() => onFileSelect(file.id)}
            className={`w-full text-left p-3 rounded-md transition-colors ${
              selectedFileId === file.id
                ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800'
                : 'hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            <div className="flex items-center">
              <FileUp size={16} className="mr-2 text-slate-400" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {new Date(file.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </button>
        ))
      )}
    </div>
  );
};

export default FileSelector;
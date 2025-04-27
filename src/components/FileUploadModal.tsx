import React, { useState } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import { uploadFile } from '../lib/supabase';

interface FileUploadModalProps {
  onClose: () => void;
  onUploadComplete: (fileId: string) => void;
}

const FileUploadModal: React.FC<FileUploadModalProps> = ({ onClose, onUploadComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const uploadedFile = await uploadFile(file);
      onUploadComplete(uploadedFile.id);
      onClose();
    } catch (err) {
      setError('Failed to upload file. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold">Upload File</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center">
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
              accept=".csv,.xlsx,.xls,.json"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <Upload size={40} className="text-slate-400 mb-4" />
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {file ? file.name : 'Click to select or drag and drop a file'}
              </span>
              <span className="text-xs text-slate-500 mt-2">
                Supported formats: CSV, Excel, JSON
              </span>
            </label>
          </div>

          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}

          <div className="mt-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md mr-2"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {uploading ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" />
                  Uploading...
                </>
              ) : (
                'Upload'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUploadModal;
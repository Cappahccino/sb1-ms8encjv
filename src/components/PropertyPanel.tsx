import React, { useState } from 'react';
import { X, ChevronRight, ChevronDown, Upload } from 'lucide-react';
import { useWorkflow } from '../contexts/WorkflowContext';
import { BlockType } from '../types/workflow';
import FileUploadModal from './FileUploadModal';
import FileSelector from './FileSelector';

interface PropertyPanelProps {
  blockId: string;
}

const PropertyPanel: React.FC<PropertyPanelProps> = ({ blockId }) => {
  const { blocks, updateBlockConfig } = useWorkflow();
  const block = blocks.find(b => b.id === blockId);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('general');
  
  if (!block) return null;

  const handleFileSelect = (fileId: string) => {
    updateBlockConfig(blockId, { 
      ...block.config,
      fileId 
    });
  };
  
  const handleUploadComplete = (fileId: string) => {
    updateBlockConfig(blockId, { 
      ...block.config,
      fileId 
    });
  };
  
  return (
    <div className="w-80 border-l border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-auto">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <h2 className="font-medium">{block.label} Properties</h2>
        <button className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700">
          <X size={18} />
        </button>
      </div>
      
      <div className="p-4">
        <PropertySection 
          title="General" 
          isActive={activeSection === 'general'}
          onToggle={() => setActiveSection(activeSection === 'general' ? '' : 'general')}
        >
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Block Name
              </label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700"
                value={block.label}
                onChange={(e) => {
                  updateBlockConfig(blockId, { 
                    ...block.config,
                    label: e.target.value 
                  });
                }}
              />
            </div>
          </div>
        </PropertySection>

        {block.type === 'file' && (
          <PropertySection
            title="File Settings"
            isActive={activeSection === 'file'}
            onToggle={() => setActiveSection(activeSection === 'file' ? '' : 'file')}
          >
            <div className="space-y-4">
              <button
                onClick={() => setShowUploadModal(true)}
                className="w-full px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center justify-center"
              >
                <Upload size={16} className="mr-2" />
                Upload New File
              </button>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Select File
                </label>
                <FileSelector
                  onFileSelect={handleFileSelect}
                  selectedFileId={block.config.fileId}
                />
              </div>
            </div>
          </PropertySection>
        )}
      </div>

      {showUploadModal && (
        <FileUploadModal
          onClose={() => setShowUploadModal(false)}
          onUploadComplete={handleUploadComplete}
        />
      )}
    </div>
  );
};

interface PropertySectionProps {
  title: string;
  isActive: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const PropertySection: React.FC<PropertySectionProps> = ({ 
  title, 
  isActive, 
  onToggle,
  children 
}) => {
  return (
    <div className="mb-4">
      <button 
        className="w-full flex items-center justify-between p-2 text-left font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-md"
        onClick={onToggle}
      >
        <span>{title}</span>
        {isActive ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>
      
      {isActive && (
        <div className="mt-2 pl-2">
          {children}
        </div>
      )}
    </div>
  );
};

export default PropertyPanel;
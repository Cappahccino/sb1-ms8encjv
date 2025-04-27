import React, { useRef } from 'react';
import { 
  Database, 
  FileSpreadsheet, 
  FileUp, 
  Layers, 
  Table,
  GripHorizontal,
  ChevronDown,
  ChevronUp,
  X,
  Link as LinkIcon
} from 'lucide-react';
import { WorkflowBlock as WorkflowBlockType } from '../types/workflow';
import { useWorkflow } from '../contexts/WorkflowContext';

interface WorkflowBlockProps {
  block: WorkflowBlockType;
  isSelected: boolean;
  isConnecting: boolean;
  onSelect: () => void;
  onStartConnection: (blockId: string) => void;
  onEndConnection: (blockId: string) => void;
}

const WorkflowBlock: React.FC<WorkflowBlockProps> = ({ 
  block, 
  isSelected,
  isConnecting,
  onSelect,
  onStartConnection,
  onEndConnection
}) => {
  const blockRef = useRef<HTMLDivElement>(null);
  const { removeBlock } = useWorkflow();
  
  // Get the icon based on block type
  const getBlockIcon = () => {
    switch (block.type) {
      case 'api':
        return <Database size={20} />;
      case 'file':
        return <FileUp size={20} />;
      case 'database':
        return <Database size={20} />;
      case 'sheets':
        return <FileSpreadsheet size={20} />;
      case 'clean':
        return <Table size={20} />;
      case 'transform':
      case 'merge':
        return <Layers size={20} />;
      default:
        return null;
    }
  };
  
  // Get the color based on block type
  const getBlockColor = () => {
    switch (block.type) {
      case 'api':
      case 'file':
      case 'database':
      case 'sheets':
        return 'bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800';
      case 'clean':
        return 'bg-green-50 border-green-200 dark:bg-green-900/30 dark:border-green-800';
      case 'transform':
        return 'bg-purple-50 border-purple-200 dark:bg-purple-900/30 dark:border-purple-800';
      case 'merge':
        return 'bg-amber-50 border-amber-200 dark:bg-amber-900/30 dark:border-amber-800';
      default:
        return 'bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700';
    }
  };
  
  // Handle drag start
  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation();
    
    if (blockRef.current) {
      const rect = blockRef.current.getBoundingClientRect();
      e.dataTransfer.setData('blockId', block.id);
      e.dataTransfer.setData('offsetX', (e.clientX - rect.left).toString());
      e.dataTransfer.setData('offsetY', (e.clientY - rect.top).toString());
      e.dataTransfer.effectAllowed = 'move';
    }
  };
  
  // Handle block removal
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeBlock(block.id);
  };
  
  // Handle connection points
  const handleConnectorMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onStartConnection(block.id);
  };
  
  const handleConnectorMouseUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEndConnection(block.id);
  };
  
  return (
    <div
      ref={blockRef}
      className={`absolute workflow-block ${
        isSelected ? 'selected' : ''
      } block-shadow transition-transform`}
      style={{
        left: `${block.position.x}px`,
        top: `${block.position.y}px`,
        width: '300px',
      }}
      draggable
      onDragStart={handleDragStart}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      <div className={`border rounded-lg overflow-hidden ${getBlockColor()}`}>
        {/* Block header */}
        <div className="bg-white dark:bg-slate-800 p-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between cursor-grab">
          <div className="flex items-center space-x-2">
            <GripHorizontal size={16} className="text-slate-400" />
            <div className="flex items-center space-x-2">
              <span className="text-slate-700 dark:text-slate-300">{getBlockIcon()}</span>
              <span className="font-medium">{block.label}</span>
            </div>
          </div>
          <button
            className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500"
            onClick={handleRemove}
          >
            <X size={16} />
          </button>
        </div>
        
        {/* Block content */}
        <div className="p-3">
          {/* Block type specific content */}
          <div className="space-y-2">
            {/* Add your block-specific content here */}
          </div>
          
          {/* Connection points */}
          <div className="mt-4 flex justify-center">
            <button
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                isConnecting 
                  ? 'bg-indigo-500 text-white' 
                  : 'bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-500'
              }`}
              onMouseDown={handleConnectorMouseDown}
              onMouseUp={handleConnectorMouseUp}
            >
              <LinkIcon size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowBlock;
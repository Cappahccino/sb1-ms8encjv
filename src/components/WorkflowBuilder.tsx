import React, { useState, useRef } from 'react';
import { useWorkflow } from '../contexts/WorkflowContext';
import WorkflowBlock from './WorkflowBlock';
import PropertyPanel from './PropertyPanel';
import { BlockType, WorkflowBlock as WorkflowBlockType } from '../types/workflow';

const WorkflowBuilder: React.FC = () => {
  const { blocks, connections, addBlock, addConnection, updateBlockPosition, selectedBlockId, selectBlock } = useWorkflow();
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // Handle dropping a new block from the sidebar
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    
    const blockType = e.dataTransfer.getData('blockType') as BlockType;
    const existingBlockId = e.dataTransfer.getData('blockId');
    
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const offsetX = parseInt(e.dataTransfer.getData('offsetX')) || 0;
      const offsetY = parseInt(e.dataTransfer.getData('offsetY')) || 0;
      
      const x = e.clientX - rect.left - offsetX;
      const y = e.clientY - rect.top - offsetY;
      
      if (existingBlockId) {
        // Moving existing block
        updateBlockPosition(existingBlockId, x, y);
      } else if (blockType) {
        // Adding new block
        addBlock(blockType, { x, y });
      }
    }
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
    e.dataTransfer.dropEffect = 'move';
  };
  
  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };
  
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      selectBlock(null);
      setConnectingFrom(null);
    }
  };
  
  const handleStartConnection = (blockId: string) => {
    setConnectingFrom(blockId);
  };
  
  const handleEndConnection = (targetId: string) => {
    if (connectingFrom && connectingFrom !== targetId) {
      addConnection(connectingFrom, targetId);
    }
    setConnectingFrom(null);
  };
  
  // Draw connections between blocks
  const renderConnections = () => {
    return connections.map((connection, index) => {
      const sourceBlock = blocks.find(block => block.id === connection.sourceId);
      const targetBlock = blocks.find(block => block.id === connection.targetId);
      
      if (!sourceBlock || !targetBlock) return null;
      
      // Calculate connection points
      const sourceX = sourceBlock.position.x + 150;
      const sourceY = sourceBlock.position.y + 100;
      const targetX = targetBlock.position.x + 150;
      const targetY = targetBlock.position.y;
      
      // Create a curved path
      const midY = (sourceY + targetY) / 2;
      const path = `M${sourceX},${sourceY} C${sourceX},${midY} ${targetX},${midY} ${targetX},${targetY}`;
      
      return (
        <path
          key={`connection-${index}`}
          d={path}
          stroke="#94A3B8"
          strokeWidth="2"
          fill="none"
          className="connector"
        />
      );
    });
  };
  
  // Render temporary connection line while dragging
  const renderTempConnection = () => {
    if (!connectingFrom) return null;
    
    const sourceBlock = blocks.find(block => block.id === connectingFrom);
    if (!sourceBlock) return null;
    
    const sourceX = sourceBlock.position.x + 150;
    const sourceY = sourceBlock.position.y + 100;
    
    return (
      <line
        x1={sourceX}
        y1={sourceY}
        x2={sourceX}
        y2={sourceY + 100}
        stroke="#94A3B8"
        strokeWidth="2"
        strokeDasharray="5,5"
        className="temp-connector"
      />
    );
  };
  
  return (
    <div className="flex h-full">
      <div 
        ref={canvasRef}
        className={`flex-1 border border-dashed rounded-lg ${
          isDraggingOver ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20' : 'border-slate-300 dark:border-slate-700'
        } overflow-auto relative`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleCanvasClick}
      >
        <svg className="absolute w-full h-full pointer-events-none">
          {renderConnections()}
          {renderTempConnection()}
        </svg>
        
        {blocks.map(block => (
          <WorkflowBlock
            key={block.id}
            block={block}
            isSelected={block.id === selectedBlockId}
            isConnecting={connectingFrom === block.id}
            onSelect={() => selectBlock(block.id)}
            onStartConnection={handleStartConnection}
            onEndConnection={handleEndConnection}
          />
        ))}
        
        {blocks.length === 0 && !isDraggingOver && (
          <div className="absolute inset-0 flex items-center justify-center text-slate-400 pointer-events-none">
            <div className="text-center">
              <p className="mb-2">Drag and drop blocks from the sidebar to start building your workflow</p>
              <p className="text-sm">⬅️ Start with a data source block</p>
            </div>
          </div>
        )}
      </div>
      
      {selectedBlockId && (
        <PropertyPanel blockId={selectedBlockId} />
      )}
    </div>
  );
};

export default WorkflowBuilder;
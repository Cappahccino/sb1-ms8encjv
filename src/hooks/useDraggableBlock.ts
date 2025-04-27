import { useRef } from 'react';
import { BlockType } from '../types/workflow';
import { useWorkflow } from '../contexts/WorkflowContext';

export const useDraggableBlock = (blockType: BlockType) => {
  const dragRef = useRef<HTMLDivElement>(null);
  const { addBlock } = useWorkflow();
  
  const handleDragStart = (e: React.DragEvent) => {
    if (e.dataTransfer) {
      e.dataTransfer.setData('blockType', blockType);
      e.dataTransfer.effectAllowed = 'move';
      
      if (dragRef.current) {
        const rect = dragRef.current.getBoundingClientRect();
        e.dataTransfer.setData('offsetX', (e.clientX - rect.left).toString());
        e.dataTransfer.setData('offsetY', (e.clientY - rect.top).toString());
      }
    }
  };
  
  return {
    dragRef,
    onDragStart: handleDragStart
  };
};
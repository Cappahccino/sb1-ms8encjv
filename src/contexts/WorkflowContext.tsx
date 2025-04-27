import { createContext, useContext, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  Workflow, 
  WorkflowBlock, 
  Connection, 
  BlockType, 
  BlockConfig 
} from '../types/workflow';

interface WorkflowContextType {
  workflow: Workflow | null;
  blocks: WorkflowBlock[];
  connections: Connection[];
  selectedBlockId: string | null;
  workflowName: string;
  addBlock: (type: BlockType, position: { x: number; y: number }) => void;
  updateBlockPosition: (blockId: string, x: number, y: number) => void;
  removeBlock: (blockId: string) => void;
  addConnection: (sourceId: string, targetId: string) => void;
  removeConnection: (sourceId: string, targetId: string) => void;
  updateBlockConfig: (blockId: string, config: BlockConfig) => void;
  selectBlock: (blockId: string | null) => void;
  saveWorkflow: () => void;
  runWorkflow: () => void;
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

interface WorkflowProviderProps {
  children: ReactNode;
}

export const WorkflowProvider = ({ children }: WorkflowProviderProps) => {
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [blocks, setBlocks] = useState<WorkflowBlock[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [workflowName, setWorkflowName] = useState<string>('New Workflow');
  
  const addBlock = (type: BlockType, position: { x: number; y: number }) => {
    const newBlock: WorkflowBlock = {
      id: uuidv4(),
      type,
      position,
      config: {},
      label: getDefaultLabelForType(type),
    };
    
    setBlocks(prevBlocks => [...prevBlocks, newBlock]);
    setSelectedBlockId(newBlock.id);
  };
  
  const getDefaultLabelForType = (type: BlockType): string => {
    switch (type) {
      case 'api':
        return 'API Source';
      case 'file':
        return 'File Upload';
      case 'database':
        return 'Database Source';
      case 'sheets':
        return 'Google Sheets';
      case 'clean':
        return 'Clean Data';
      case 'transform':
        return 'Transform Data';
      case 'merge':
        return 'Merge Data';
      default:
        return 'Block';
    }
  };
  
  const updateBlockPosition = (blockId: string, x: number, y: number) => {
    setBlocks(prevBlocks => 
      prevBlocks.map(block => 
        block.id === blockId 
          ? { ...block, position: { x, y } } 
          : block
      )
    );
  };
  
  const removeBlock = (blockId: string) => {
    setBlocks(prevBlocks => prevBlocks.filter(block => block.id !== blockId));
    setConnections(prevConnections => 
      prevConnections.filter(conn => conn.sourceId !== blockId && conn.targetId !== blockId)
    );
    
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
    }
  };
  
  const addConnection = (sourceId: string, targetId: string) => {
    if (sourceId === targetId) return;
    
    setConnections(prevConnections => {
      const exists = prevConnections.some(
        conn => conn.sourceId === sourceId && conn.targetId === targetId
      );
      
      if (exists) return prevConnections;
      
      return [...prevConnections, { sourceId, targetId }];
    });
  };
  
  const removeConnection = (sourceId: string, targetId: string) => {
    setConnections(prevConnections => 
      prevConnections.filter(
        conn => !(conn.sourceId === sourceId && conn.targetId === targetId)
      )
    );
  };
  
  const updateBlockConfig = (blockId: string, config: BlockConfig) => {
    setBlocks(prevBlocks => 
      prevBlocks.map(block => 
        block.id === blockId 
          ? { ...block, config: { ...block.config, ...config } } 
          : block
      )
    );
  };
  
  const selectBlock = (blockId: string | null) => {
    setSelectedBlockId(blockId);
  };
  
  const saveWorkflow = () => {
    const savedWorkflow: Workflow = {
      id: workflow?.id || uuidv4(),
      name: workflowName,
      blocks,
      connections,
      createdAt: workflow?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ownerId: 'user-123', // Would come from auth
      isPublished: false,
    };
    
    setWorkflow(savedWorkflow);
    console.log('Workflow saved:', savedWorkflow);
  };
  
  const runWorkflow = () => {
    console.log('Running workflow:', { blocks, connections });
  };
  
  return (
    <WorkflowContext.Provider value={{
      workflow,
      blocks,
      connections,
      selectedBlockId,
      workflowName,
      addBlock,
      updateBlockPosition,
      removeBlock,
      addConnection,
      removeConnection,
      updateBlockConfig,
      selectBlock,
      saveWorkflow,
      runWorkflow,
    }}>
      {children}
    </WorkflowContext.Provider>
  );
};

export const useWorkflow = () => {
  const context = useContext(WorkflowContext);
  if (context === undefined) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }
  return context;
};
// Define the types of blocks available in the workflow
export type BlockType = 
  | 'api' 
  | 'file' 
  | 'database' 
  | 'sheets' 
  | 'clean' 
  | 'transform' 
  | 'merge';

// Interface for connection between blocks
export interface Connection {
  sourceId: string;
  targetId: string;
}

// Block configuration for different block types
export interface BlockConfig {
  // API block config
  apiUrl?: string;
  apiMethod?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  apiHeaders?: Record<string, string>;
  apiBody?: string;
  
  // File block config
  fileType?: 'csv' | 'xlsx' | 'json' | 'xml';
  fileMapping?: Record<string, string>;
  
  // Database block config
  dbType?: 'postgresql' | 'mysql' | 'supabase';
  dbConnection?: string;
  dbQuery?: string;
  
  // Google Sheets config
  sheetId?: string;
  sheetRange?: string;
  
  // Clean data config
  cleaningRules?: CleaningRule[];
  
  // Transform config
  transformations?: Transformation[];
  
  // Merge config
  mergeStrategy?: 'inner' | 'left' | 'right' | 'full';
  mergeKey?: string;
}

export interface CleaningRule {
  field: string;
  action: 'remove_duplicates' | 'fill_nulls' | 'trim' | 'normalize' | 'regex_replace';
  value?: string; // Used for fill_nulls and regex_replace
}

export interface Transformation {
  type: 'formula' | 'filter' | 'aggregate' | 'sort' | 'rename';
  field?: string;
  formula?: string;
  condition?: string;
  aggregation?: 'sum' | 'avg' | 'min' | 'max' | 'count';
  direction?: 'asc' | 'desc';
  newName?: string;
}

// Interface for workflow blocks
export interface WorkflowBlock {
  id: string;
  type: BlockType;
  position: {
    x: number;
    y: number;
  };
  config: BlockConfig;
  label: string;
}

// Interface for complete workflow
export interface Workflow {
  id: string;
  name: string;
  description?: string;
  blocks: WorkflowBlock[];
  connections: Connection[];
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  isPublished: boolean;
  schedule?: WorkflowSchedule;
}

// Interface for workflow schedule
export interface WorkflowSchedule {
  enabled: boolean;
  cron: string; // Cron expression
  timezone: string;
  nextRunAt?: string;
  lastRunAt?: string;
}

// Interface for workflow execution history
export interface WorkflowExecution {
  id: string;
  workflowId: string;
  startedAt: string;
  completedAt?: string;
  status: 'running' | 'completed' | 'failed';
  error?: string;
  logs: ExecutionLog[];
  result?: any;
}

export interface ExecutionLog {
  blockId: string;
  timestamp: string;
  message: string;
  level: 'info' | 'warning' | 'error';
  data?: any;
}
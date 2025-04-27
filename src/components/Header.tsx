import { useState } from 'react';
import { Play, Save, Share2, Clock } from 'lucide-react';
import { useWorkflow } from '../contexts/WorkflowContext';

const Header = () => {
  const { workflowName, saveWorkflow, runWorkflow } = useWorkflow();
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  
  return (
    <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold truncate max-w-md">
            {workflowName || "Untitled Workflow"}
          </h1>
          <span className="px-2 py-1 text-xs rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
            Draft
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setIsScheduleOpen(true)}
            className="flex items-center px-3 py-1.5 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <Clock size={16} className="mr-1.5" />
            <span>Schedule</span>
          </button>
          
          <button 
            onClick={() => saveWorkflow()}
            className="flex items-center px-3 py-1.5 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <Save size={16} className="mr-1.5" />
            <span>Save</span>
          </button>
          
          <button 
            onClick={() => runWorkflow()}
            className="flex items-center px-4 py-1.5 rounded-md bg-indigo-100 text-indigo-800 hover:bg-indigo-200 dark:bg-indigo-900 dark:text-indigo-200 dark:hover:bg-indigo-800"
          >
            <Play size={16} className="mr-1.5" />
            <span>Run</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
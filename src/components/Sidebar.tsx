import React from 'react';
import { 
  LayoutDashboard, 
  FileSpreadsheet, 
  Layers, 
  Clock, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Database,
  FileUp,
  Table,
  Workflow
} from 'lucide-react';
import { BlockType } from '../types/workflow';
import { useDraggableBlock } from '../hooks/useDraggableBlock';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  return (
    <div 
      className={`relative h-full bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        {!collapsed && (
          <span className="font-bold text-lg text-indigo-900 dark:text-indigo-100">FlowFinance</span>
        )}
        <button 
          className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 ml-auto"
          onClick={onToggle}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      
      <nav className="p-2">
        <ul className="space-y-1">
          <SidebarItem icon={<LayoutDashboard size={20} />} label="Dashboard" collapsed={collapsed} />
          <SidebarItem icon={<Workflow size={20} />} label="Workflows" collapsed={collapsed} active />
          <SidebarItem icon={<Clock size={20} />} label="Schedules" collapsed={collapsed} />
          <SidebarItem icon={<Layers size={20} />} label="History" collapsed={collapsed} />
          <SidebarItem icon={<Settings size={20} />} label="Settings" collapsed={collapsed} />
        </ul>
      </nav>
      
      {!collapsed && (
        <div className="mt-6 px-3">
          <h3 className="text-xs uppercase text-slate-500 mb-2 font-semibold px-1">Data Sources</h3>
          <div className="space-y-2">
            <DraggableBlock type="api" icon={<Database size={16} />} label="API" />
            <DraggableBlock type="file" icon={<FileUp size={16} />} label="File Upload" />
            <DraggableBlock type="database" icon={<Database size={16} />} label="Database" />
            <DraggableBlock type="sheets" icon={<FileSpreadsheet size={16} />} label="Google Sheets" />
          </div>
        </div>
      )}
      
      {!collapsed && (
        <div className="mt-6 px-3">
          <h3 className="text-xs uppercase text-slate-500 mb-2 font-semibold px-1">Transformations</h3>
          <div className="space-y-2">
            <DraggableBlock type="clean" icon={<Table size={16} />} label="Clean Data" />
            <DraggableBlock type="transform" icon={<Layers size={16} />} label="Transform" />
            <DraggableBlock type="merge" icon={<Layers size={16} />} label="Merge Data" />
          </div>
        </div>
      )}
    </div>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
  active?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, collapsed, active }) => {
  return (
    <li>
      <a 
        href="#" 
        className={`flex items-center space-x-2 p-2 rounded-md ${
          active 
            ? 'bg-indigo-50 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100' 
            : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'
        } transition-colors duration-150`}
      >
        <span>{icon}</span>
        {!collapsed && <span>{label}</span>}
      </a>
    </li>
  );
};

interface DraggableBlockProps {
  type: BlockType;
  icon: React.ReactNode;
  label: string;
}

const DraggableBlock: React.FC<DraggableBlockProps> = ({ type, icon, label }) => {
  const { dragRef, onDragStart } = useDraggableBlock(type);
  
  return (
    <div 
      ref={dragRef}
      draggable
      onDragStart={onDragStart}
      className="p-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md cursor-grab flex items-center space-x-2 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors duration-150"
    >
      <span className="text-slate-700 dark:text-slate-300">{icon}</span>
      <span className="text-sm">{label}</span>
    </div>
  );
};

export default Sidebar;
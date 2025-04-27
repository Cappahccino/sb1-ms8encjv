import { useState } from 'react';
import Sidebar from './components/Sidebar';
import WorkflowBuilder from './components/WorkflowBuilder';
import Header from './components/Header';
import { WorkflowProvider } from './contexts/WorkflowContext';
import './App.css';

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  return (
    <WorkflowProvider>
      <div className="flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
        <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-auto p-4">
            <WorkflowBuilder />
          </main>
        </div>
      </div>
    </WorkflowProvider>
  );
}

export default App;
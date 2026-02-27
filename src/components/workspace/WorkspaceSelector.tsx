import { useWorkspace } from '@/contexts/WorkspaceContext';
import { Button } from '@/components/ui/button';
import { FolderOpen, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function WorkspaceSelector() {
  const { openWorkspace, recentWorkspaces } = useWorkspace();

  const handleOpenWorkspace = async () => {
    const path = await window.api.selectWorkspace();
    if (path) {
      await openWorkspace(path);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen workspace-selector-dark dark:workspace-selector-dark" style={{ backgroundColor: '#1A1A1B' }}>
      <div className="w-full max-w-2xl px-6">
        {/* Atlas Logo */}
        <div className="flex flex-col items-center mb-12">
          <div className="relative mb-6">
            {/* Logo Container */}
            <div className="w-32 h-32 rounded-2xl bg-[#272727] flex items-center justify-center relative">
              <span className="text-7xl font-bold text-white">A</span>
              <div className="absolute top-4 right-4 w-4 h-4 rounded bg-[#182CC4]"></div>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-2">Atlas</h1>
          <h2 className="text-4xl font-medium text-gray-400">Workspace</h2>
          <p className="text-gray-500 text-lg mt-4">
            Your local markdown workspace for developers
          </p>
        </div>
        
        {/* Open Workspace Button */}
        <div className="flex justify-center mb-8">
          <Button
            onClick={handleOpenWorkspace}
            size="lg"
            className="px-8 py-6 text-lg gap-3 rounded-xl"
            style={{ backgroundColor: '#182CC4' }}
          >
            <FolderOpen className="h-6 w-6" />
            Open Workspace
          </Button>
        </div>

        {/* Recent Workspaces */}
        {recentWorkspaces.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center gap-2 mb-4 text-gray-500">
              <Clock className="h-4 w-4" />
              <h2 className="text-sm font-semibold uppercase tracking-wide">
                Recent Workspaces
              </h2>
            </div>
            
            <div className="space-y-2">
              {recentWorkspaces.map((workspace) => (
                <button
                  key={workspace.path}
                  onClick={() => openWorkspace(workspace.path)}
                  className="w-full text-left px-4 py-3 rounded-lg border border-gray-800 bg-[#272727] hover:bg-[#2F2F2F] transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FolderOpen className="h-5 w-5 text-gray-500 group-hover:text-white" />
                      <div>
                        <div className="font-medium text-white">{workspace.name}</div>
                        <div className="text-sm text-gray-500 truncate max-w-md">
                          {workspace.path}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600">
                      {formatDistanceToNow(new Date(workspace.lastOpened), { addSuffix: true })}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

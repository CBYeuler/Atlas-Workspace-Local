import { useWorkspace } from '@/contexts/WorkspaceContext';

export default function WorkspaceSelector() {
  const { loadWorkspace } = useWorkspace();

  const handleSelectWorkspace = async () => {
    const path = await window.api.selectWorkspace();
    if (path) {
      await loadWorkspace(path);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4 text-white">🗺️ Atlas Workspace</h1>
        <p className="text-gray-400 mb-8 text-lg">
          Your local markdown workspace for developers
        </p>
        
        <button
          onClick={handleSelectWorkspace}
          className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-lg transition-colors"
        >
          Open Workspace
        </button>
        
        <p className="mt-4 text-gray-500 text-sm">
          Select a folder containing your markdown files
        </p>
      </div>
    </div>
  );
}

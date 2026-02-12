import { useWorkspace } from '@/contexts/WorkspaceContext';

export default function FileSidebar() {
  const { files, loadFile, currentFile } = useWorkspace();

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 p-4">
      <h2 className="text-lg font-semibold mb-4">Files</h2>
      <div className="space-y-1">
        {files.map((file) => (
          <button
            key={file.path}
            onClick={() => loadFile(file.path)}
            className={`w-full text-left px-3 py-2 rounded text-sm ${
              currentFile === file.path
                ? 'bg-blue-600 text-white'
                : 'hover:bg-gray-800 text-gray-300'
            }`}
          >
            {file.name}
          </button>
        ))}
      </div>
    </div>
  );
}

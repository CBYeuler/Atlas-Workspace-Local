import { useWorkspace } from '@/contexts/WorkspaceContext';
import { useEffect, useState } from 'react';

export default function NoteEditor() {
  const { currentFile, currentContent, saveFile } = useWorkspace();
  const [content, setContent] = useState('');

  useEffect(() => {
    setContent(currentContent);
  }, [currentContent]);

  const handleSave = () => {
    if (currentFile) {
      saveFile(currentFile, content);
    }
  };

  if (!currentFile) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Select a file to start editing
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-gray-800 p-4">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          Save
        </button>
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-1 p-4 bg-gray-950 text-gray-100 resize-none focus:outline-none font-mono"
      />
    </div>
  );
}

import { useState } from 'react';

function App() {
  const [workspace, setWorkspace] = useState<string | null>(null);
  const [files, setFiles] = useState<any[]>([]);

  const handleSelectWorkspace = async () => {
    const path = await window.api.selectWorkspace();
    if (path) {
      setWorkspace(path);
      const workspaceFiles = await window.api.readWorkspace(path);
      setFiles(workspaceFiles);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'system-ui, sans-serif',
      background: '#1a1a1a',
      color: '#fff',
      minHeight: '100vh'
    }}>
      <h1>🗺️ Atlas Workspace Local</h1>
      
      <button 
        onClick={handleSelectWorkspace}
        style={{
          padding: '12px 24px',
          fontSize: '16px',
          background: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        Open Workspace
      </button>

      {workspace && (
        <div style={{ marginTop: '20px' }}>
          <h2>Workspace: {workspace}</h2>
          <h3>Files ({files.length}):</h3>
          <ul>
            {files.map((file, i) => (
              <li key={i}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;

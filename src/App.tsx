import { WorkspaceProvider } from './contexts/WorkspaceContext';
import WorkspaceSelector from './components/workspace/WorkspaceSelector';
import FileSidebar from './components/sidebar/FileSidebar';
import NoteEditor from './components/editor/NoteEditor';
import { useWorkspace } from './contexts/WorkspaceContext';

function AppContent() {
  const { workspacePath } = useWorkspace();

  if (!workspacePath) {
    return <WorkspaceSelector />;
  }

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100">
      <FileSidebar />
      <div className="flex-1">
        <NoteEditor />
      </div>
    </div>
  );
}

function App() {
  return (
    <WorkspaceProvider>
      <AppContent />
    </WorkspaceProvider>
  );
}

export default App;

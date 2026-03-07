<<<<<<< HEAD
import { useState } from 'react';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { FolderOpen, Trash2, Plus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Input } from '@/components/ui/input';

export default function WorkspaceSelector() {
  const { vaults, createVault, openVault, deleteVault } = useWorkspace();
  const [showCreateVault, setShowCreateVault] = useState(false);
  const [vaultName, setVaultName] = useState('');

  const handleCreateVault = async () => {
    if (!vaultName.trim()) return;
    
    try {
      await createVault(vaultName);
      setVaultName('');
      setShowCreateVault(false);
    } catch (error) {
      console.error('Error creating vault:', error);
    }
  };

  const recentVaults = [...vaults]
    .sort((a, b) => new Date(b.lastOpened).getTime() - new Date(a.lastOpened).getTime())
    .slice(0, 5);

  return (
    <div 
      className="flex items-center justify-center min-h-screen" 
      style={{ backgroundColor: '#1A1A1B' }}
    >
      <div className="w-full max-w-2xl px-6">
        {/* Atlas Logo */}
        <div className="flex flex-col items-center mb-12">
          <div className="relative mb-6">
            <div 
              className="w-32 h-32 rounded-2xl flex items-center justify-center relative" 
              style={{ backgroundColor: '#272727' }}
            >
              <span className="text-7xl font-bold text-white">A</span>
              <div 
                className="absolute top-4 right-4 w-4 h-4 rounded" 
                style={{ backgroundColor: '#182CC4' }}
              ></div>
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-2 text-white">Atlas</h1>
          <h2 className="text-4xl font-medium text-gray-400">Workspace</h2>
          <p className="text-gray-500 text-lg mt-4">
            Your local markdown workspace for developers
          </p>
        </div>
        
        {/* Create Vault Section */}
        {vaults.length === 0 || showCreateVault ? (
          <div className="mb-8">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Vault name (e.g., Work Notes)"
                value={vaultName}
                onChange={(e) => setVaultName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateVault()}
                className="flex-1 bg-[#272727] border-gray-800 text-white"
              />
              <button
                onClick={handleCreateVault}
                className="px-6 py-2 rounded-xl text-white font-medium transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#182CC4' }}
              >
                Create Vault
              </button>
              {vaults.length > 0 && (
                <button
                  onClick={() => {
                    setShowCreateVault(false);
                    setVaultName('');
                  }}
                  className="px-4 py-2 rounded-xl text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex justify-center mb-8">
            <button
              onClick={() => setShowCreateVault(true)}
              className="px-8 py-4 text-lg rounded-xl text-white font-medium flex items-center gap-3 transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#182CC4' }}
            >
              <Plus className="h-6 w-6" />
              Create New Vault
            </button>
          </div>
        )}

        {/* Recent Vaults */}
        {recentVaults.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center gap-2 mb-4 text-gray-500">
              <FolderOpen className="h-4 w-4" />
              <h2 className="text-sm font-semibold uppercase tracking-wide">
                {vaults.length <= 5 ? 'Your Vaults' : 'Recent Vaults'}
              </h2>
            </div>
            
            <div className="space-y-2">
              {recentVaults.map((vault) => (
                <div
                  key={vault.id}
                  className="flex items-center justify-between px-4 py-3 rounded-lg border border-gray-800 transition-colors hover:bg-opacity-80"
                  style={{ backgroundColor: '#272727' }}
                >
                  <button
                    onClick={() => openVault(vault.id)}
                    className="flex items-center gap-3 flex-1 text-left"
                  >
                    <FolderOpen className="h-5 w-5 text-gray-500" />
                    <div>
                      <div className="font-medium text-white">{vault.name}</div>
                      <div className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(vault.lastOpened), { addSuffix: true })}
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => deleteVault(vault.id)}
                    className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Vaults Link */}
        {vaults.length > 5 && (
          <div className="mt-4 text-center">
            <button className="text-sm text-gray-500 hover:text-white">
              View all {vaults.length} vaults →
            </button>
          </div>
        )}
=======
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
>>>>>>> 8602c60e7d725e8638f2b285398ff308c6a0d674
      </div>
    </div>
  );
}

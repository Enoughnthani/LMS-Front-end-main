import { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useProgramResources } from './hooks/useProgramResources';
import ResourcesHeader from './ResourcesHeader';
import ResourcesBreadcrumb from './ResourcesBreadcrumb';
import ResourcesGrid from './ResourcesGrid';
import CreateFolderModal from './CreateFolderModal';
import RenameResourceModal from './RenameResourceModal';
import UploadProgress from './UploadProgress';
import { FaFolder } from 'react-icons/fa';

export default function ProgramResources() {
  const { programId } = useParams();
  const {
    contents,
    currentFolder,
    currentPath,
    loading,
    uploadProgress,
    openFolder,
    goBack,
    navigateToPath,
    createFolder,
    uploadFile,
    renameItem,
    deleteItem
  } = useProgramResources(programId);

  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => uploadFile(file));
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => uploadFile(file));
    e.target.value = '';
  };

  if (loading && contents.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
          <p className="text-gray-500">Loading resources...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="h-screen w-full flex flex-col bg-gray-50 overflow-hidden"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Header */}
      <ResourcesHeader 
        onNewFolder={() => setShowFolderModal(true)}
        onUpload={() => fileInputRef.current?.click()}
      />

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />

      {/* Breadcrumb */}
      <ResourcesBreadcrumb 
        currentPath={currentPath}
        onNavigate={navigateToPath}
        onBack={goBack}
        canGoBack={currentPath.length > 0}
      />

      {/* Upload Progress */}
      {uploadProgress !== null && (
        <UploadProgress progress={uploadProgress} />
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {contents.length === 0 ? (
          <div className="text-center py-16 mt-20">
            <FaFolder size={80} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">Empty folder</h3>
            <p className="text-gray-400 text-sm mb-4">Upload files or create a folder</p>
            <div className="flex justify-center gap-3">
              <button 
                onClick={() => setShowFolderModal(true)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                New Folder
              </button>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Upload Files
              </button>
            </div>
          </div>
        ) : (
          <ResourcesGrid 
            items={contents}
            onOpenFolder={openFolder}
            onRename={(item) => {
              setSelectedItem(item);
              setShowRenameModal(true);
            }}
            onDelete={deleteItem}
          />
        )}
      </div>

      {/* Modals */}
      <CreateFolderModal 
        show={showFolderModal}
        onHide={() => setShowFolderModal(false)}
        onSave={createFolder}
      />

      <RenameResourceModal 
        show={showRenameModal}
        onHide={() => setShowRenameModal(false)}
        item={selectedItem}
        onSave={renameItem}
      />
    </div>
  );
}
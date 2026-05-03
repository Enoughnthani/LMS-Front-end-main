import { FaFolder, FaFileAlt, FaArrowLeft, FaDownload, FaEye, FaFilePdf, FaFileWord, FaFileExcel, FaFilePowerpoint, FaVideo, FaExternalLinkAlt } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import { ArrowLeft, ArrowRight, ChevronRight, Download, Eye, Folder, FolderOpen } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function LearnerContentPage() {
  const [currentPath, setCurrentPath] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [fileSystem, setFileSystem] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { unitStandard } = location?.state || {};

  useEffect(() => {
    if (unitStandard && unitStandard.contents) {
      // Build file system from unit standard contents
      const buildFileSystem = () => {
        const rootChildren = [];
        const folderMap = new Map();

        // First pass: create all items
        unitStandard.contents.forEach(content => {
          const item = {
            id: content.id,
            name: content.name,
            type: content.type === 'FOLDER' ? 'folder' : content.type.toLowerCase(),
            size: content.fileSize,
            duration: content.duration,
            url: content.fileUrl,
            externalUrl: content.externalUrl,
            downloadable: content.downloadable,
            parentId: content.parentId,
            children: []
          };
          folderMap.set(content.id, item);
          
          if (!content.parentId) {
            rootChildren.push(item);
          }
        });

        // Second pass: build hierarchy
        folderMap.forEach(item => {
          if (item.parentId && folderMap.has(item.parentId)) {
            const parent = folderMap.get(item.parentId);
            parent.children.push(item);
          }
        });

        return {
          name: "Content",
          type: "root",
          children: rootChildren
        };
      };

      setFileSystem(buildFileSystem());
    }
  }, [unitStandard]);

  const getFileIcon = (type) => {
    const t = type?.toLowerCase();
    switch (t) {
      case 'pdf': return <FaFilePdf className="text-red-500 text-xl" />;
      case 'docx': return <FaFileWord className="text-blue-600 text-xl" />;
      case 'xlsx': return <FaFileExcel className="text-green-600 text-xl" />;
      case 'pptx': return <FaFilePowerpoint className="text-orange-600 text-xl" />;
      case 'video': return <FaVideo className="text-purple-500 text-xl" />;
      case 'link': return <FaExternalLinkAlt className="text-cyan-500 text-xl" />;
      case 'folder': return <FaFolder className="text-amber-400 text-xl" />;
      default: return <FaFileAlt className="text-gray-500 text-xl" />;
    }
  };

  const getCurrentContent = () => {
    if (!fileSystem) return [];
    if (!currentFolder) {
      return fileSystem.children;
    }
    return currentFolder.children;
  };

  const handleFolderClick = (folder) => {
    setCurrentPath([...currentPath, folder]);
    setCurrentFolder(folder);
  };

  const handleBackClick = () => {
    if (currentFolder) {
      const newPath = [...currentPath];
      newPath.pop();
      setCurrentPath(newPath);
      setCurrentFolder(newPath.length > 0 ? newPath[newPath.length - 1] : null);
    }
  };

  const handleDownload = (item, e) => {
    e.stopPropagation();
    if (item.url) {
      window.open(item.url, '_blank');
    } else {
      alert(`Downloading: ${item.name}`);
    }
  };

  const handlePreview = (item) => {
    navigate(`preview/${item.id}`, { state: { file: item } });
  };

  const content = getCurrentContent();

  if (!fileSystem) {
    return (
      <div className="w-full overflow-y-auto h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center py-20">
            <FaFolder size={60} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No content available for this unit standard</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-y-auto h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl">
              <FaFolder size={40} className="text-amber-300 text-xl" />
            </div>
            <h1 className="text-3xl m-0 font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              {unitStandard?.title || 'Course Content'}
            </h1>
          </div>
          <p className="text-gray-500 ml-2">
            {unitStandard?.programName} • {unitStandard?.credits} credits • {unitStandard?.nqfLevel}
          </p>
        </div>

        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <button
            onClick={handleBackClick}
            className={`bg-transparent flex items-center gap-2 px-3 py-1.5 rounded-lg transition ${!currentFolder
              ? 'opacity-50 cursor-not-allowed text-gray-400'
              : 'hover:bg-gray-200 text-gray-700'
              }`}
            disabled={!currentFolder}
          >
            <ArrowLeft size={19} /> Back
          </button>

          <div className="flex items-center gap-2 text-gray-600">
            <span className="font-medium text-gray-500">Content Library</span>
            {currentPath.map((folder, index) => (
              <span key={index} className="flex items-center gap-2">
                <ChevronRight size={19} />
                <span className="text-gray-500 font-medium">{folder.name}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Folder/File Grid */}
        {!currentFolder ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 gap-5">
            {content.map((item) => (
              <div key={item.id} className="cursor-pointer">
                <div
                  onClick={() => handleFolderClick(item)}
                  className='flex items-center rounded flex-col hover:bg-gray-100 p-3 transition'
                >
                  <FaFolder size={100} className='text-amber-300' />
                  <span className="mt-2 text-center text-gray-700">{item.name}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                <FaFolder className="text-amber-300" />
                {currentFolder.name}
              </h4>
            </div>
            <div className="divide-y divide-gray-100">
              {content.map((item) => (
                <div key={item.id} className="p-3 hover:bg-gray-50 transition group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="p-2 bg-gray-100 rounded-xl group-hover:bg-purple-100 transition">
                        {getFileIcon(item.type)}
                      </div>

                      <div className="flex-1">
                        <h6 className="font-medium text-gray-800 mb-1">{item.name}</h6>
                        <div className="flex gap-3 text-xs text-gray-500">
                          {item.type === 'video' && item.duration && (
                            <span className="flex items-center gap-1">🎬 Duration: {item.duration}</span>
                          )}
                          {item.size && (
                            <span className="flex items-center gap-1">📦 Size: {item.size}</span>
                          )}
                          {item.type === 'link' && (
                            <span className="flex items-center gap-1">🔗 External resource</span>
                          )}
                          <span className="capitalize">• {item.type}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {item.type === 'link' ? (
                        <button 
                          onClick={() => window.open(item.externalUrl, '_blank')} 
                          className="px-4 py-2 bg-cyan-50 text-cyan-600 rounded-xl text-sm font-medium hover:bg-cyan-100 transition flex items-center gap-2"
                        >
                          <FaExternalLinkAlt size={12} /> Visit
                        </button>
                      ) : (
                        <div className='grid grid-cols-2 gap-2'>
                          <Button
                            onClick={(e) => handleDownload(item, e)}
                            variant='success'
                            size='sm'
                            className='font-semibold flex items-center gap-1'
                          >
                            <Download size={18} /> Download
                          </Button>
                          <Button
                            size='sm'
                            className="text-white font-semibold flex items-center gap-1"
                            variant='warning'
                            onClick={() => handlePreview(item)}
                          >
                            <Eye size={18} /> Preview
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {content.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-16 text-center">
            <div className="text-6xl mb-4">📁</div>
            <p className="text-gray-500 text-lg">This folder is empty</p>
            <p className="text-gray-400 text-sm mt-2">No resources available yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
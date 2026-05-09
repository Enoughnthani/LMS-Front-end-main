import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FaFolder, FaFileAlt, FaArrowLeft, FaDownload, FaEye,
  FaFilePdf, FaFileWord, FaFileExcel, FaFilePowerpoint,
  FaVideo, FaExternalLinkAlt, FaChevronRight, FaMusic,
  FaFileImage, FaTimes
} from 'react-icons/fa';
import { Button, Modal } from 'react-bootstrap';
import { BASE_URL } from '@/utils/apiEndpoint';

export default function LearnerContentPage() {
  const [currentFolder, setCurrentFolder] = useState(null);
  const [currentPath, setCurrentPath] = useState([]);
  const [fileSystem, setFileSystem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewItem, setPreviewItem] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { unitStandard } = location?.state || {};

  useEffect(() => {
    if (unitStandard && unitStandard.contents) {
      const buildFileSystem = () => {
        const rootChildren = [];
        const folderMap = new Map();

        unitStandard.contents.forEach(content => {
          const isFolder = content.type === 'FOLDER';
          const item = {
            id: content.id,
            name: content.name,
            type: content.type,
            size: content.fileSize,
            duration: content.duration,
            url: content.fileUrl,
            externalUrl: content.externalUrl,
            downloadable: content.downloadable,
            parentId: content.parentId,
            children: [],
            isFolder: isFolder
          };
          folderMap.set(content.id, item);

          if (!content.parentId) {
            rootChildren.push(item);
          }
        });

        folderMap.forEach(item => {
          if (item.parentId && folderMap.has(item.parentId)) {
            const parent = folderMap.get(item.parentId);
            if (parent.isFolder) {
              parent.children.push(item);
            }
          }
        });

        return {
          name: "Content",
          type: "root",
          children: rootChildren
        };
      };

      setFileSystem(buildFileSystem());
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [unitStandard]);

  const getFileIcon = (type, name, size = "text-4xl") => {
    const isImage = name?.match(/\.(jpg|jpeg|png|gif|webp)$/i);
    
    if (isImage) {
      return <FaFileImage size={64} className={`text-blue-500 ${size}`} />;
    }
    
    switch (type) {
      case 'PDF': return <FaFilePdf size={64} className={`text-red-500 ${size}`} />;
      case 'DOCX': return <FaFileWord size={64} className={`text-blue-600 ${size}`} />;
      case 'XLSX': return <FaFileExcel size={64} className={`text-green-600 ${size}`} />;
      case 'PPTX': return <FaFilePowerpoint size={64} className={`text-orange-500 ${size}`} />;
      case 'VIDEO': return <FaVideo size={64} className={`text-purple-500 ${size}`} />;
      case 'MP3': return <FaMusic size={64} className={`text-pink-500 ${size}`} />;
      case 'FOLDER': return <FaFolder size={64} className={`text-amber-400 ${size}`} />;
      default: return <FaFileAlt size={64} className={`text-gray-500 ${size}`} />;
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
    if (folder.isFolder) {
      setCurrentPath([...currentPath, folder]);
      setCurrentFolder(folder);
    }
  };

  const handleBackClick = () => {
    if (currentFolder) {
      const newPath = [...currentPath];
      newPath.pop();
      setCurrentPath(newPath);
      setCurrentFolder(newPath.length > 0 ? newPath[newPath.length - 1] : null);
    }
  };

  const handleNavigateToPath = (index) => {
    if (index === -1) {
      setCurrentFolder(null);
      setCurrentPath([]);
    } else {
      const folder = currentPath[index];
      setCurrentFolder(folder);
      setCurrentPath(currentPath.slice(0, index + 1));
    }
  };

  const handleDownload = (item, e) => {
    e.stopPropagation();
    if (item.url) {
      window.open(BASE_URL + item.url, '_blank');
    } else {
      alert(`Downloading: ${item.name}`);
    }
  };

  const handlePreview = (item) => {
    setPreviewItem(item);
    setShowPreviewModal(true);
  };

  const content = getCurrentContent();

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
          <p className="text-gray-500">Loading content...</p>
        </div>
      </div>
    );
  }

  if (!fileSystem || (fileSystem.children.length === 0 && !currentFolder)) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4 text-sm transition"
          >
            <FaArrowLeft size={14} /> Back
          </button>
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <FaFolder size={60} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No content available for this unit standard</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-y-auto h-screen bg-gray-50">
      <div className="px-6 py-6">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4 text-sm transition"
        >
          <FaArrowLeft size={14} /> Back
        </button>

        {/* Header Card - Unit Standard Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="font-mono text-sm font-bold text-gray-800 bg-gray-100 px-2 py-1 rounded">
                  ID: {unitStandard?.unitStandardId}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${unitStandard?.type === 'CORE' ? 'bg-green-100 text-green-700' :
                    unitStandard?.type === 'FUNDAMENTAL' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                  }`}>
                  {unitStandard?.type}
                </span>
                <span className="text-xs text-gray-400">
                  {unitStandard?.programName}
                </span>
              </div>
              <h1 className="text-xl font-bold text-gray-800 mb-2">{unitStandard?.title}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">⭐ {unitStandard?.credits} credits</span>
                <span className="flex items-center gap-1">🎓 {unitStandard?.nqfLevel}</span>
                <span className="flex items-center gap-1">📚 {unitStandard?.contentCount || 0} resources</span>
              </div>
            </div>
          </div>
          {unitStandard?.description && (
            <p className="text-gray-600 text-sm mt-4 leading-relaxed">{unitStandard.description}</p>
          )}
        </div>

        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <button
            onClick={handleBackClick}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition ${currentFolder
                ? 'text-gray-600 hover:bg-gray-100'
                : 'text-gray-300 cursor-not-allowed'
              }`}
            disabled={!currentFolder}
          >
            <FaArrowLeft size={14} /> Back
          </button>

          <div className="flex items-center gap-1">
            <button
              onClick={() => handleNavigateToPath(-1)}
              className="text-gray-500 hover:text-gray-700 px-2 py-1 rounded-lg transition"
            >
              Content
            </button>
            {currentPath.map((folder, index) => (
              <span key={index} className="flex items-center gap-1">
                <FaChevronRight size={12} className="text-gray-400" />
                <button
                  onClick={() => handleNavigateToPath(index)}
                  className="text-gray-600 hover:text-gray-800 px-2 py-1 rounded-lg transition"
                >
                  {folder.name}
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {content.map((item) => (
            <div
              key={item.id}
              onClick={() => item.isFolder ? handleFolderClick(item) : null}
              className={`bg-white rounded-xl border border-gray-200 p-4 transition group ${item.isFolder ? 'cursor-pointer hover:shadow-md' : ''
                }`}
            >
              <div className="flex flex-col items-center text-center">
                {item.isFolder ? (
                  <FaFolder size={64} className="text-amber-400 group-hover:scale-105 transition" />
                ) : (
                  getFileIcon(item.type, item.name, "text-5xl")
                )}

                <p className="mt-2 text-sm font-medium text-gray-700 break-words text-center max-w-full line-clamp-2">
                  {item.name}
                </p>
                
                {item.isFolder ? (
                  <p className="text-xs text-gray-400 mt-1">{item.children?.length || 0} items</p>
                ) : (
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(item, e);
                      }}
                      className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded text-xs hover:bg-emerald-100 transition flex items-center gap-1"
                    >
                      <FaDownload size={10} /> Download
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreview(item);
                      }}
                      className="px-2 py-1 bg-amber-50 text-amber-600 rounded text-xs hover:bg-amber-100 transition flex items-center gap-1"
                    >
                      <FaEye size={10} /> Preview
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {content.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <FaFolder size={60} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">This folder is empty</p>
            <p className="text-gray-400 text-sm mt-2">No resources available yet</p>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      <Modal show={showPreviewModal} onHide={() => setShowPreviewModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title className="flex items-center gap-2">
            <FaEye className="text-blue-500" />
            Preview: {previewItem?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          
          {/* Video Player */}
          {previewItem?.type === 'VIDEO' && (
            <div className="bg-black rounded-lg overflow-hidden">
              <video 
                controls 
                autoPlay 
                className="w-full"
                style={{ maxHeight: '70vh' }}
              >
                <source src={BASE_URL + previewItem.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          {/* Audio Player */}
          {previewItem?.type === 'MP3' && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-lg text-center">
              <FaMusic size={80} className="text-purple-500 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-800 mb-2">{previewItem.name}</h4>
              <p className="text-sm text-gray-500 mb-4">{previewItem.size}</p>
              <audio controls className="w-full">
                <source src={BASE_URL + previewItem.url} type="audio/mpeg" />
                Your browser does not support the audio tag.
              </audio>
            </div>
          )}

          {/* Image Preview */}
          {previewItem?.name?.match(/\.(jpg|jpeg|png|gif|webp)$/i) && (
            <div className="bg-gray-100 rounded-lg p-4 text-center min-h-[400px] flex items-center justify-center">
              <img 
                src={BASE_URL + previewItem.url} 
                alt={previewItem.name}
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                }}
              />
            </div>
          )}

          {/* PDF Preview */}
          {previewItem?.type === 'PDF' && (
            <div className="bg-gray-100 rounded-lg p-4 min-h-[500px]">
              <iframe
                src={`${BASE_URL}${previewItem.url}`}
                className="w-full h-[70vh] border-0 rounded-lg"
                title={previewItem.name}
              />
            </div>
          )}

          {/* DOCX Preview - Google Docs Viewer */}
          {previewItem?.type === 'DOCX' && (
            <div className="bg-gray-100 rounded-lg p-4 min-h-[500px]">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                <p className="text-sm text-yellow-700">
                  📄 Word document preview. If the document doesn't load, please download to view.
                </p>
              </div>
              <iframe
                src={`https://docs.google.com/gview?url=${encodeURIComponent(BASE_URL + previewItem.url)}&embedded=true`}
                className="w-full h-[60vh] border-0 rounded-lg"
                title={previewItem.name}
              />
            </div>
          )}

          {/* XLSX Preview - Google Docs Viewer */}
          {previewItem?.type === 'XLSX' && (
            <div className="bg-gray-100 rounded-lg p-4 min-h-[500px]">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                <p className="text-sm text-yellow-700">
                  📊 Excel spreadsheet preview. If the spreadsheet doesn't load, please download to view.
                </p>
              </div>
              <iframe
                src={`https://docs.google.com/gview?url=${encodeURIComponent(BASE_URL + previewItem.url)}&embedded=true`}
                className="w-full h-[60vh] border-0 rounded-lg"
                title={previewItem.name}
              />
            </div>
          )}

          {/* PPTX Preview - Google Docs Viewer */}
          {previewItem?.type === 'PPTX' && (
            <div className="bg-gray-100 rounded-lg p-4 min-h-[500px]">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                <p className="text-sm text-yellow-700">
                  📽️ PowerPoint preview. If the presentation doesn't load, please download to view.
                </p>
              </div>
              <iframe
                src={`https://docs.google.com/gview?url=${encodeURIComponent(BASE_URL + previewItem.url)}&embedded=true`}
                className="w-full h-[60vh] border-0 rounded-lg"
                title={previewItem.name}
              />
            </div>
          )}

          {/* Link Preview */}
          {previewItem?.type === 'LINK' && (
            <div className="bg-gray-100 rounded-lg p-4 min-h-[500px]">
              <iframe
                src={previewItem.externalUrl}
                className="w-full h-[70vh] border-0 rounded-lg"
                title={previewItem.name}
              />
            </div>
          )}

          {/* Other/Unknown File Types */}
          {previewItem?.type === 'OTHER' && !previewItem?.name?.match(/\.(jpg|jpeg|png|gif|webp)$/i) && (
            <div className="bg-gray-100 rounded-lg p-8 text-center">
              <FaFileAlt size={80} className="text-gray-400 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-800 mb-2">{previewItem.name}</h4>
              <p className="text-gray-500 mb-4">{previewItem.size}</p>
              <p className="text-sm text-gray-400 mb-4">Preview not available for this file type</p>
              <Button variant="primary" onClick={() => window.open(BASE_URL + previewItem.url, '_blank')}>
                <FaDownload className="inline mr-2" /> Download
              </Button>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPreviewModal(false)}>
            Close
          </Button>
          {previewItem?.type !== 'LINK' && previewItem?.url && (
            <Button variant="primary" onClick={() => window.open(BASE_URL + previewItem.url, '_blank')}>
              <FaDownload className="inline mr-2" /> Download
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
}
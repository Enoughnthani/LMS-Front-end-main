import { FaFolder, FaFileAlt, FaArrowLeft, FaDownload, FaEye, FaFilePdf, FaFileWord, FaFileExcel, FaFilePowerpoint, FaVideo, FaExternalLinkAlt } from 'react-icons/fa';
import { useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import { ArrowLeft, ArrowRight, ChevronRight, Download, Eye, Folder, FolderOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ContentPage() {
  const [currentPath, setCurrentPath] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const navigate = useNavigate()

  // Folder structure with resources
  const fileSystem = {
    name: "Content",
    type: "root",
    children: [
      {
        id: 1,
        name: "Learner Guides",
        type: "folder",
        children: [
          { id: 11, name: "Complete Learner Guide 2026", type: "pdf", size: "2.4 MB", downloadable: true },
          { id: 12, name: "Quick Reference Handbook", type: "pdf", size: "1.1 MB", downloadable: true },
          { id: 13, name: "Assessment Guidelines", type: "docx", size: "856 KB", downloadable: true },
        ]
      },
      {
        id: 2,
        name: "Video Lectures",
        type: "folder",
        children: [
          { id: 21, name: "Introduction to React", type: "video", duration: "25:30", downloadable: false },
          { id: 22, name: "Understanding Hooks", type: "video", duration: "32:15", downloadable: false },
          { id: 23, name: "State Management Deep Dive", type: "video", duration: "45:00", downloadable: false },
        ]
      },
      {
        id: 3,
        name: "Worksheets & Exercises",
        type: "folder",
        children: [
          { id: 31, name: "Week 1 - Practice Worksheet", type: "pdf", size: "512 KB", downloadable: true },
          { id: 32, name: "React Exercises - Set 1", type: "docx", size: "1.2 MB", downloadable: true },
          { id: 33, name: "Coding Challenge Solutions", type: "pdf", size: "890 KB", downloadable: true },
        ]
      },
      {
        id: 4,
        name: "Templates & Tools",
        type: "folder",
        children: [
          { id: 41, name: "Project Proposal Template", type: "docx", size: "245 KB", downloadable: true },
          { id: 42, name: "Code Review Checklist", type: "xlsx", size: "178 KB", downloadable: true },
          { id: 43, name: "Presentation Template", type: "pptx", size: "3.1 MB", downloadable: true },
        ]
      },
      {
        id: 5,
        name: "Useful Links",
        type: "folder",
        children: [
          { id: 51, name: "Official Documentation", type: "link", url: "https://react.dev", downloadable: false },
          { id: 52, name: "Community Forum", type: "link", url: "#", downloadable: false },
          { id: 53, name: "Additional Reading List", type: "link", url: "#", downloadable: false },
        ]
      }
    ]
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf': return <FaFilePdf className="text-red-500 text-xl" />;
      case 'docx': return <FaFileWord className="text-blue-600 text-xl" />;
      case 'xlsx': return <FaFileExcel className="text-green-600 text-xl" />;
      case 'pptx': return <FaFilePowerpoint className="text-orange-600 text-xl" />;
      case 'video': return <FaVideo className="text-purple-500 text-xl" />;
      case 'link': return <FaExternalLinkAlt className="text-cyan-500 text-xl" />;
      default: return <FaFileAlt className="text-gray-500 text-xl" />;
    }
  };

  const getCurrentContent = () => {
    if (!currentFolder) {
      return fileSystem.children;
    }
    return currentFolder.children;
  };

  const handleFolderClick = (folder) => {
    setCurrentPath([...currentPath, folder.name]);
    setCurrentFolder(folder);
  };

  const handleBackClick = () => {
    if (currentFolder) {
      const newPath = [...currentPath];
      newPath.pop();
      setCurrentPath(newPath);
      setCurrentFolder(null);
    }
  };

  const handleDownload = (item, e) => {
    e.stopPropagation();
    // Simulate download
    alert(`Downloading: ${item.name}`);
  };

  const content = getCurrentContent();

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
              Course Content
            </h1>
          </div>
          <p className="text-gray-500 ml-2">Advanced React Development • All learning resources in one place</p>
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
            {currentPath.map((path, index) => (
              <span key={index} className="flex items-center gap-2">
                <ChevronRight size={19} />
                <span className="text-gray-500 font-medium">{path}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Folder/File Grid */}
        {!currentFolder ? (
          // Folder View - Grid Layout
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 gap-5">
            {content.map((folder) => (
              <div className='cursor-pointer'>
                <div
                  onClick={() => handleFolderClick(folder)}
                  className='flex items-center rounded flex-col'
                >
                  <FaFolder size={100} className='text-amber-300' />
                  <span>{folder?.name}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // File View - Modern List Layout
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
                      {/* File Icon */}
                      <div className="p-2 bg-gray-100 rounded-xl group-hover:bg-purple-100 transition">
                        {getFileIcon(item.type)}
                      </div>

                      {/* File Info */}
                      <div className="flex-1">
                        <h6 className="font-medium text-gray-800 mb-1">{item.name}</h6>
                        <div className="flex gap-3 text-xs text-gray-500">
                          {item.type === 'video' && (
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
                        <button onClick={() => window.open('https://www.wikipedia.org/', '_blank')} className="px-4 py-2 bg-cyan-50 text-cyan-600 rounded-xl text-sm font-medium hover:bg-cyan-100 transition flex items-center gap-2">
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
                            onClick={() => navigate(`preview/${item?.name}`, { state: { file: item } })}
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
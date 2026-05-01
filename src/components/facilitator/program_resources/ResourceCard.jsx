import { useState, useRef } from 'react';
import { 
  FaFolder, FaFilePdf, FaFileWord, FaFileExcel, 
  FaFilePowerpoint, FaVideo, FaFileAlt, FaEllipsisV 
} from 'react-icons/fa';
import { Overlay, Popover, Button } from 'react-bootstrap';

const getFileIcon = (type) => {
  switch (type) {
    case 'PDF': return <FaFilePdf className="text-red-500 text-4xl" />;
    case 'DOCX': return <FaFileWord className="text-blue-600 text-4xl" />;
    case 'XLSX': return <FaFileExcel className="text-green-600 text-4xl" />;
    case 'PPTX': return <FaFilePowerpoint className="text-orange-500 text-4xl" />;
    case 'VIDEO': return <FaVideo className="text-purple-500 text-4xl" />;
    default: return <FaFileAlt className="text-gray-500 text-4xl" />;
  }
};

export default function ResourceCard({ item, onOpen, onRename, onDelete }) {
  const [showMenu, setShowMenu] = useState(false);
  const targetRef = useRef(null);

  const handleDeleteClick = () => {
    setShowMenu(false);
    onDelete(item);  // This will open the confirmation modal
  };

  return (
    <div 
      className="bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition cursor-pointer border border-gray-100 relative group"
      onDoubleClick={onOpen}
    >
      {/* Icon */}
      <div className="flex justify-center pt-2 pb-3">
        {item.type === 'FOLDER' ? (
          <FaFolder size={56} className="text-amber-400" />
        ) : (
          getFileIcon(item.type)
        )}
      </div>

      {/* Name */}
      <p className="text-sm font-medium text-center truncate px-1">{item.name}</p>
      
      {/* Size for files */}
      {item.type !== 'FOLDER' && item.size && (
        <p className="text-xs text-gray-400 text-center mt-0.5">{item.size}</p>
      )}

      {/* Three dots button */}
      <button
        ref={targetRef}
        onClick={(e) => {
          e.stopPropagation();
          setShowMenu(!showMenu);
        }}
        className="absolute top-2 right-2 bg-transparent"
      >
        <FaEllipsisV className='text-gray-500' size={14} />
      </button>

      {/* Overlay Menu */}
      <Overlay
        target={targetRef.current}
        show={showMenu}
        placement="auto"
        rootClose
        onHide={() => setShowMenu(false)}
      >
        <Popover className="shadow-sm">
          <Popover.Body className="p-1">
            <div className="d-flex flex-column gap-1">
              <Button 
                size="sm" 
                variant="link" 
                className="text-start text-decoration-none"
                onClick={() => {
                  setShowMenu(false);
                  onRename(item);
                }}
              >
                ✏️ Rename
              </Button>
              <Button 
                size="sm" 
                variant="link" 
                className="text-start text-danger text-decoration-none"
                onClick={handleDeleteClick}
              >
                🗑️ Delete
              </Button>
            </div>
          </Popover.Body>
        </Popover>
      </Overlay>
    </div>
  );
}
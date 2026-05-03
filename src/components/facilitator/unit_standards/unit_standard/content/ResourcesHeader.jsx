import { FaPlus, FaFolder, FaUpload } from 'react-icons/fa';
import { Button } from 'react-bootstrap';

export default function ResourcesHeader({ onNewFolder, onUpload }) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Program Content</h2>
          <p className="text-sm text-gray-500 mt-0.5">Manage folders and learning materials</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={onNewFolder}
            variant="outline-primary"
            className="flex items-center gap-2"
          >
            <FaFolder size={14} /> New Folder
          </Button>
          <Button 
            onClick={onUpload}
            variant="primary"
            className="flex items-center gap-2"
          >
            <FaUpload size={14} /> Upload Files
          </Button>
        </div>
      </div>
    </div>
  );
}
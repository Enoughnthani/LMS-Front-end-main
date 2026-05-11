import { FaCalendarAlt, FaStar, FaUsers, FaEdit, FaTrash, FaEye, FaDownload, FaFilePdf, FaFileWord, FaFileAlt } from 'react-icons/fa';
import { BASE_URL } from '@/utils/apiEndpoint';
import { useNavigate } from 'react-router-dom';

const getStatusBadge = (status) => {
  if (status === 'PUBLISHED') {
    return <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-green-100 text-green-700">PUBLISHED</span>;
  }
  return <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-amber-100 text-amber-700">DRAFT</span>;
};

const getFileIcon = (fileName) => {
  if (!fileName) return null;
  const ext = fileName.split('.').pop().toLowerCase();
  if (ext === 'pdf') return <FaFilePdf className="text-red-500" />;
  if (ext === 'docx' || ext === 'doc') return <FaFileWord className="text-blue-500" />;
  return <FaFileAlt className="text-gray-500" />;
};

export default function AssessmentCard({ item, onEdit, onViewSubmissions, onDelete }) {

  const navigate = useNavigate()

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition">
      <div className="flex justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-gray-800">{item.title}</h3>
            {getStatusBadge(item.status)}
          </div>
          <p className="text-sm text-gray-500 mb-2">{item.description}</p>
          
          <div className="flex flex-wrap gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <FaCalendarAlt size={10} /> Due: {new Date(item.dueDate).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <FaStar size={10} /> {item.totalMarks} marks
            </span>
            <span className="flex items-center gap-1">
              <FaUsers size={10} /> {item.submissions?.length || 0} / {item.totalLearners} submitted
            </span>
          </div>

          {/* File Section */}
          {item.fileUrl && (
            <div className="mt-3 flex items-center gap-2 p-2 bg-gray-50 rounded-lg w-fit">
              {getFileIcon(item.fileName)}
              <span className="text-sm text-gray-600">{item.fileName}</span>
              <button 
                onClick={() => window.open(BASE_URL + item.fileUrl, '_blank')}
                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
              >
                <FaDownload size={12} />
              </button>
            </div>
          )}
        </div>

        <div className="flex gap-1 ml-4">
          <button 
            onClick={()=>navigate(`${item?.id}`)}
            className="p-2 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-blue-50"
            title="View Submissions"
          >
            <FaEye size={16} />
          </button>
          <button 
            onClick={onEdit}
            className="p-2 text-gray-500 hover:text-amber-600 rounded-lg hover:bg-amber-50"
            title="Edit"
          >
            <FaEdit size={16} />
          </button>
          <button 
            onClick={onDelete}
            className="p-2 text-gray-500 hover:text-red-600 rounded-lg hover:bg-red-50"
            title="Delete"
          >
            <FaTrash size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, FaDownload, FaCalendarAlt, FaStar, FaFilePdf, 
  FaFileWord, FaFileAlt, FaUsers, FaEye, FaSpinner, FaCheckCircle,
  FaClock, FaUserCheck, FaDownload as FaDownloadIcon, FaFile
} from 'react-icons/fa';
import { Tab, Tabs, Badge } from 'react-bootstrap';
import { assessmentService } from './services/assessmentService';
import { BASE_URL } from '@/utils/apiEndpoint';

export default function AssessmentViewPage() {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAssessment();
  }, [assessmentId]);

  const loadAssessment = async () => {
    setLoading(true);
    try {
      const response = await assessmentService.getAssessmentById(assessmentId);
      const data = response?.payload || response;
      setAssessment(data);
      // Extract submissions from assessmentSubmissionDTO
      if (data?.assessmentSubmissionDTO) {
        setSubmissions(data.assessmentSubmissionDTO);
      } else {
        // Fallback to separate API call if needed
        await loadSubmissions();
      }
    } catch (err) {
      setError('Failed to load assessment');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadSubmissions = async () => {
    try {
      const response = await assessmentService.getSubmissions(assessmentId);
      const data = response?.payload || response || [];
      setSubmissions(data);
    } catch (err) {
      console.error('Error loading submissions:', err);
    }
  };

  const getFileIcon = (fileName) => {
    if (!fileName) return <FaFileAlt className="text-gray-400 text-lg" />;
    const ext = fileName.split('.').pop().toLowerCase();
    if (ext === 'pdf') return <FaFilePdf className="text-red-500 text-lg" />;
    if (ext === 'docx' || ext === 'doc') return <FaFileWord className="text-blue-500 text-lg" />;
    return <FaFileAlt className="text-gray-500 text-lg" />;
  };

  const getStatusBadge = (status) => {
    if (status === 'GRADED') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
          <FaCheckCircle size={10} /> Graded
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
        <FaClock size={10} /> Pending
      </span>
    );
  };

  const handleDownloadAssessment = () => {
    if (assessment?.fileUrl && assessment?.fileName) {
      assessmentService.downloadAssessmentFile(assessment.fileUrl, assessment.fileName);
    } else if (assessment?.fileUrl) {
      assessmentService.downloadAssessmentFile(assessment.fileUrl, assessment.fileName || 'assessment');
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50">
        <FaSpinner className="text-gray-400 text-3xl animate-spin" />
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FaFileAlt className="text-gray-300 text-5xl mx-auto mb-3" />
          <p className="text-gray-500">Assessment not found</p>
          <button onClick={() => navigate(-1)} className="mt-3 text-blue-600 hover:text-blue-700">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4 text-sm transition"
        >
          <FaArrowLeft size={14} /> Back
        </button>

        {/* Assessment Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                  {assessment.type === 'LEARNER_WORKBOOK' ? 'Learner Workbook' : 'Summative Assessment'}
                </span>
                <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                  <FaUsers className="inline mr-1" size={10} /> {submissions.length} Submissions
                </span>
              </div>
              <h1 className="text-xl font-bold text-gray-800 mb-2">{assessment.title}</h1>
              <p className="text-gray-600 text-sm mb-3">{assessment.description}</p>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <FaCalendarAlt size={12} /> 
                  Due: {assessment.dueDate ? new Date(assessment.dueDate).toLocaleDateString() : 'Not set'}
                </span>
                <span className="flex items-center gap-1.5">
                  <FaStar size={12} className="text-amber-400" />
                  {assessment.totalMarks} marks
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-6 border-b border-gray-200"
        >
          <Tab eventKey="overview" title={
            <span className="flex items-center gap-2">
              <FaFile size={14} /> Assessment Document
            </span>
          }>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              {assessment.fileUrl ? (
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getFileIcon(assessment.fileName)}
                    <div>
                      <p className="font-medium text-gray-800">{assessment.fileName || 'Assessment File'}</p>
                      <p className="text-xs text-gray-400">Assessment file</p>
                    </div>
                  </div>
                  <button
                    onClick={handleDownloadAssessment}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition flex items-center gap-2"
                  >
                    <FaDownloadIcon size={14} /> Download Assessment
                  </button>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <FaFileAlt className="text-4xl mx-auto mb-2" />
                  <p>No assessment file available</p>
                </div>
              )}
            </div>
          </Tab>

          <Tab eventKey="submissions" title={
            <span className="flex items-center gap-2">
              <FaUsers size={14} /> Submissions
              {submissions.length > 0 && (
                <Badge pill bg="secondary" className="ms-1">
                  {submissions.length}
                </Badge>
              )}
            </span>
          }>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {submissions.length === 0 ? (
                <div className="text-center py-12">
                  <FaUsers className="text-gray-300 text-5xl mx-auto mb-3" />
                  <p className="text-gray-500">No submissions yet</p>
                  <p className="text-sm text-gray-400">Learners haven't submitted this assessment</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Learner</th>
                        <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Submitted File</th>
                        <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Submitted Date</th>
                        <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {submissions.map((submission) => (
                        <tr key={submission.id} className="hover:bg-gray-50 transition">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <FaUserCheck className="text-blue-500 text-sm" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-800">
                                  {submission.firstname} {submission.lastname}
                                </p>
                                <p className="text-xs text-gray-400">{submission.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              {getFileIcon(submission.fileName)}
                              <span className="text-sm text-gray-600 truncate max-w-[200px]">
                                {submission.fileName}
                              </span>
                            </div>
                          </td>
                          <td className="p-4 text-sm text-gray-600">
                            {new Date(submission.submittedAt).toLocaleString()}
                          </td>
                          <td className="p-4">
                            {getStatusBadge(submission.status)}
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => window.open(BASE_URL + submission.fileUrl, '_blank')}
                                className="px-3 py-1.5 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-600 rounded-lg text-sm transition flex items-center gap-1"
                                title="Preview Submission"
                              >
                                <FaEye size={14} /> Preview
                              </button>
                              <button
                                onClick={() => window.open(BASE_URL + submission.fileUrl, '_blank')}
                                className="px-3 py-1.5 bg-gray-100 hover:bg-emerald-100 text-gray-700 hover:text-emerald-600 rounded-lg text-sm transition flex items-center gap-1"
                                title="Download Submission"
                              >
                                <FaDownloadIcon size={14} /> Download
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
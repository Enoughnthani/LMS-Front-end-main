import { BASE_URL } from '@/utils/apiEndpoint';
import { format, isAfter, isBefore, parseISO } from 'date-fns';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AssessmentPreview from './AssessmentPreview';
import { assessmentService } from './services/assessmentService';

export default function AssessmentViewPage() {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState(null);
  const [statistics, setStatistics] = useState({
    totalSubmissions: 0,
    gradedCount: 0,
    pendingCount: 0,
    reSubmittedCount: 0,
    averageScore: 0,
    passRate: 0
  });

  useEffect(() => {
    loadAssessment();
    loadSubmissions();
  }, [assessmentId]);

  const loadAssessment = async () => {
    setLoading(true);
    try {
      const response = await assessmentService.getAssessmentById(assessmentId);
      const data = response?.payload || response;
      setAssessment(data);
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
      calculateStatistics(data);
    } catch (err) {
      console.error('Error loading submissions:', err);
    }
  };

  const calculateStatistics = (submissionsData) => {
    const total = submissionsData.length;
    const graded = submissionsData.filter(s => s.status === 'GRADED').length;
    const pending = submissionsData.filter(s => s.status === 'SUBMITTED').length;
    const reSubmitted = submissionsData.filter(s => s.status === 'RE_SUBMITTED').length;

    const scores = submissionsData
      .filter(s => s.score != null)
      .map(s => (s.score / (assessment?.totalMarks || 1)) * 100);

    const averageScore = scores.length > 0
      ? scores.reduce((a, b) => a + b, 0) / scores.length
      : 0;

    const passed = scores.filter(score => score >= 50).length;
    const passRate = scores.length > 0 ? (passed / scores.length) * 100 : 0;

    setStatistics({
      totalSubmissions: total,
      gradedCount: graded,
      pendingCount: pending,
      reSubmittedCount: reSubmitted,
      averageScore: averageScore.toFixed(1),
      passRate: passRate.toFixed(1)
    });
  };

  const validateDates = (startDate, dueDate) => {
    const errors = {};

    if (startDate && dueDate) {
      const start = new Date(startDate);
      const due = new Date(dueDate);

      if (isAfter(start, due)) {
        errors.dates = 'Start date cannot be after due date';
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (isBefore(start, today)) {
        errors.startDate = 'Start date cannot be in the past';
      }

      if (isBefore(due, today)) {
        errors.dueDate = 'Due date cannot be in the past';
      }
    }

    return errors;
  };

  const handleUpdateAssessment = async () => {
    setEditLoading(true);
    setValidationErrors({});

    const dateErrors = validateDates(editingAssessment.startDate, editingAssessment.dueDate);
    if (Object.keys(dateErrors).length > 0) {
      setValidationErrors(dateErrors);
      setEditLoading(false);
      return;
    }

    try {
      const response = await assessmentService.updateAssessment(assessmentId, editingAssessment);
      if (response?.success) {
        setShowEditModal(false);
        await loadAssessment();
        alert('Assessment updated successfully');
      } else {
        setValidationErrors({ submit: response?.message || 'Failed to update assessment' });
      }
    } catch (err) {
      console.error('Error updating assessment:', err);
      setValidationErrors({ submit: err.message || 'An error occurred while updating' });
    } finally {
      setEditLoading(false);
    }
  };

  const getFileIcon = (fileName) => {
    if (!fileName) return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
      </svg>
    );
    const ext = fileName.split('.').pop().toLowerCase();
    if (ext === 'pdf') return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-red-500">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
      </svg>
    );
    if (ext === 'docx' || ext === 'doc') return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-blue-500">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
      </svg>
    );
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-500">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
      </svg>
    );
  };

  const getStatusBadge = (status) => {
    const config = {
      SUBMITTED: { label: "Submitted", color: "bg-sky-50 text-sky-700 border-sky-200" },
      GRADED: { label: "Graded", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
      RE_SUBMITTED: { label: "Re-Submitted", color: "bg-amber-50 text-amber-700 border-amber-200" },
      DEFAULT: { label: "Pending", color: "bg-gray-50 text-gray-600 border-gray-200" }
    };

    const { label, color } = config[status] || config.DEFAULT;

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${color}`}>
        {status === 'GRADED' ? (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 13l4 4L19 7" />
          </svg>
        ) : status === 'RE_SUBMITTED' ? (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M1 4v6h6M23 20v-6h-6" />
            <path d="M20.49 9A9 9 0 005.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 013.51 15" />
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
        )}
        {label}
      </span>
    );
  };

  const getAssessmentStatus = () => {
    if (!assessment) return null;

    const now = new Date();
    const startDate = assessment.startDate ? new Date(assessment.startDate) : null;
    const dueDate = assessment.dueDate ? new Date(assessment.dueDate) : null;

    if (dueDate && isBefore(dueDate, now)) {
      return { status: 'closed', label: 'Closed', color: 'bg-red-50 text-red-700 border-red-200' };
    }
    if (startDate && isAfter(startDate, now)) {
      return { status: 'upcoming', label: 'Upcoming', color: 'bg-amber-50 text-amber-700 border-amber-200' };
    }
    return { status: 'open', label: 'Open', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  };

  const handleDownloadAssessment = () => {
    if (assessment?.fileUrl) {
      assessmentService.downloadAssessmentFile(assessment.fileUrl, assessment.fileName || 'assessment');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-slate-800 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
            </svg>
          </div>
          <p className="text-gray-500 mb-4">Assessment not found</p>
          <button 
            onClick={() => navigate(-1)} 
            className="px-4 py-2 bg-slate-800 text-white rounded-md text-sm font-medium hover:bg-slate-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const assessmentStatus = getAssessmentStatus();

  return (
    <div className="overflow-y-auto h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {/* Assessment Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-md">
                  {assessment.type === 'TEST' ? 'Test' : assessment.type || 'Assessment'}
                </span>
                {assessmentStatus && (
                  <span className={`px-2.5 py-0.5 text-xs font-medium rounded-md border ${assessmentStatus.color}`}>
                    {assessmentStatus.label}
                  </span>
                )}
                <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-xs font-medium rounded-md">
                  {statistics.totalSubmissions} Submissions
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2 break-words">{assessment.title}</h1>
              <p className="text-gray-600 text-sm mb-4 break-words">{assessment.description || 'No description provided'}</p>

              <div className="flex flex-wrap gap-2 text-sm">
                {assessment.startDate && (
                  <span className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs font-medium">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <path d="M16 2v4M8 2v4M3 10h18" />
                    </svg>
                    Starts: {format(parseISO(assessment.startDate), 'PPP')}
                  </span>
                )}

                {assessment.dueDate && (
                  <span className="flex items-center gap-1.5 px-2 py-1 bg-red-50 text-red-700 rounded-md text-xs font-medium">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <path d="M16 2v4M8 2v4M3 10h18" />
                    </svg>
                    Due: {format(parseISO(assessment.dueDate), 'PPP')}
                  </span>
                )}

                <span className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 text-amber-700 rounded-md text-xs font-medium">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  Total Marks: {assessment.totalMarks}
                </span>

                {assessment.unitStandardTitle && (
                  <span className="flex items-center gap-1.5 px-2 py-1 bg-purple-50 text-purple-700 rounded-md text-xs font-medium">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="8" r="7" />
                      <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" />
                    </svg>
                    Unit Standard: {assessment.unitStandardTitle}
                  </span>
                )}

                {assessment?.fileUrl && (
                  <span className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs">
                    {getFileIcon(assessment.fileName)}
                    <button
                      className="text-slate-700 font-medium underline hover:text-slate-900"
                      onClick={() => window.open(BASE_URL + assessment.fileUrl, "_blank")}
                    >
                      {assessment.fileName || "Assessment File"}
                    </button>
                    <span className="text-gray-400">
                      ({(assessment.fileSize / 1024).toFixed(1)} KB)
                    </span>
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => navigate('edit')}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm font-medium flex items-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Edit
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        {statistics.totalSubmissions > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Total Submissions</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{statistics.totalSubmissions}</p>
                </div>
                <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-500">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Graded</p>
                  <p className="text-2xl font-bold text-emerald-600 mt-1">{statistics.gradedCount}</p>
                </div>
                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-emerald-500">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                    <path d="M22 4L12 14.01l-3-3" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Average Score</p>
                  <p className="text-2xl font-bold text-slate-700 mt-1">{statistics.averageScore}%</p>
                </div>
                <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-500">
                    <path d="M18 20V10M12 20V4M6 20v-6" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Pass Rate</p>
                  <p className="text-2xl font-bold text-amber-600 mt-1">{statistics.passRate}%</p>
                </div>
                <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-amber-500">
                    <circle cx="12" cy="8" r="7" />
                    <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Custom Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <div className="flex gap-1">
              {assessment?.questions?.length > 0 && (
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-4 py-3 text-sm font-medium border-b-2 flex items-center gap-2 ${
                    activeTab === 'overview'
                      ? 'border-slate-800 text-slate-800'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
                  </svg>
                  Assessment
                </button>
              )}
              <button
                onClick={() => setActiveTab('submissions')}
                className={`px-4 py-3 text-sm font-medium border-b-2 flex items-center gap-2 ${
                  activeTab === 'submissions'
                    ? 'border-slate-800 text-slate-800'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                </svg>
                Submissions
                {submissions.length > 0 && (
                  <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md">
                    {submissions.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {activeTab === 'overview' && assessment?.questions?.length > 0 && (
              <AssessmentPreview assessmentInfo={assessment} questions={assessment?.questions} />
            )}

            {activeTab === 'submissions' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {submissions.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-300">
                        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                      </svg>
                    </div>
                    <p className="text-gray-500 font-medium">No submissions yet</p>
                    <p className="text-sm text-gray-400 mt-1">Learners haven't submitted this assessment</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Learner</th>
                          <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Submitted File</th>
                          <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Submitted Date</th>
                          <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                          <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Score</th>
                          <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {submissions.map((submission) => (
                          <tr key={submission.id} className="hover:bg-gray-50">
                            <td className="p-4">
                              <div>
                                <p className="font-medium text-gray-900 text-sm">
                                  {submission.firstname} {submission.lastname}
                                </p>
                                <p className="text-xs text-gray-400">{submission.email}</p>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2 min-w-0">
                                {getFileIcon(submission.fileName)}
                                <span className="text-sm text-gray-600 truncate max-w-[150px]">
                                  {submission.fileName}
                                </span>
                              </div>
                            </td>
                            <td className="p-4 text-sm text-gray-600 whitespace-nowrap">
                              {format(parseISO(submission.submittedAt), 'PPP p')}
                            </td>
                            <td className="p-4">
                              {getStatusBadge(submission.status)}
                            </td>
                            <td className="p-4">
                              {submission.score ? (
                                <span className="font-medium text-gray-900 text-sm">
                                  {submission.score}/{assessment.totalMarks}
                                </span>
                              ) : (
                                <span className="text-gray-400 text-sm">Not graded</span>
                              )}
                            </td>
                            <td className="p-4">
                              <div className="flex gap-2 flex-wrap">
                                <button
                                  onClick={() => window.open(BASE_URL + submission.fileUrl, '_blank')}
                                  className="px-3 py-1.5 bg-sky-50 text-sky-700 rounded-md text-xs font-medium border border-sky-200 hover:bg-sky-100 flex items-center gap-1"
                                >
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                    <circle cx="12" cy="12" r="3" />
                                  </svg>
                                  Preview
                                </button>
                                <button
                                  onClick={() => window.open(BASE_URL + submission.fileUrl, '_blank')}
                                  className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-md text-xs font-medium border border-emerald-200 hover:bg-emerald-100 flex items-center gap-1"
                                >
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                                  </svg>
                                  Download
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
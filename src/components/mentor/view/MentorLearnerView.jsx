import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  FileText,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  MessageSquare,
  ChevronRight,
  AlertCircle,
  Award,
  BookOpen
} from "lucide-react";

export default function MentorLearnerView() {
  const location = useLocation();
  const navigate = useNavigate();
  const [intern, setIntern] = useState(location?.state?.intern || null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [accuracyRating, setAccuracyRating] = useState(null);

  if (!intern) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-gray-200">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-10 w-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Intern Data</h2>
          <p className="text-gray-500 mb-6">Intern information is not available.</p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const styles = {
      APPROVED: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", icon: CheckCircle },
      PENDING: { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200", icon: Clock },
      NEEDS_REVISION: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", icon: AlertCircle },
      NOT_SUBMITTED: { bg: "bg-gray-50", text: "text-gray-600", border: "border-gray-200", icon: XCircle }
    };
    return styles[status] || styles.PENDING;
  };

  const handleDownloadPDF = (report) => {
    // Implement PDF download logic
    console.log("Downloading PDF:", report.pdfUrl);
    // window.open(report.pdfUrl, '_blank');
  };

  const handleViewPDF = (report) => {
    // Implement PDF view logic
    console.log("Viewing PDF:", report.pdfUrl);
    // window.open(report.pdfUrl, '_blank');
  };

  const handleGiveFeedback = (report) => {
    setSelectedReport(report);
    setFeedbackText(report.feedback || "");
    setAccuracyRating(report.score || null);
    setShowFeedbackModal(true);
  };

  const handleSubmitFeedback = () => {
    if (!accuracyRating || !feedbackText.trim()) return;
    
    // Update the report with feedback
    const updatedReports = intern.reports.map(report => 
      report.id === selectedReport.id 
        ? { 
            ...report, 
            score: accuracyRating, 
            feedback: feedbackText, 
            status: "APPROVED" 
          }
        : report
    );
    
    setIntern({ ...intern, reports: updatedReports });
    setShowFeedbackModal(false);
    setSelectedReport(null);
    setFeedbackText("");
    setAccuracyRating(null);
  };

  const completedReports = intern.reports?.filter(r => r.status === "APPROVED").length || 0;
  const pendingReports = intern.reports?.filter(r => r.status === "PENDING").length || 0;
  const averageScore = intern.reports?.filter(r => r.score).reduce((acc, r) => acc + r.score, 0) / completedReports || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Intern Details</h1>
              <p className="text-gray-500 text-sm mt-1">View and manage intern reports</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
              intern.status === "ACTIVE" 
                ? "bg-green-50 text-green-700 border-green-200" 
                : "bg-gray-50 text-gray-600 border-gray-200"
            }`}>
              {intern.status}
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar - Intern Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden sticky top-20">
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-8 text-center">
                <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-gray-900 text-3xl font-bold mx-auto mb-4 shadow-lg">
                  {intern.firstname?.[0]}{intern.lastname?.[0]}
                </div>
                <h2 className="text-xl font-bold text-white">
                  {intern.firstname} {intern.lastname}
                </h2>
                <p className="text-gray-300 text-sm mt-1">Intern</p>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-700">{intern.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-700">{intern.contactNumber}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-700">Enrolled: {new Date(intern.enrollmentDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Performance Summary</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-gray-900">{completedReports}</p>
                      <p className="text-xs text-gray-500">Completed</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-gray-900">{pendingReports}</p>
                      <p className="text-xs text-gray-500">Pending</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-center col-span-2">
                      <p className="text-2xl font-bold text-gray-900">{averageScore.toFixed(1)}%</p>
                      <p className="text-xs text-gray-500">Average Score</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Reports List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-gray-600" />
                  Intern Reports
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {intern.reports?.length || 0} reports submitted
                </p>
              </div>

              <div className="divide-y divide-gray-100">
                {intern.reports?.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">No reports found</h3>
                    <p className="text-gray-500">This intern hasn't submitted any reports yet.</p>
                  </div>
                ) : (
                  intern.reports?.map((report) => {
                    const StatusIcon = getStatusBadge(report.status).icon;
                    const statusStyle = getStatusBadge(report.status);
                    
                    return (
                      <div key={report.id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                                <StatusIcon size={12} />
                                {report.status}
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm mb-3">{report.description}</p>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1.5">
                                <Calendar size={14} />
                                Due: {new Date(report.dueDate).toLocaleDateString()}
                              </span>
                              {report.submittedDate && (
                                <span className="flex items-center gap-1.5">
                                  <Clock size={14} />
                                  Submitted: {new Date(report.submittedDate).toLocaleDateString()}
                                </span>
                              )}
                              {report.fileSize && (
                                <span className="flex items-center gap-1.5">
                                  <FileText size={14} />
                                  {report.fileSize}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {report.score && (
                          <div className="mb-4 p-3 bg-gray-50 rounded-lg inline-flex items-center gap-2">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium text-gray-900">Score: {report.score}%</span>
                          </div>
                        )}

                        {report.feedback && (
                          <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <div className="flex items-center gap-2 mb-2">
                              <MessageSquare className="h-4 w-4 text-blue-600" />
                              <span className="text-sm font-semibold text-blue-900">Previous Feedback</span>
                            </div>
                            <p className="text-sm text-blue-800">{report.feedback}</p>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-3">
                          {report.pdfUrl && (
                            <>
                              <button
                                onClick={() => handleViewPDF(report)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition font-medium text-sm"
                              >
                                <Eye size={16} />
                                View PDF
                              </button>
                              <button
                                onClick={() => handleDownloadPDF(report)}
                                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium text-sm"
                              >
                                <Download size={16} />
                                Download
                              </button>
                            </>
                          )}
                          {report.status !== "APPROVED" && report.submittedDate && (
                            <button
                              onClick={() => handleGiveFeedback(report)}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium text-sm"
                            >
                              <MessageSquare size={16} />
                              Give Feedback
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Overall Progress Card */}
            {intern.reports?.length > 0 && (
              <div className="mt-6 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5 text-gray-600" />
                  Overall Progress
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Completion Rate</span>
                    <span className="font-semibold text-gray-900">
                      {Math.round((completedReports / intern.reports.length) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-full rounded-full transition-all"
                      style={{ width: `${(completedReports / intern.reports.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Provide Feedback</h2>
                <p className="text-sm text-gray-500 mt-1">{selectedReport.title}</p>
              </div>
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* PDF Preview */}
              {selectedReport.pdfUrl && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Submission</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{selectedReport.fileName}</p>
                          <p className="text-xs text-gray-500">{selectedReport.fileSize}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleViewPDF(selectedReport)}
                        className="px-3 py-1.5 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                      >
                        View PDF
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Accuracy Rating */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Accuracy Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setAccuracyRating(rating)}
                      className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                        accuracyRating === rating
                          ? "bg-gray-900 text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
              </div>

              {/* Feedback Text */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Feedback Comments
                </label>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="Provide detailed feedback on the submission. What was done well? What needs improvement?"
                />
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex gap-3">
              <button
                onClick={handleSubmitFeedback}
                disabled={!accuracyRating || !feedbackText.trim()}
                className="flex-1 bg-gray-900 text-white py-2.5 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                Submit Feedback
              </button>
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
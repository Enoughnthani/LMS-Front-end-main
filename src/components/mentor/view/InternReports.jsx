import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Card, Badge, Modal, Form } from 'react-bootstrap';
import { 
  FaArrowLeft, FaCalendarAlt, FaClock, FaCheckCircle, 
  FaTimesCircle, FaComment, FaEye, FaDownload, FaStar,
  FaThumbsUp, FaThumbsDown, FaPaperPlane, FaFileAlt
} from 'react-icons/fa';

export default function InternReports() {
  const location = useLocation();
  const navigate = useNavigate();
  const { intern } = location.state || {};
  const [selectedReport, setSelectedReport] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [rating, setRating] = useState(0);
  
  const [reports, setReports] = useState([
    {
      id: 1,
      title: "January Progress Report",
      month: "January 2026",
      submittedDate: "2026-01-28",
      submittedTime: "14:30",
      status: "approved",
      content: "Completed onboarding, learned React basics, built first component...",
      attachments: ["jan_report.pdf"],
      feedback: "Great start! Keep up the momentum.",
      rating: 4
    },
    {
      id: 2,
      title: "February Progress Report",
      month: "February 2026",
      submittedDate: "2026-02-25",
      submittedTime: "10:15",
      status: "pending",
      content: "Worked on hooks, state management, completed 3 projects...",
      attachments: ["feb_report.docx"],
      feedback: null,
      rating: null
    },
    {
      id: 3,
      title: "March Progress Report",
      month: "March 2026",
      submittedDate: "2026-03-28",
      submittedTime: "16:20",
      status: "rejected",
      content: "API integration, testing, deployment setup...",
      attachments: ["mar_report.pdf"],
      feedback: "Please add more details about challenges faced.",
      rating: 2.5
    }
  ]);

  if (!intern) {
    return (
      <div className="flex-1 bg-gray-50 p-5">
        <div className="text-center py-8">
          <p className="text-gray-500">No intern selected</p>
          <Button variant="primary" size="sm" onClick={() => navigate('/user/mentor/interns')}>
            Back to Interns
          </Button>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch(status) {
      case 'approved':
        return <Badge bg="success" className="px-2 py-1">Approved</Badge>;
      case 'rejected':
        return <Badge bg="danger" className="px-2 py-1">Rejected</Badge>;
      default:
        return <Badge bg="warning" className="px-2 py-1 text-dark">Pending</Badge>;
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'approved':
        return <FaCheckCircle className="text-success" />;
      case 'rejected':
        return <FaTimesCircle className="text-danger" />;
      default:
        return <FaClock className="text-warning" />;
    }
  };

  const handleApprove = (report) => {
    setSelectedReport(report);
    setRating(0);
    setFeedbackText('');
    setShowFeedbackModal(true);
  };

  const handleReject = (report) => {
    setSelectedReport(report);
    setRating(0);
    setFeedbackText('');
    setShowFeedbackModal(true);
  };

  const submitFeedback = () => {
    if (!feedbackText.trim()) {
      alert('Please provide feedback');
      return;
    }

    const updatedReports = reports.map(report => {
      if (report.id === selectedReport.id) {
        return {
          ...report,
          status: rating >= 3 ? 'approved' : 'rejected',
          feedback: feedbackText,
          rating: rating
        };
      }
      return report;
    });

    setReports(updatedReports);
    setShowFeedbackModal(false);
    setFeedbackText('');
    setRating(0);
    setSelectedReport(null);
  };

  const handleDownload = (attachment) => {
    alert(`Downloading: ${attachment}`);
  };

  const stats = {
    total: reports.length,
    approved: reports.filter(r => r.status === 'approved').length,
    pending: reports.filter(r => r.status === 'pending').length,
    rejected: reports.filter(r => r.status === 'rejected').length
  };

  return (
    <div className="h-screen flex-1 bg-gray-50 p-5 overflow-y-auto">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-5">
          <button
            onClick={() => navigate('/user/mentor/interns')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-3 text-sm"
          >
            <FaArrowLeft size={14} /> Back to Interns
          </button>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-1">{intern.name}</h2>
            <p className="text-gray-500 text-sm">{intern.email}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-3">
              <p className="text-gray-500 text-xs mb-0">Total Reports</p>
              <h4 className="text-xl font-bold text-gray-800 mb-0">{stats.total}</h4>
            </Card.Body>
          </Card>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-3">
              <p className="text-gray-500 text-xs mb-0">Approved</p>
              <h4 className="text-xl font-bold text-green-600 mb-0">{stats.approved}</h4>
            </Card.Body>
          </Card>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-3">
              <p className="text-gray-500 text-xs mb-0">Pending</p>
              <h4 className="text-xl font-bold text-orange-500 mb-0">{stats.pending}</h4>
            </Card.Body>
          </Card>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-3">
              <p className="text-gray-500 text-xs mb-0">Rejected</p>
              <h4 className="text-xl font-bold text-red-600 mb-0">{stats.rejected}</h4>
            </Card.Body>
          </Card>
        </div>

        {/* Reports List */}
        <div className="space-y-3">
          {reports.map((report) => (
            <Card key={report.id} className="border-0 shadow-sm">
              <Card.Body className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(report.status)}
                      {getStatusBadge(report.status)}
                    </div>
                    <h5 className="font-semibold text-gray-800 mb-1">{report.title}</h5>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                      <span className="flex items-center gap-1">
                        <FaCalendarAlt size={10} /> {report.month}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaClock size={10} /> Submitted: {report.submittedDate}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{report.content}</p>
                    
                    {report.feedback && (
                      <div className="bg-gray-50 rounded p-2 mt-2">
                        <div className="flex items-center gap-1 mb-1">
                          <FaComment size={12} className="text-gray-500" />
                          <span className="text-xs font-medium text-gray-600">Feedback:</span>
                        </div>
                        <p className="text-xs text-gray-600 mb-0">{report.feedback}</p>
                        {report.rating > 0 && (
                          <div className="flex items-center gap-0.5 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <FaStar key={i} size={12} className={i < Math.floor(report.rating) ? 'text-warning' : 'text-gray-300'} />
                            ))}
                            <span className="text-xs text-gray-500 ml-1">({report.rating})</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Attachments */}
                    {report.attachments && report.attachments.length > 0 && (
                      <div className="flex gap-2 mt-2">
                        {report.attachments.map((att, idx) => (
                          <Button
                            key={idx}
                            variant="link"
                            size="sm"
                            onClick={() => handleDownload(att)}
                            className="text-blue-600 p-0 text-xs"
                          >
                            <FaDownload size={10} className="inline mr-1" /> {att}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {report.status === 'pending' && (
                    <div className="flex gap-2 ml-4">
                      <Button 
                        variant="success" 
                        size="sm"
                        onClick={() => handleApprove(report)}
                        className="flex items-center gap-1 px-3"
                      >
                        <FaThumbsUp size={12} /> Approve
                      </Button>
                      <Button 
                        variant="danger" 
                        size="sm"
                        onClick={() => handleReject(report)}
                        className="flex items-center gap-1 px-3"
                      >
                        <FaThumbsDown size={12} /> Reject
                      </Button>
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>

      {/* Feedback Modal */}
      <Modal show={showFeedbackModal} onHide={() => setShowFeedbackModal(false)} size="md">
        <Modal.Header closeButton>
          <Modal.Title className="text-base">Review Report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="text-sm">Rating</Form.Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    size={24}
                    className={`cursor-pointer ${star <= rating ? 'text-warning' : 'text-gray-300'}`}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="text-sm">Feedback</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Provide feedback..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={() => setShowFeedbackModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={submitFeedback}>
            <FaPaperPlane size={12} className="me-1" /> Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
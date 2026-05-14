import { useState, useEffect } from 'react';
import { Accordion, Badge, Button, Spinner } from 'react-bootstrap';
import { FaClipboardList, FaFlask, FaChartLine, FaGraduationCap, FaCalendarAlt, FaCheckCircle, FaRegCircle, FaStar, FaClock, FaEye } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { assessmentService } from '@/components/facilitator/unit_standards/unit_standard/assessment/services/AssessmentService';

export default function LearnerAssessmentPage() {
  const navigate = useNavigate();
  const { unitStandardId } = useParams();
  const [assessments, setAssessments] = useState({
    learnerWorkbooks: [],
    summative: [],
    exams: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAssessments();
  }, [unitStandardId]);

  const loadAssessments = async () => {
    setLoading(true);
    try {
      const response = await assessmentService.getAssessments(unitStandardId);
      const data = response?.payload || response || [];
      
      const grouped = {
        learnerWorkbooks: data.filter(a => a.type === 'LEARNER_WORKBOOK'),
        summative: data.filter(a => a.type === 'SUMMATIVE'),
        exams: data.filter(a => a.type === 'EXAM')
      };
      setAssessments(grouped);
    } catch (err) {
      console.error('Error loading assessments:', err);
      setError('Failed to load assessments');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatSubmissionDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const AssessmentItem = ({ item }) => {
    const hasSubmission = item.hasSubmission || false;
    const submission = item?.submission;
    const status = submission?.status;

    return (
      <div className="flex flex-col gap-2 py-2 border-b border-gray-100 last:border-0">
        <div className='grid grid-cols-2 gap-3'>
          {/* TEST COLUMN */}
          <div className='bg-white rounded-lg p-3 border border-gray-100'>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                US{item.unitStandardId}
              </span>
              <span className="text-sm font-medium text-gray-800">{item.title}</span>
              {item.dueDate && (
                <span className="text-xs text-orange-500 flex items-center gap-1">
                  <FaCalendarAlt size={10} /> Due: {formatDate(item.dueDate)}
                </span>
              )}
            </div>
            {item.description && (
              <p className="text-xs text-gray-400 mt-1">{item.description}</p>
            )}
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <FaStar size={10} className="text-amber-400" />
                {item.totalMarks} marks
              </span>
              <span className="flex items-center gap-1">
                <FaClock size={10} />
                Self-paced
              </span>
            </div>
          </div>

          {/* SUBMISSION COLUMN */}
          <div className='bg-gray-50 rounded-lg p-3 border border-gray-100'>
            {hasSubmission && submission ? (
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <FaCheckCircle className="text-green-500 text-sm" />
                    <span className="text-sm font-medium text-gray-800">Submitted</span>
                    {status === 'GRADED' && (
                      <Badge bg="success" className="text-xs">Graded</Badge>
                    )}
                    {status === 'RE_SUBMITTED' && (
                      <Badge  className="text-xs !bg-amber-700 text-uppercase font-bold">Resubmitted</Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    Submitted on: {formatSubmissionDate(submission.submittedAt)}
                  </p>
                  {submission.obtainedMarks !== null && (
                    <p className="text-xs font-medium text-gray-700 mt-1">
                      Score: {submission.obtainedMarks}/{item.totalMarks}
                    </p>
                  )}
                </div>
                <Button
                  onClick={() => navigate(`${item.id}`)}
                  size="sm"
                  variant="outline-primary"
                  className="rounded-md text-xs"
                >
                  <FaEye size={12} className="inline mr-1" /> View
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <FaRegCircle className="text-gray-400 text-sm" />
                    <span className="text-sm font-medium text-gray-600">Not Started</span>
                  </div>
                  <p className="text-xs text-gray-400">No submission yet</p>
                </div>
                <Button
                  onClick={() => navigate(`${item.id}`)}
                  size="sm"
                  variant="primary"
                  className="rounded-md text-xs"
                >
                  Start
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <FaClipboardList className="text-gray-300 text-5xl mx-auto mb-3" />
          <p className="text-gray-500">{error}</p>
          <Button variant="primary" size="sm" onClick={loadAssessments}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const hasAssessments = assessments.learnerWorkbooks.length > 0 || assessments.summative.length > 0 || assessments.exams.length > 0;

  if (!hasAssessments) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen w-full">
        <div className="max-w-4xl mx-auto">
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <FaClipboardList className="text-purple-600 text-lg" />
              <h3 className="text-gray-800 font-semibold m-0">Assessments</h3>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">No assessments available</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <FaClipboardList className="text-gray-300 text-5xl mx-auto mb-3" />
            <p className="text-gray-500">No assessments found for this unit standard</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen w-full">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <FaClipboardList className="text-purple-600 text-lg" />
            <h3 className="text-gray-800 font-semibold m-0">Assessments</h3>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">Complete your assessments before the due date</p>
        </div>

        <Accordion defaultActiveKey={[]}>
          {/* Learner Workbooks */}
          {assessments.learnerWorkbooks.length > 0 && (
            <Accordion.Item eventKey="0" className="mb-3 border rounded-lg overflow-hidden shadow-sm">
              <Accordion.Header className="bg-white">
                <div className="flex items-center gap-2">
                  <FaFlask className="text-blue-500 text-sm" />
                  <span className="font-semibold text-sm text-gray-700">Learner Workbooks</span>
                  <Badge bg="secondary" className="ms-2 rounded-pill">
                    {assessments.learnerWorkbooks.length}
                  </Badge>
                </div>
              </Accordion.Header>
              <Accordion.Body className="p-3 bg-white">
                {assessments.learnerWorkbooks.map((item) => (
                  <AssessmentItem key={item.id} item={item} />
                ))}
              </Accordion.Body>
            </Accordion.Item>
          )}

          {/* Summative Assessments */}
          {assessments.summative.length > 0 && (
            <Accordion.Item eventKey="1" className="mb-3 border rounded-lg overflow-hidden shadow-sm">
              <Accordion.Header>
                <div className="flex items-center gap-2">
                  <FaChartLine className="text-green-500 text-sm" />
                  <span className="font-semibold text-sm text-gray-700">Summative Assessments</span>
                  <Badge bg="secondary" className="ms-2 rounded-pill">
                    {assessments.summative.length}
                  </Badge>
                </div>
              </Accordion.Header>
              <Accordion.Body className="p-3">
                {assessments.summative.map((item) => (
                  <AssessmentItem key={item.id} item={item} />
                ))}
              </Accordion.Body>
            </Accordion.Item>
          )}

          {/* Exams */}
          {assessments.exams.length > 0 && (
            <Accordion.Item eventKey="2" className="border rounded-lg overflow-hidden shadow-sm">
              <Accordion.Header>
                <div className="flex items-center gap-2">
                  <FaGraduationCap className="text-red-500 text-sm" />
                  <span className="font-semibold text-sm text-gray-700">Examinations</span>
                  <Badge bg="secondary" className="ms-2 rounded-pill">
                    {assessments.exams.length}
                  </Badge>
                </div>
              </Accordion.Header>
              <Accordion.Body className="p-3">
                {assessments.exams.map((item) => (
                  <AssessmentItem key={item.id} item={item} />
                ))}
              </Accordion.Body>
            </Accordion.Item>
          )}
        </Accordion>
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { Accordion, Badge, Button, Spinner } from 'react-bootstrap';
import { FaClipboardList, FaFlask, FaChartLine, FaGraduationCap, FaCalendarAlt, FaCheckCircle, FaRegCircle } from 'react-icons/fa';
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
      
      // Group assessments by type - using actual backend types
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

  const getStatusBadge = (status) => {
    if (status === 'PUBLISHED') {
      return <Badge bg="success" className="text-center">Published</Badge>;
    }
    return <Badge bg="secondary" className="text-center">Draft</Badge>;
  };

  const AssessmentItem = ({ item }) => (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0 hover:bg-gray-50 px-2 rounded-lg transition">
      <div className="flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
            US{item.unitStandardId}
          </span>
          <span className="text-sm text-gray-700">{item.title}</span>
          {item.dueDate && (
            <span className="text-xs text-orange-500 flex items-center gap-1">
              <FaCalendarAlt size={10} /> Due: {formatDate(item.dueDate)}
            </span>
          )}
          {getStatusBadge(item.status)}
        </div>
        {item.description && (
          <p className="text-xs text-gray-400 mt-1 ml-1">{item.description}</p>
        )}
      </div>
      <div className="w-[5%] min-w-[70px]">
        <Button 
          onClick={() => navigate(`${item.id}`)} 
          size="sm" 
          variant="primary" 
          className="rounded-md w-full p-1 text-xs"
        >
          View
        </Button>
      </div>
    </div>
  );

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
        <div className="">
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
      <div >
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
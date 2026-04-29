import { Accordion, Badge, Button } from 'react-bootstrap';
import { FaClipboardList, FaFlask, FaChartLine, FaGraduationCap, FaCalendarAlt, FaCheckCircle, FaRegCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function AssessmentPage() {

  const navigate = useNavigate()

  const assessments = {
    formative: [
      { id: 1, unitStandard: '14933', title: "React Basics", status: "completed", dueDate: '2026-03-10', score: "85%" },
      { id: 2, unitStandard: '14933', title: "Hooks Checkpoint", status: "pending", dueDate: '2026-03-17', score: null },
      { id: 3, unitStandard: '14935', title: "State Management Exercise", status: "pending", dueDate: '2026-03-24', score: null },
    ],
    summative: [
      { id: 4, unitStandard: '14938', title: "Midterm Assessment", status: "pending", dueDate: '2026-04-05', score: null },
      { id: 5, unitStandard: '14940', title: "Portfolio Review", status: "pending", dueDate: '2026-04-20', score: null },
    ],
    exams: [
      { id: 6, unitStandard: '14945', title: "Final Exam", status: "pending", dueDate: '2026-05-15', score: null },
      { id: 7, unitStandard: '14945', title: "Certification Test", status: "completed", dueDate: '2026-05-01', score: "92%" },
    ]
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const AssessmentItem = ({ item }) => (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
      <div className="flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
            US{item.unitStandard}
          </span>
          <span className="text-sm text-gray-700">{item.title}</span>
          {item.dueDate && (
            <span className="text-xs text-orange-500 flex items-center gap-1">
              <FaCalendarAlt size={10} /> Due: {formatDate(item.dueDate)}
            </span>
          )}
        </div>
      </div>
      <div className='w-[5%]'>
        {item.status === 'completed' ? (
          <Badge bg="success" className="w-full">
            {item.score}
          </Badge>
        ) : (
          <Button onClick={()=>navigate(`${item?.title}`)} size="sm" variant="primary" className="rounded-md w-full p-0">
            Start
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-3 bg-gray-50 min-h-screen w-full">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <FaClipboardList className="text-purple-600 text-lg" />
            <h3 className="text-gray-800 font-semibold m-0">Assessments</h3>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">Advanced React Development</p>
        </div>

        {/* React Bootstrap Accordion */}
        <Accordion defaultActiveKey={[]}>
          {/* Formative */}
          <Accordion.Item eventKey="0" className="mb-3 border rounded-lg overflow-hidden shadow-sm">
            <Accordion.Header className="bg-white">
              <div className="flex items-center gap-2">
                <FaFlask className="text-blue-500 text-sm" />
                <span className="font-semibold text-sm text-gray-700">Formative Assessment</span>
                <Badge bg="secondary" className="ms-2 rounded-pill">
                  {assessments.formative.length}
                </Badge>
              </div>
            </Accordion.Header>
            <Accordion.Body className="p-3 bg-white">
              {assessments.formative.map((item) => (
                <AssessmentItem key={item.id} item={item} />
              ))}
            </Accordion.Body>
          </Accordion.Item>

          {/* Summative */}
          <Accordion.Item eventKey="1" className="mb-3 border rounded-lg overflow-hidden shadow-sm">
            <Accordion.Header>
              <div className="flex items-center gap-2">
                <FaChartLine className="text-green-500 text-sm" />
                <span className="font-semibold text-sm text-gray-700">Summative Assessment</span>
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

          {/* Exams */}
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
        </Accordion>
      </div>
    </div>
  );
}
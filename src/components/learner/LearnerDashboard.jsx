import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, ListGroup, Badge } from 'react-bootstrap';
import {
  BookOpen,
  ChevronLeft,
  FileText,
  Download,
  Upload,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

// Sample data
const unitStandards = [
  {
    id: 1,
    saqaId: '119635',
    title: 'Apply Health & Safety in the Workplace',
    image: 'https://images.unsplash.com/photo-1530092285049-1c42085fd395?w=400&h=300&fit=crop',
    nqfLevel: 2,
    credits: 4,
    learningMaterials: [
      { id: 1, title: 'Learner Guide Module 1-3', type: 'PDF', downloaded: true },
      { id: 2, title: 'Hazard Identification PPT', type: 'PPT', downloaded: false },
      { id: 3, title: 'Safety Induction Video', type: 'Video', downloaded: false }
    ],
    formativeAssessments: [
      { id: 1, title: 'Test 1: Safety Legislation', dueDate: '2024-03-25', marks: 50, status: 'not-started' },
      { id: 2, title: 'Quiz: Hazard Identification', dueDate: '2024-03-28', marks: 30, status: 'not-started' }
    ],
    summativeAssessments: [
      { id: 3, title: 'Final Test: Health & Safety', dueDate: '2024-04-10', marks: 100, status: 'pending' }
    ],
    poe: {
      title: 'Portfolio of Evidence',
      dueDate: '2024-04-15',
      tasks: [
        { id: 1, name: 'Task 1: Safety Checklist', submitted: false },
        { id: 2, name: 'Task 2: Incident Report', submitted: false },
        { id: 3, name: 'Task 3: Risk Assessment', submitted: false }
      ]
    },
    workplaceTasks: [
      { id: 1, title: 'Safety Inspection', dueDate: '2024-03-30', status: 'pending' },
      { id: 2, title: 'Report Near Miss', dueDate: '2024-04-05', status: 'pending' }
    ]
  },
  {
    id: 2,
    saqaId: '119631',
    title: 'Communicate in the Workplace',
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=300&fit=crop',
    nqfLevel: 3,
    credits: 5,
    learningMaterials: [
      { id: 1, title: 'Communication Guide', type: 'PDF', downloaded: true },
      { id: 2, title: 'Active Listening Video', type: 'Video', downloaded: true }
    ],
    formativeAssessments: [
      { id: 1, title: 'Test 1: Communication Styles', dueDate: '2024-03-26', marks: 40, status: 'not-started' }
    ],
    summativeAssessments: [
      { id: 2, title: 'Final Test: Workplace Comm', dueDate: '2024-04-12', marks: 80, status: 'pending' }
    ],
    poe: {
      title: 'Portfolio of Evidence',
      dueDate: '2024-04-20',
      tasks: [
        { id: 1, name: 'Task 1: Meeting Minutes', submitted: false },
        { id: 2, name: 'Task 2: Email Writing', submitted: false }
      ]
    },
    workplaceTasks: [
      { id: 1, title: 'Group Discussion', dueDate: '2024-03-28', status: 'pending' }
    ]
  }
];

// Mock assessment questions
const assessmentQuestions = {
  1: {
    title: 'Test 1: Safety Legislation',
    instructions: 'Answer all questions. Submit in PDF format.',
    dueDate: '2024-03-25',
    totalMarks: 50,
    questions: [
      { number: 1, text: 'Explain the difference between a hazard and a risk. Provide one example of each.', marks: 5 },
      { number: 2, text: 'List 5 common workplace hazards found in an office environment.', marks: 10 },
      { number: 3, text: 'What is the purpose of a risk assessment? Describe the 5 steps to conducting one.', marks: 15 },
      { number: 4, text: 'Name three pieces of safety legislation that apply to workplaces in South Africa.', marks: 10 },
      { number: 5, text: 'Describe the correct procedure for reporting an incident at work.', marks: 10 }
    ],
    attachments: [
      'Test_1_Question_Paper.pdf',
      'Answer_Sheet_Template.docx'
    ]
  }
};

export const LearnerDashboard = () => {
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'unit-detail', 'assessment'
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleUnitClick = (unit) => {
    setSelectedUnit(unit);
    setCurrentView('unit-detail');
  };

  const handleAssessmentClick = (assessment) => {
    setSelectedAssessment(assessment);
    setCurrentView('assessment');
  };

  const handleBack = () => {
    if (currentView === 'assessment') {
      setCurrentView('unit-detail');
    } else if (currentView === 'unit-detail') {
      setCurrentView('dashboard');
      setSelectedUnit(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
      case 'submitted':
        return <Badge bg="success" className="px-2">Completed</Badge>;
      case 'not-started':
        return <Badge bg="secondary" className="px-2">Not Started</Badge>;
      case 'pending':
        return <Badge bg="warning" className="px-2">Pending</Badge>;
      default:
        return <Badge bg="light" text="dark">Unknown</Badge>;
    }
  };

  // Dashboard View
  if (currentView === 'dashboard') {
    return (
      <div className="min-vh-100" style={{ backgroundColor: '#f8fafc' }}>
        {/* Header */}
        <div className="py-4 px-4 border-bottom bg-white">
          <Container fluid>
            <div className="d-flex align-items-center">
              <div className="rounded-circle p-2 d-flex align-items-center justify-content-center me-3"
                style={{ backgroundColor: '#fee2e2', width: '45px', height: '45px' }}>
                <BookOpen size={24} style={{ color: '#ef4444' }} />
              </div>
              <h1 className="h4 mb-0 fw-semibold" style={{ color: '#1e293b' }}>
                My Learnership Dashboard
              </h1>
            </div>
          </Container>
        </div>

        <Container fluid className="py-4 px-4">
          <h5 className="mb-3 fw-semibold" style={{ color: '#334155' }}>My Unit Standards</h5>

          <Row xs={1} md={2} lg={4} className="g-4">
            {unitStandards.map((unit) => (
              <Col key={unit.id}>
                <Card
                  className="h-100 border-0  overflow-hidden"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleUnitClick(unit)}
                >
                  <div style={{ height: '140px', overflow: 'hidden' }}>
                    <Card.Img
                      variant="top"
                      src={unit.image}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <Card.Body className="p-3">
                    <Card.Title className="h6 fw-semibold mb-2" style={{ color: '#0f172a' }}>
                      {unit.title}
                    </Card.Title>
                    <div className="d-flex align-items-center">
                      <span className="small text-muted">SAQA ID:</span>
                      <span className="small fw-medium ms-1" style={{ color: '#ef4444' }}>
                        {unit.saqaId}
                      </span>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </div>
    );
  }

  // Unit Detail View
  if (currentView === 'unit-detail' && selectedUnit) {
    return (
      <div className="min-vh-100" style={{ backgroundColor: '#f8fafc' }}>
        {/* Header with back button */}
        <div className="py-3 px-4 border-bottom bg-white">
          <Container fluid>
            <Button
              variant="link"
              className="p-0 mb-2 d-flex align-items-center text-decoration-none"
              onClick={handleBack}
              style={{ color: '#ef4444' }}
            >
              <ChevronLeft size={20} /> Back to Dashboard
            </Button>
            <h2 className="h4 fw-semibold mb-1">{selectedUnit.title}</h2>
            <div className="d-flex gap-3">
              <span className="small text-muted">SAQA ID: {selectedUnit.saqaId}</span>
              <span className="small text-muted">NQF Level: {selectedUnit.nqfLevel}</span>
              <span className="small text-muted">Credits: {selectedUnit.credits}</span>
            </div>
          </Container>
        </div>

        <Container fluid className="py-4 px-4">
          <Row>
            <Col lg={8}>
              {/* Learning Materials */}
              <Card className="border-0  mb-4">
                <Card.Body>
                  <h6 className="fw-semibold mb-3 d-flex align-items-center">
                    <BookOpen size={18} className="me-2" style={{ color: '#ef4444' }} />
                    Learning Materials
                  </h6>
                  <ListGroup variant="flush">
                    {selectedUnit.learningMaterials.map((item, idx) => (
                      <ListGroup.Item key={idx} className="px-0 d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <FileText size={16} className="me-2" style={{ color: '#64748b' }} />
                          <span>{item.title}</span>
                          <Badge bg="light" text="dark" className="ms-2">{item.type}</Badge>
                        </div>
                        <Button size="sm" variant="outline" style={{ color: '#ef4444' }}>
                          <Download size={16} />
                        </Button>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>

              {/* Formative Assessments */}
              <Card className="border-0  mb-4">
                <Card.Body>
                  <h6 className="fw-semibold mb-3">📝 Formative Assessments</h6>
                  {selectedUnit.formativeAssessments.map((assessment) => (
                    <div
                      key={assessment.id}
                      className="d-flex justify-content-between align-items-center p-3 mb-2 rounded"
                      style={{ backgroundColor: '#f8fafc', cursor: 'pointer' }}
                      onClick={() => handleAssessmentClick(assessment)}
                    >
                      <div>
                        <div className="fw-medium">{assessment.title}</div>
                        <div className="d-flex gap-3 mt-1">
                          <small className="text-muted d-flex align-items-center">
                            <Clock size={12} className="me-1" /> Due: {assessment.dueDate}
                          </small>
                          <small className="text-muted">Marks: {assessment.marks}</small>
                        </div>
                      </div>
                      {getStatusBadge(assessment.status)}
                    </div>
                  ))}
                </Card.Body>
              </Card>

              {/* Summative Assessments */}
              <Card className="border-0  mb-4">
                <Card.Body>
                  <h6 className="fw-semibold mb-3">📋 Summative Assessments</h6>
                  {selectedUnit.summativeAssessments.map((assessment) => (
                    <div
                      key={assessment.id}
                      className="d-flex justify-content-between align-items-center p-3 mb-2 rounded"
                      style={{ backgroundColor: '#f8fafc', cursor: 'pointer' }}
                      onClick={() => handleAssessmentClick(assessment)}
                    >
                      <div>
                        <div className="fw-medium">{assessment.title}</div>
                        <div className="d-flex gap-3 mt-1">
                          <small className="text-muted d-flex align-items-center">
                            <Clock size={12} className="me-1" /> Due: {assessment.dueDate}
                          </small>
                          <small className="text-muted">Marks: {assessment.marks}</small>
                        </div>
                      </div>
                      {getStatusBadge(assessment.status)}
                    </div>
                  ))}
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4}>
              {/* POE Card */}
              <Card className="border-0  mb-4">
                <Card.Body>
                  <h6 className="fw-semibold mb-3">📂 Portfolio of Evidence</h6>
                  <div className="mb-3">
                    <small className="text-muted d-block">Due: {selectedUnit.poe.dueDate}</small>
                    <small className="text-muted">Tasks: {selectedUnit.poe.tasks.length}</small>
                  </div>
                  {selectedUnit.poe.tasks.map((task) => (
                    <div key={task.id} className="d-flex justify-content-between align-items-center mb-2">
                      <small>{task.name}</small>
                      {task.submitted ?
                        <CheckCircle size={16} style={{ color: '#10b981' }} /> :
                        <AlertCircle size={16} style={{ color: '#94a3b8' }} />
                      }
                    </div>
                  ))}
                </Card.Body>
              </Card>

              {/* Workplace Tasks */}
              <Card className="border-0 ">
                <Card.Body>
                  <h6 className="fw-semibold mb-3">⚡ Workplace Tasks</h6>
                  {selectedUnit.workplaceTasks.map((task) => (
                    <div key={task.id} className="d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <div className="small fw-medium">{task.title}</div>
                        <small className="text-muted">Due: {task.dueDate}</small>
                      </div>
                      {getStatusBadge(task.status)}
                    </div>
                  ))}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  // Assessment Detail View
  // Assessment Detail View
  if (currentView === 'assessment' && selectedAssessment) {
    const assessment = assessmentQuestions[selectedAssessment.id] || {
      title: selectedAssessment.title,
      instructions: 'Download the assessment document, complete all questions, and upload your completed file.',
      dueDate: selectedAssessment.dueDate,
      totalMarks: selectedAssessment.marks,
      assessmentFile: 'Formative_Assessment_Test_1.docx',
      supportDocs: ['Safety_Legislation_Guide.pdf', 'Hazard_Identification_Checklist.pdf']
    };

    return (
      <div className="min-vh-100" style={{ backgroundColor: '#f8fafc' }}>
        {/* Header with back button */}
        <div className="py-3 px-4 border-bottom bg-white">
          <Container fluid>
            <Button
              variant="link"
              className="p-0 mb-2 d-flex align-items-center text-decoration-none"
              onClick={handleBack}
              style={{ color: '#ef4444' }}
            >
              <ChevronLeft size={20} /> Back to Unit Standard
            </Button>
            <h2 className="h4 fw-semibold mb-1">{assessment.title}</h2>
            <div className="d-flex gap-3">
              <span className="small text-muted d-flex align-items-center">
                <Clock size={14} className="me-1" /> Due: {assessment.dueDate}
              </span>
              <span className="small text-muted">Total Marks: {assessment.totalMarks}</span>
            </div>
          </Container>
        </div>

        <Container fluid className="py-4 px-4">
          <Row>
            <Col lg={8}>
              {/* Instructions */}
              <Card className="border-0  mb-4">
                <Card.Body>
                  <h6 className="fw-semibold mb-3 d-flex align-items-center">
                    <FileText size={18} className="me-2" style={{ color: '#ef4444' }} />
                    Assessment Instructions
                  </h6>
                  <p className="mb-3">{assessment.instructions}</p>

                  {/* Download Assessment File - Prominent */}
                  <div className="p-4 rounded-3 mb-3" style={{ backgroundColor: '#fef2f2', border: '1px solid #fee2e2' }}>
                    <div className="d-flex align-items-center mb-3">
                      <FileText size={24} className="me-3" style={{ color: '#ef4444' }} />
                      <div>
                        <h6 className="fw-semibold mb-1">Assessment Document</h6>
                        <small className="text-muted">Download, complete, then upload below</small>
                      </div>
                    </div>
                    <Button
                      className="w-100 py-2 d-flex align-items-center justify-content-center"
                      style={{ backgroundColor: '#ef4444', border: 'none' }}
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        alert('Downloading ' + assessment.assessmentFile);
                      }}
                    >
                      <Download size={18} className="me-2" />
                      Download {assessment.assessmentFile}
                    </Button>
                  </div>
                </Card.Body>
              </Card>

              {/* Submission Form */}
              <Card className="border-0  mb-4">
                <Card.Body>
                  <h6 className="fw-semibold mb-3 d-flex align-items-center">
                    <Upload size={18} className="me-2" style={{ color: '#ef4444' }} />
                    Submit Completed Assessment
                  </h6>

                  {submitted ? (
                    <div className="p-4 bg-success bg-opacity-10 rounded-3 d-flex align-items-center">
                      <CheckCircle size={24} className="me-3 text-success" />
                      <div>
                        <span className="fw-medium text-success d-block">Assessment submitted successfully!</span>
                        <small className="text-muted">Your file has been uploaded. You'll receive feedback soon.</small>
                      </div>
                    </div>
                  ) : (
                    <Form onSubmit={handleSubmit}>
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-medium">Upload your completed DOCX file</Form.Label>
                        <Form.Control
                          type="file"
                          accept=".docx,.doc,.pdf"
                          required
                          className="py-2"
                        />
                        <Form.Text className="text-muted">
                          Accepted formats: DOCX, DOC, PDF (max 10MB)
                        </Form.Text>
                      </Form.Group>

                      <Form.Group className="mb-4">
                        <Form.Label className="fw-medium">Additional comments (optional)</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          placeholder="Any notes for your facilitator..."
                        />
                      </Form.Group>

                      <Button
                        type="submit"
                        className="w-100 py-2"
                        style={{ backgroundColor: '#ef4444', border: 'none' }}
                      >
                        <Upload size={18} className="me-2" /> Submit Assessment
                      </Button>
                    </Form>
                  )}
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4}>
              {/* Support Documents */}
              <Card className="border-0  mb-4">
                <Card.Body>
                  <h6 className="fw-semibold mb-3 d-flex align-items-center">
                    <BookOpen size={18} className="me-2" style={{ color: '#ef4444' }} />
                    Support Materials
                  </h6>
                  <p className="small text-muted mb-3">Reference documents to help you complete the assessment:</p>
                  {assessment.supportDocs.map((doc, idx) => (
                    <div key={idx} className="d-flex justify-content-between align-items-center mb-3 p-2 rounded" style={{ backgroundColor: '#f8fafc' }}>
                      <div className="d-flex align-items-center">
                        <FileText size={16} className="me-2" style={{ color: '#64748b' }} />
                        <small>{doc}</small>
                      </div>
                      <Button
                        size="sm"
                        variant="link"
                        style={{ color: '#ef4444' }}
                        onClick={(e) => {
                          e.preventDefault();
                          alert('Downloading ' + doc);
                        }}
                      >
                        <Download size={16} />
                      </Button>
                    </div>
                  ))}
                </Card.Body>
              </Card>

              {/* Status Card */}
              <Card className="border-0 ">
                <Card.Body>
                  <h6 className="fw-semibold mb-3">📊 Submission Status</h6>
                  <div className="d-flex align-items-center mb-3">
                    <AlertCircle size={20} className="me-2" style={{ color: '#f59e0b' }} />
                    <div>
                      <div className="fw-medium">Not Submitted</div>
                      <small className="text-muted">Due: {assessment.dueDate}</small>
                    </div>
                  </div>
                  <div className="small text-muted">
                    <Clock size={14} className="me-1" />
                    {Math.ceil((new Date(assessment.dueDate) - new Date()) / (1000 * 60 * 60 * 24))} days remaining
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  return null;
};
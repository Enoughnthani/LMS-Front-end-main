import React, { useState, useEffect } from 'react';
import { Dropdown, Modal, Offcanvas } from 'react-bootstrap';
import { Container, Row, Col, Card, Button, Form, ListGroup, Badge } from 'react-bootstrap';
import {
  BookOpen,
  ChevronLeft,
  FileText,
  Download,
  Upload,
  CheckCircle,
  Clock,
  AlertCircle,
  Menu,
  Award,
  Calendar,
  Target,
  BarChart2,
  Activity,
  Zap,
  TrendingUp
} from 'lucide-react';

// Sample data with learner assignments
const allUnitStandards = [
  {
    id: 1,
    saqaId: '119635',
    title: 'Apply Health & Safety in the Workplace',
    image: 'https://images.unsplash.com/photo-1530092285049-1c42085fd395?w=400&h=300&fit=crop',
    nqfLevel: 2,
    credits: 4,
    assignedTo: ['learner1@email.com', 'learner2@email.com'],
    category: 'Health & Safety',
    progress: 45,
    learningMaterials: [
      { id: 1, title: 'Learner Guide Module 1-3', type: 'PDF', downloaded: true },
      { id: 2, title: 'Hazard Identification PPT', type: 'PPT', downloaded: false },
      { id: 3, title: 'Safety Induction Video', type: 'Video', downloaded: false }
    ],
    formativeAssessments: [
      { id: 1, title: 'Test 1: Safety Legislation', dueDate: '2024-03-25', marks: 50, status: 'not-started', completedPercentage: 0 },
      { id: 2, title: 'Quiz: Hazard Identification', dueDate: '2024-03-28', marks: 30, status: 'not-started', completedPercentage: 0 }
    ],
    summativeAssessments: [
      { id: 3, title: 'Final Test: Health & Safety', dueDate: '2024-04-10', marks: 100, status: 'pending', completedPercentage: 0 }
    ],
    poe: {
      title: 'Portfolio of Evidence',
      dueDate: '2024-04-15',
      tasks: [
        { id: 1, name: 'Task 1: Safety Checklist', submitted: false, completedPercentage: 0 },
        { id: 2, name: 'Task 2: Incident Report', submitted: false, completedPercentage: 0 },
        { id: 3, name: 'Task 3: Risk Assessment', submitted: false, completedPercentage: 0 }
      ]
    },
    workplaceTasks: [
      { id: 1, title: 'Safety Inspection', dueDate: '2024-03-30', status: 'pending', completedPercentage: 0 }
    ]
  },
  {
    id: 2,
    saqaId: '119631',
    title: 'Communicate in the Workplace',
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=300&fit=crop',
    nqfLevel: 3,
    credits: 5,
    assignedTo: ['learner1@email.com'],
    category: 'Communication',
    progress: 25,
    learningMaterials: [
      { id: 1, title: 'Communication Guide', type: 'PDF', downloaded: true },
      { id: 2, title: 'Active Listening Video', type: 'Video', downloaded: true }
    ],
    formativeAssessments: [
      { id: 1, title: 'Test 1: Communication Styles', dueDate: '2024-03-26', marks: 40, status: 'not-started', completedPercentage: 0 }
    ],
    summativeAssessments: [
      { id: 2, title: 'Final Test: Workplace Comm', dueDate: '2024-04-12', marks: 80, status: 'pending', completedPercentage: 0 }
    ],
    poe: {
      title: 'Portfolio of Evidence',
      dueDate: '2024-04-20',
      tasks: [
        { id: 1, name: 'Task 1: Meeting Minutes', submitted: false, completedPercentage: 0 },
        { id: 2, name: 'Task 2: Email Writing', submitted: false, completedPercentage: 0 }
      ]
    },
    workplaceTasks: [
      { id: 1, title: 'Group Discussion', dueDate: '2024-03-28', status: 'pending', completedPercentage: 0 }
    ]
  },
  {
    id: 3,
    saqaId: '119632',
    title: 'Advanced Computer Skills',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop',
    nqfLevel: 4,
    credits: 6,
    assignedTo: ['learner2@email.com'],
    category: 'Technology',
    progress: 10,
    learningMaterials: [
      { id: 1, title: 'Excel Advanced Guide', type: 'PDF', downloaded: false },
      { id: 2, title: 'Python Basics', type: 'Video', downloaded: false }
    ],
    formativeAssessments: [
      { id: 1, title: 'Excel Test', dueDate: '2024-04-01', marks: 50, status: 'not-started', completedPercentage: 0 }
    ],
    summativeAssessments: [
      { id: 2, title: 'Final Project', dueDate: '2024-04-20', marks: 100, status: 'pending', completedPercentage: 0 }
    ],
    poe: {
      title: 'Portfolio of Evidence',
      dueDate: '2024-04-25',
      tasks: [
        { id: 1, name: 'Task 1: Database Design', submitted: false, completedPercentage: 0 }
      ]
    },
    workplaceTasks: [
      { id: 1, title: 'System Analysis', dueDate: '2024-04-10', status: 'pending', completedPercentage: 0 }
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
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [selectedFacilitator, setSelectedFacilitator] = useState('');
  const [showCourses, setShowCourses] = useState(false);
  const [showSideBar, setShowSideBar] = useState(false);
  const [timeframe, setTimeframe] = useState('week');

  // Current logged-in learner
  const [currentLearner, setCurrentLearner] = useState({
    email: 'learner1@email.com',
    name: 'John Doe',
    role: 'learner'
  });

  const [profile, setProfile] = useState({
    name: currentLearner.name,
    email: currentLearner.email,
    phone: "0123456789"
  });

  const [notifications] = useState([
    { id: 1, title: "New assignment uploaded", time: "2 hours ago", read: false },
    { id: 2, title: "Facilitator sent you a message", time: "Yesterday", read: false },
    { id: 3, title: "Assessment deadline approaching", time: "2 days ago", read: true }
  ]);

  const [messages, setMessages] = useState([
    { sender: "facilitator", text: "Welcome to the course! Let me know if you have any questions.", time: "10:30 AM" },
    { sender: "learner", text: "Thank you! I'll review the materials first.", time: "11:00 AM" }
  ]);

  const [newMessage, setNewMessage] = useState("");

  // Get units assigned to current learner
  const getAssignedUnits = () => {
    return allUnitStandards.filter(unit =>
      unit.assignedTo.includes(currentLearner.email)
    );
  };

  // Save completed tasks to localStorage
  const [completedTasks, setCompletedTasks] = useState(() => {
    const saved = localStorage.getItem(`completedTasks_${currentLearner.email}`);
    return saved ? JSON.parse(saved) : {};
  });

  // Save to localStorage whenever completedTasks changes
  useEffect(() => {
    localStorage.setItem(`completedTasks_${currentLearner.email}`, JSON.stringify(completedTasks));
  }, [completedTasks, currentLearner.email]);

  // Calculate completion percentage for a specific item
  const getCompletionPercentage = (unitId, itemType, itemId) => {
    const key = `${unitId}-${itemType}-${itemId}`;
    return completedTasks[key] || 0;
  };

  // Mark task as attempted with 100% completion
  const markTaskAsCompleted = (unitId, itemType, itemId) => {
    const key = `${unitId}-${itemType}-${itemId}`;
    setCompletedTasks(prev => ({
      ...prev,
      [key]: 100
    }));
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleUnitClick = (unit) => {
    setSelectedUnit(unit);
    setCurrentView('unit-detail');
  };

  const handleAssessmentClick = (assessment, type = 'formative') => {
    setSelectedAssessment({ ...assessment, type });
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

  const handleSubmit = (e, unitId, itemType, itemId) => {
    e.preventDefault();
    markTaskAsCompleted(unitId, itemType, itemId);
  };

  const getStatusBadge = (status, percentage) => {
    if (percentage === 100) {
      return <Badge bg="success" className="px-2">Completed ✓</Badge>;
    }
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

  // Render completion percentage in red
  const renderCompletionPercentage = (percentage) => {
    if (percentage === 100) {
      return (
        <div className="mt-1">
          <span className="text-danger fw-bold" style={{ fontSize: '12px' }}>
            ✓ Task Completed: 100%
          </span>
        </div>
      );
    }
    return null;
  };

  const handleLogout = () => {
    console.log("User logged out");
  };

  const handleProfileChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages(prev => [...prev, { sender: "learner", text: newMessage, time: "Just now" }]);
    setNewMessage("");
  };

  const assignedUnits = getAssignedUnits();

  // Calculate overall progress
  const totalAssessments = assignedUnits.reduce((total, unit) => {
    return total + unit.formativeAssessments.length + unit.summativeAssessments.length;
  }, 0);

  const completedAssessments = assignedUnits.reduce((total, unit) => {
    const formativeCompleted = unit.formativeAssessments.filter(a =>
      getCompletionPercentage(unit.id, 'formative', a.id) === 100
    ).length;
    const summativeCompleted = unit.summativeAssessments.filter(a =>
      getCompletionPercentage(unit.id, 'summative', a.id) === 100
    ).length;
    return total + formativeCompleted + summativeCompleted;
  }, 0);

  const overallProgress = totalAssessments > 0 ? (completedAssessments / totalAssessments) * 100 : 0;

  // Calculate earned credits
  const earnedCredits = assignedUnits.reduce((total, unit) => {
    const totalUnitAssessments = unit.formativeAssessments.length + unit.summativeAssessments.length;
    const completedUnitAssessments = [...unit.formativeAssessments, ...unit.summativeAssessments].filter(a =>
      getCompletionPercentage(unit.id, a.id < 100 ? 'formative' : 'summative', a.id) === 100
    ).length;
    const unitProgress = totalUnitAssessments > 0 ? (completedUnitAssessments / totalUnitAssessments) * 100 : 0;
    if (unitProgress === 100) {
      return total + unit.credits;
    }
    return total;
  }, 0);

  const totalCredits = assignedUnits.reduce((total, unit) => total + unit.credits, 0);



  // Dashboard View
  if (currentView === 'dashboard') {
    return (
      <div className="min-vh-100" style={{ backgroundColor: '#f8fafc' }}>

        {/* HEADER NAVIGATION */}
        <div className="py-3 px-4 border-bottom bg-white sticky-top" style={{ zIndex: 1000 }}>
          <Container fluid className="d-flex justify-content-between align-items-center">
            <Menu onClick={() => setShowSideBar(true)} style={{ cursor: 'pointer' }} />

            <div>
              <h1 className="h4 mb-0 fw-semibold" style={{ color: '#1e293b' }}>
                Welcome back, {profile.name.split(' ')[0]}! 👋
              </h1>
              <small className="text-muted">Continue your learning journey</small>
            </div>

            <div className="d-flex align-items-center gap-3">
              <div className="position-relative">
                <Button
                  variant="light"
                  className="d-flex align-items-center gap-2 rounded-circle p-2"
                  onClick={() => setShowNotifications(!showNotifications)}
                  style={{ width: '40px', height: '40px' }}
                >
                  🔔
                  {notifications.filter(n => !n.read).length > 0 && (
                    <Badge bg="danger" pill className="position-absolute top-0 end-0">
                      {notifications.filter(n => !n.read).length}
                    </Badge>
                  )}
                </Button>
              </div>

              <Button
                variant="light"
                className="d-flex align-items-center gap-2 rounded-circle p-2"
                onClick={() => setShowChat(!showChat)}
                style={{ width: '40px', height: '40px' }}
              >
                💬
              </Button>

              <Dropdown className="d-inline">
                <Dropdown.Toggle variant="light" id="dropdown-basic" className="d-flex align-items-center gap-2 rounded-circle p-0" style={{ width: '40px', height: '40px', overflow: 'hidden' }}>
                  <img
                    src={`https://ui-avatars.com/api/?name=${profile.name.replace(' ', '+')}&background=ef4444&color=fff&size=40`}
                    alt="Profile"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Dropdown.Toggle>
                <Dropdown.Menu align="end">
                  <Dropdown.Item onClick={() => setShowProfile(true)}>
                    <strong>{profile.name}</strong><br />
                    <small className="text-muted">{profile.email}</small>
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={() => setShowCourses(true)}>
                    📚 My Courses
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setShowProfile(true)}>
                    👤 Edit Profile
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout} className="text-danger">
                    🚪 Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </Container>
        </div>

        {/* MODALS */}
        <Modal onHide={() => setShowProfile(false)} centered show={showProfile}>
          <Modal.Header closeButton>
            <h5>Profile Settings</h5>
          </Modal.Header>
          <Modal.Body>
            <div className="text-center mb-3">
              <img
                src={`https://ui-avatars.com/api/?name=${profile.name.replace(' ', '+')}&background=ef4444&color=fff&size=80`}
                alt="Profile"
                className="rounded-circle"
                style={{ width: '80px', height: '80px' }}
              />
            </div>
            {!editingProfile ? (
              <div>
                <p><strong>Name:</strong> {profile.name}</p>
                <p><strong>Email:</strong> {profile.email}</p>
                <p><strong>Phone:</strong> {profile.phone}</p>
                <Button size="sm" onClick={() => setEditingProfile(true)}>Edit Profile</Button>
              </div>
            ) : (
              <Form>
                <Form.Group className="mb-2">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    size="sm"
                    value={profile.name}
                    onChange={(e) => handleProfileChange('name', e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    size="sm"
                    value={profile.email}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    size="sm"
                    value={profile.phone}
                    onChange={(e) => handleProfileChange('phone', e.target.value)}
                  />
                </Form.Group>
                <Button size="sm" className="w-100 mt-2" onClick={() => setEditingProfile(false)}>
                  Save Changes
                </Button>
              </Form>
            )}
          </Modal.Body>
        </Modal>

        <Modal onHide={() => setShowChat(false)} centered show={showChat} size="lg">
          <Modal.Header closeButton>
            <h5>Messages</h5>
          </Modal.Header>
          <Modal.Body>
            <div className="d-flex flex-column" style={{ height: '400px' }}>
              <div className="flex-grow-1 overflow-auto mb-3" style={{ maxHeight: '300px' }}>
                {messages.map((msg, i) => (
                  <div key={i} className={`mb-3 ${msg.sender === 'learner' ? 'text-end' : ''}`}>
                    <div className={`d-inline-block p-2 rounded-3 ${msg.sender === 'learner' ? 'bg-danger text-white' : 'bg-light'}`} style={{ maxWidth: '80%' }}>
                      <small className="d-block fw-semibold">{msg.sender === 'learner' ? 'You' : 'Facilitator'}</small>
                      <span>{msg.text}</span>
                      <small className="d-block text-muted" style={{ fontSize: '10px' }}>{msg.time}</small>
                    </div>
                  </div>
                ))}
              </div>
              <Form.Control
                as="textarea"
                rows={2}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="mb-2"
              />
              <Button onClick={handleSendMessage} style={{ backgroundColor: '#ef4444', border: 'none' }}>
                Send Message
              </Button>
            </div>
          </Modal.Body>
        </Modal>

        <Modal onHide={() => setShowNotifications(false)} centered show={showNotifications}>
          <Modal.Header closeButton>
            <h5>Notifications</h5>
          </Modal.Header>
          <Modal.Body>
            <div>
              {notifications.length === 0 ? (
                <p className="text-muted text-center">No notifications</p>
              ) : (
                <ListGroup variant="flush">
                  {notifications.map((note, i) => (
                    <ListGroup.Item key={i} className={!note.read ? 'bg-light' : ''}>
                      <div className="d-flex justify-content-between">
                        <div>
                          <strong>{note.title}</strong>
                          <br />
                          <small className="text-muted">{note.time}</small>
                        </div>
                        {!note.read && <Badge bg="danger">New</Badge>}
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </div>
          </Modal.Body>
        </Modal>

        {/* ALL COURSES / MODULES PANEL */}
        {showCourses && (
          <Card
            className="position-fixed top-50 start-50 translate-middle shadow-lg"
            style={{ width: '700px', maxHeight: '80vh', overflowY: 'auto', zIndex: 1200 }}
          >
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0 fw-semibold">All My Courses / Modules</h5>
                <Button size="sm" variant="outline-secondary" onClick={() => setShowCourses(false)}>
                  Close
                </Button>
              </div>
              {assignedUnits.map((unit) => {
                const totalUnitAssessments = unit.formativeAssessments.length + unit.summativeAssessments.length;
                const completedUnitAssessments = [...unit.formativeAssessments, ...unit.summativeAssessments].filter(a =>
                  getCompletionPercentage(unit.id, a.id < 100 ? 'formative' : 'summative', a.id) === 100
                ).length;
                const unitProgress = totalUnitAssessments > 0 ? (completedUnitAssessments / totalUnitAssessments) * 100 : 0;

                return (
                  <Card key={unit.id} className="mb-2">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="fw-semibold">{unit.title}</span>
                        <span className={`small ${unitProgress === 100 ? 'text-success' : 'text-warning'}`}>
                          {unitProgress === 100 ? 'Completed' : 'In Progress'}
                        </span>
                      </div>
                      <div className="progress" style={{ height: '8px' }}>
                        <div
                          className={`progress-bar ${unitProgress === 100 ? 'bg-success' : 'bg-warning'}`}
                          role="progressbar"
                          style={{ width: `${unitProgress}%` }}
                          aria-valuenow={unitProgress}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                      <small className="text-muted">SAQA ID: {unit.saqaId}</small>
                    </Card.Body>
                  </Card>
                );
              })}
            </Card.Body>
          </Card>
        )}

        {/* MAIN DASHBOARD CONTENT */}
        <Container fluid className="py-4 px-4">

          {/* STATISTICS CARDS */}
          <Row className="g-4 mb-4">
            <Col md={3}>
              <Card className="border-0 shadow-sm h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <Award size={24} style={{ color: '#ef4444' }} />
                    <span className="h2 mb-0 fw-bold">{earnedCredits}/{totalCredits}</span>
                  </div>
                  <h6 className="mb-0">Credits Earned</h6>
                  <small className="text-muted">Total credits: {totalCredits}</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="border-0 shadow-sm h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <Target size={24} style={{ color: '#10b981' }} />
                    <span className="h2 mb-0 fw-bold">{Math.round(overallProgress)}%</span>
                  </div>
                  <h6 className="mb-0">Overall Progress</h6>
                  <small className="text-muted">{completedAssessments}/{totalAssessments} assessments completed</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="border-0 shadow-sm h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <Calendar size={24} style={{ color: '#f59e0b' }} />
                    <span className="h2 mb-0 fw-bold">{assignedUnits.length}</span>
                  </div>
                  <h6 className="mb-0">Active Units</h6>
                  <small className="text-muted">Currently enrolled</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="border-0 shadow-sm h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <Zap size={24} style={{ color: '#8b5cf6' }} />
                    <span className="h2 mb-0 fw-bold">15</span>
                  </div>
                  <h6 className="mb-0">Study Streak</h6>
                  <small className="text-muted">Days in a row</small>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* CHARTS SECTION - Using CSS Progress Bars Instead of External Charts */}
          <Row className="g-4 mb-4">

            <Col lg={6}>
              <Card className="border-0 shadow-sm h-full">
                <Card.Header className="bg-white border-0 pt-3">
                  <h6 className="mb-0 fw-semibold">📈 Unit Progress</h6>
                </Card.Header>
                <Card.Body>
                  <div style={{ height: '250px', overflowY: 'auto' }}>
                    {assignedUnits.map((unit, idx) => {
                      const totalUnitAssessments = unit.formativeAssessments.length + unit.summativeAssessments.length;
                      const completedUnitAssessments = [...unit.formativeAssessments, ...unit.summativeAssessments].filter(a =>
                        getCompletionPercentage(unit.id, a.id < 100 ? 'formative' : 'summative', a.id) === 100
                      ).length;
                      const progressPercentage = totalUnitAssessments > 0 ? (completedUnitAssessments / totalUnitAssessments) * 100 : 0;

                      return (
                        <div key={idx} className="mb-3">
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <small className="fw-medium">{unit.title.split(' ').slice(0, 3).join(' ')}</small>
                            <small className="text-muted">{Math.round(progressPercentage)}%</small>
                          </div>
                          <div className="progress" style={{ height: '8px' }}>
                            <div
                              className="progress-bar"
                              style={{
                                width: `${progressPercentage}%`,
                                backgroundColor: '#ef4444'
                              }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={6}>
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white border-0 pt-3">
                  <h6 className="mb-0 fw-semibold">🎯 Overall Completion</h6>
                </Card.Header>
                <Card.Body className="text-center">
                  <div className="position-relative d-inline-block mb-3">
                    <svg width="180" height="180" viewBox="0 0 120 120">
                      <circle
                        cx="60"
                        cy="60"
                        r="54"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="12"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="54"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="12"
                        strokeDasharray={`${(overallProgress / 100) * 339.292} 339.292`}
                        strokeLinecap="round"
                        transform="rotate(-90 60 60)"
                      />
                      <text
                        x="60"
                        y="60"
                        textAnchor="middle"
                        dy=".3em"
                        className="h3 fw-bold"
                        fill="#1e293b"
                      >
                        {Math.round(overallProgress)}%
                      </text>
                    </svg>
                  </div>
                  <div className="mt-2">
                    <p className="mb-0 fw-bold">{Math.round(overallProgress)}% Complete</p>
                    <small className="text-muted">Keep up the great work!</small>
                  </div>
                  <div className="mt-3 d-flex justify-content-center gap-3">
                    <div className="d-flex align-items-center">
                      <div style={{ width: '12px', height: '12px', backgroundColor: '#10b981', borderRadius: '2px', marginRight: '6px' }}></div>
                      <small>Completed</small>
                    </div>
                    <div className="d-flex align-items-center">
                      <div style={{ width: '12px', height: '12px', backgroundColor: '#f59e0b', borderRadius: '2px', marginRight: '6px' }}></div>
                      <small>In Progress</small>
                    </div>
                    <div className="d-flex align-items-center">
                      <div style={{ width: '12px', height: '12px', backgroundColor: '#e5e7eb', borderRadius: '2px', marginRight: '6px' }}></div>
                      <small>Not Started</small>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

          </Row>


          {/* UNIT STANDARDS SECTION */}
          <h5 className="mb-3 fw-semibold" style={{ color: '#334155' }}>
            📖 My Assigned Unit Standards
          </h5>

          <Row xs={1} md={2} lg={3} className="g-4  my-4">
            {assignedUnits.map((unit) => {
              const totalUnitAssessments = unit.formativeAssessments.length + unit.summativeAssessments.length;
              const completedUnitAssessments = [...unit.formativeAssessments, ...unit.summativeAssessments].filter(a =>
                getCompletionPercentage(unit.id, a.id < 100 ? 'formative' : 'summative', a.id) === 100
              ).length;
              const progressPercentage = totalUnitAssessments > 0 ? (completedUnitAssessments / totalUnitAssessments) * 100 : 0;

              return (
                <Col key={unit.id}>
                  <Card
                    className="h-100 border-0 overflow-hidden shadow-sm"
                    style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                    onClick={() => handleUnitClick(unit)}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <div style={{ height: '140px', overflow: 'hidden', position: 'relative' }}>
                      <Card.Img
                        variant="top"
                        src={unit.image}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <Badge
                        bg="dark"
                        className="position-absolute top-0 end-0 m-2"
                        style={{ opacity: 0.9 }}
                      >
                        NQF {unit.nqfLevel}
                      </Badge>
                    </div>
                    <Card.Body className="p-3">
                      <Card.Title className="h6 fw-semibold mb-2" style={{ color: '#0f172a' }}>
                        {unit.title}
                      </Card.Title>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="small text-muted">SAQA: {unit.saqaId}</span>
                        <span className="small fw-medium" style={{ color: '#ef4444' }}>
                          {unit.credits} credits
                        </span>
                      </div>
                      <div className="progress" style={{ height: '6px' }}>
                        <div
                          className="progress-bar"
                          style={{ width: `${progressPercentage}%`, backgroundColor: '#ef4444' }}
                          role="progressbar"
                          aria-valuenow={progressPercentage}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                      <small className="text-muted mt-2 d-block">{Math.round(progressPercentage)}% Complete</small>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>

<Row className="g-4 mb-4">

            <Col lg={12}>
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white border-0 pt-3">
                  <h6 className="mb-0 fw-semibold">📚 Upcoming Deadlines</h6>
                </Card.Header>
                <Card.Body>
                  <div className="overflow-auto" style={{ maxHeight: '200px' }}>
                    {assignedUnits.flatMap(unit => [
                      ...unit.formativeAssessments.map(a => ({ ...a, type: 'Formative', unitTitle: unit.title, unitId: unit.id })),
                      ...unit.summativeAssessments.map(a => ({ ...a, type: 'Summative', unitTitle: unit.title, unitId: unit.id }))
                    ])
                      .filter(a => getCompletionPercentage(a.unitId, a.type.toLowerCase(), a.id) !== 100)
                      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                      .slice(0, 5)
                      .map((assessment, idx) => {
                        const daysRemaining = Math.ceil((new Date(assessment.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
                        return (
                          <div key={idx} className="d-flex justify-content-between align-items-center p-3 mb-2 rounded" style={{ backgroundColor: '#f8fafc' }}>
                            <div>
                              <div className="fw-medium">{assessment.title}</div>
                              <small className="text-muted">{assessment.unitTitle} • {assessment.type}</small>
                            </div>
                            <div className="text-end">
                              <small className={`d-block ${daysRemaining <= 3 ? 'text-danger fw-bold' : 'text-muted'}`}>
                                Due: {assessment.dueDate}
                              </small>
                              {daysRemaining <= 3 && (
                                <Badge bg="danger" className="mt-1">Urgent!</Badge>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    {assignedUnits.flatMap(unit => [...unit.formativeAssessments, ...unit.summativeAssessments])
                      .filter(a => getCompletionPercentage(a.unitId, a.id < 100 ? 'formative' : 'summative', a.id) !== 100).length === 0 && (
                        <div className="text-center py-4">
                          <CheckCircle size={48} className="text-success mb-2" />
                          <p className="text-muted mb-0">All caught up! No pending deadlines.</p>
                        </div>
                      )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          {assignedUnits.length === 0 && (
            <div className="text-center py-5">
              <AlertCircle size={48} className="text-muted mb-3" />
              <p className="text-muted">No unit standards assigned to you yet.</p>
              <small className="text-muted">Please contact your facilitator for assignments.</small>
            </div>
          )}
        </Container>

        <Offcanvas show={showSideBar} onHide={() => setShowSideBar(false)} placement='start'>
          <Offcanvas.Header closeButton>
            <h5>Menu</h5>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <ListGroup variant="flush">
              <ListGroup.Item action onClick={() => {
                setShowSideBar(false);
                setCurrentView('dashboard');
              }}>
                📊 Dashboard
              </ListGroup.Item>
              <ListGroup.Item action onClick={() => {
                setShowSideBar(false);
                setShowCourses(true);
              }}>
                📚 My Courses
              </ListGroup.Item>
              <ListGroup.Item action onClick={() => {
                setShowSideBar(false);
                setShowProfile(true);
              }}>
                👤 Profile
              </ListGroup.Item>
              <ListGroup.Item action onClick={() => {
                setShowSideBar(false);
                setShowChat(true);
              }}>
                💬 Chat
              </ListGroup.Item>
              <ListGroup.Item action onClick={() => {
                setShowSideBar(false);
                setShowNotifications(true);
              }}>
                🔔 Notifications
              </ListGroup.Item>
              <ListGroup.Item action className="text-danger" onClick={handleLogout}>
                🚪 Logout
              </ListGroup.Item>
            </ListGroup>
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    );
  }

  // Unit Detail View (same as before)
  if (currentView === 'unit-detail' && selectedUnit) {
    return (
      <div className="min-vh-100" style={{ backgroundColor: '#f8fafc' }}>
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
    <Card className="border-0 shadow-sm mb-4">
      <Card.Body>
        <h6 className="fw-semibold mb-3 d-flex align-items-center">
          <BookOpen size={18} className="me-2" style={{ color: '#ef4444' }} />
          Learning Materials
        </h6>
        <ListGroup variant="flush">
          {selectedUnit.learningMaterials.map((item, idx) => {
            // Create download handler for each material
            const handleDownload = () => {
              // Sample file content based on material type
              const fileContent = {
                'PDF': `Sample PDF content for ${item.title}\n\nThis is a sample learning material. In a real application, this would be the actual PDF file.`,
                'PPT': `Sample PowerPoint content for ${item.title}\n\nSlide 1: Introduction\nSlide 2: Key Concepts\nSlide 3: Examples`,
                'Video': `Video link: https://example.com/videos/${item.title.toLowerCase().replace(/ /g, '-')}\n\nIn a real application, this would be a video file or streaming link.`
              };
              
              const content = fileContent[item.type] || `Learning Material: ${item.title}\n\nType: ${item.type}\n\nThis material covers important concepts related to ${selectedUnit.title}.`;
              
              // Create blob and download
              const blob = new Blob([content], { type: 'application/octet-stream' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `${item.title.replace(/ /g, '_')}.${item.type.toLowerCase()}`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
              
              // Show success message
              alert(`Downloading: ${item.title}.${item.type.toLowerCase()}`);
            };
            
            return (
              <ListGroup.Item key={idx} className="px-0 d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <FileText size={16} className="me-2" style={{ color: '#64748b' }} />
                  <span>{item.title}</span>
                  <Badge bg="light" text="dark" className="ms-2">{item.type}</Badge>
                </div>
                <Button 
                  size="sm" 
                  variant="outline-danger" 
                  style={{ color: '#ef4444' }}
                  onClick={handleDownload}
                >
                  <Download size={16} />
                </Button>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      </Card.Body>
    </Card>

    {/* Formative Assessments */}
    <Card className="border-0 shadow-sm mb-4">
      <Card.Body>
        <h6 className="fw-semibold mb-3">📝 Formative Assessments</h6>
        {selectedUnit.formativeAssessments.map((assessment) => {
          const percentage = getCompletionPercentage(selectedUnit.id, 'formative', assessment.id);
          return (
            <div
              key={assessment.id}
              className="d-flex justify-content-between align-items-center p-3 mb-2 rounded"
              style={{ backgroundColor: '#f8fafc', cursor: 'pointer' }}
              onClick={() => handleAssessmentClick(assessment, 'formative')}
            >
              <div>
                <div className="fw-medium">{assessment.title}</div>
                <div className="d-flex gap-3 mt-1">
                  <small className="text-muted d-flex align-items-center">
                    <Clock size={12} className="me-1" /> Due: {assessment.dueDate}
                  </small>
                  <small className="text-muted">Marks: {assessment.marks}</small>
                </div>
                {renderCompletionPercentage(percentage)}
              </div>
              {getStatusBadge(assessment.status, percentage)}
            </div>
          );
        })}
      </Card.Body>
    </Card>

    {/* Summative Assessments */}
    <Card className="border-0 shadow-sm mb-4">
      <Card.Body>
        <h6 className="fw-semibold mb-3">📋 Summative Assessments</h6>
        {selectedUnit.summativeAssessments.map((assessment) => {
          const percentage = getCompletionPercentage(selectedUnit.id, 'summative', assessment.id);
          return (
            <div
              key={assessment.id}
              className="d-flex justify-content-between align-items-center p-3 mb-2 rounded"
              style={{ backgroundColor: '#f8fafc', cursor: 'pointer' }}
              onClick={() => handleAssessmentClick(assessment, 'summative')}
            >
              <div>
                <div className="fw-medium">{assessment.title}</div>
                <div className="d-flex gap-3 mt-1">
                  <small className="text-muted d-flex align-items-center">
                    <Clock size={12} className="me-1" /> Due: {assessment.dueDate}
                  </small>
                  <small className="text-muted">Marks: {assessment.marks}</small>
                </div>
                {renderCompletionPercentage(percentage)}
              </div>
              {getStatusBadge(assessment.status, percentage)}
            </div>
          );
        })}
      </Card.Body>
    </Card>
  </Col>

  <Col lg={4}>
    {/* POE Card */}
    <Card className="border-0 shadow-sm mb-4">
      <Card.Body>
        <h6 className="fw-semibold mb-3">📂 Portfolio of Evidence</h6>
        <div className="mb-3">
          <small className="text-muted d-block">Due: {selectedUnit.poe.dueDate}</small>
          <small className="text-muted">Tasks: {selectedUnit.poe.tasks.length}</small>
        </div>
        {selectedUnit.poe.tasks.map((task) => {
          const percentage = getCompletionPercentage(selectedUnit.id, 'poe', task.id);
          return (
            <div key={task.id} className="d-flex justify-content-between align-items-center mb-3">
              <small>{task.name}</small>
              {percentage === 100 ? (
                <CheckCircle size={16} style={{ color: '#10b981' }} />
              ) : (
                <Button
                  size="sm"
                  variant="outline-danger"
                  onClick={() => markTaskAsCompleted(selectedUnit.id, 'poe', task.id)}
                >
                  Mark Complete
                </Button>
              )}
            </div>
          );
        })}
        {selectedUnit.poe.tasks.some(t => getCompletionPercentage(selectedUnit.id, 'poe', t.id) === 100) && (
          renderCompletionPercentage(100)
        )}
      </Card.Body>
    </Card>

    {/* Workplace Tasks */}
    <Card className="border-0 shadow-sm">
      <Card.Body>
        <h6 className="fw-semibold mb-3">⚡ Workplace Tasks</h6>
        {selectedUnit.workplaceTasks.map((task) => {
          const percentage = getCompletionPercentage(selectedUnit.id, 'workplace', task.id);
          return (
            <div key={task.id} className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <div className="small fw-medium">{task.title}</div>
                <small className="text-muted">Due: {task.dueDate}</small>
                {renderCompletionPercentage(percentage)}
              </div>
              {getStatusBadge(task.status, percentage)}
            </div>
          );
        })}
      </Card.Body>
    </Card>
  </Col>
</Row>
        </Container>
      </div>
    );
  }

  // Assessment Detail View
  if (currentView === 'assessment' && selectedAssessment && selectedUnit) {
    const assessment = assessmentQuestions[selectedAssessment.id] || {
      title: selectedAssessment.title,
      instructions: 'Download the assessment document, complete all questions, and upload your completed file.',
      dueDate: selectedAssessment.dueDate,
      totalMarks: selectedAssessment.marks,
      assessmentFile: 'Assessment_Question_Paper.docx',
      supportDocs: ['Study_Guide.pdf', 'Reference_Materials.pdf']
    };

    const isCompleted = getCompletionPercentage(selectedUnit.id, selectedAssessment.type, selectedAssessment.id) === 100;

    return (
      <div className="min-vh-100" style={{ backgroundColor: '#f8fafc' }}>
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
              <Card className="border-0 shadow-sm mb-4">
                <Card.Body>
                  <h6 className="fw-semibold mb-3 d-flex align-items-center">
                    <FileText size={18} className="me-2" style={{ color: '#ef4444' }} />
                    Assessment Instructions
                  </h6>
                  <p className="mb-3">{assessment.instructions}</p>

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

              <Card className="border-0 shadow-sm mb-4">
                <Card.Body>
                  <h6 className="fw-semibold mb-3 d-flex align-items-center">
                    <Upload size={18} className="me-2" style={{ color: '#ef4444' }} />
                    Submit Completed Assessment
                  </h6>

                  {isCompleted ? (
                    <div className="p-4 bg-success bg-opacity-10 rounded-3 d-flex align-items-center">
                      <CheckCircle size={24} className="me-3 text-success" />
                      <div>
                        <span className="fw-medium text-success d-block">Assessment completed successfully!</span>
                        <small className="text-muted">You have completed this assessment with 100%.</small>
                        {renderCompletionPercentage(100)}
                      </div>
                    </div>
                  ) : submitted ? (
                    <div className="p-4 bg-success bg-opacity-10 rounded-3 d-flex align-items-center">
                      <CheckCircle size={24} className="me-3 text-success" />
                      <div>
                        <span className="fw-medium text-success d-block">Assessment submitted successfully!</span>
                        <small className="text-muted">Your file has been uploaded.</small>
                      </div>
                    </div>
                  ) : (
                    <Form onSubmit={(e) => handleSubmit(e, selectedUnit.id, selectedAssessment.type, selectedAssessment.id)}>
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-medium">Upload your completed file</Form.Label>
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
              <Card className="border-0 shadow-sm mb-4">
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
                        onClick={() => alert('Downloading ' + doc)}
                      >
                        <Download size={16} />
                      </Button>
                    </div>
                  ))}
                </Card.Body>
              </Card>

              <Card className="border-0 shadow-sm">
                <Card.Body>
                  <h6 className="fw-semibold mb-3">📊 Submission Status</h6>
                  <div className="d-flex align-items-center mb-3">
                    {isCompleted ? (
                      <CheckCircle size={20} className="me-2 text-success" />
                    ) : (
                      <AlertCircle size={20} className="me-2" style={{ color: '#f59e0b' }} />
                    )}
                    <div>
                      <div className="fw-medium">{isCompleted ? 'Completed' : 'Not Submitted'}</div>
                      <small className="text-muted">Due: {assessment.dueDate}</small>
                    </div>
                  </div>
                  {renderCompletionPercentage(getCompletionPercentage(selectedUnit.id, selectedAssessment.type, selectedAssessment.id))}
                  <div className="small text-muted mt-2">
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
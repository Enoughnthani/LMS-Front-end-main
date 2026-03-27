import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Tabs, Tab, Dropdown, ButtonGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// Role Switcher Component (embedded)
const RoleSwitcher = ({ currentRole, availableRoles, onRoleChange }) => {
  return (
    <Dropdown as={ButtonGroup}>
      <Dropdown.Toggle variant="primary" id="dropdown-role-switcher">
        Current Role: {currentRole}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {availableRoles.map(role => (
          <Dropdown.Item 
            key={role} 
            onClick={() => onRoleChange(role)}
            active={role === currentRole}
          >
            {role}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

const FacilitatorPage = () => {
  const [key, setKey] = useState('content');
  
  // Mock user data
  const [user] = useState({
    name: 'Alex Morgan',
    availableRoles: ['Facilitator', 'Assessor', 'Moderator', 'Mentor', 'Intern']
  });
  
  const [currentRole, setCurrentRole] = useState('Facilitator');

  const handleRoleChange = (newRole) => {
    setCurrentRole(newRole);
    // In a real app, you would navigate to the new role page
    console.log(`Switching to ${newRole} role`);
  };
  
  const learningModules = [
    { id: 1, title: 'Introduction to Web Development', status: 'Active', enrolled: 24 },
    { id: 2, title: 'JavaScript Fundamentals', status: 'Active', enrolled: 18 },
    { id: 3, title: 'React Basics', status: 'Draft', enrolled: 0 },
  ];
  
  const sessions = [
    { id: 1, title: 'JavaScript Variables & Functions', date: '2024-03-15', time: '10:00 AM', attendees: 15 },
    { id: 2, title: 'React Components Workshop', date: '2024-03-18', time: '2:00 PM', attendees: 12 },
  ];
  
  const submissions = [
    { id: 1, learner: 'John Doe', module: 'JavaScript Basics', submitted: '2024-03-14', status: 'Pending Review' },
    { id: 2, learner: 'Jane Smith', module: 'React Components', submitted: '2024-03-13', status: 'Reviewed' },
  ];

  return (
    <Container fluid className="py-4">
      {/* Header with Role Switcher */}
      <div className="d-flex justify-content-between align-items-center mb-4 bg-white p-3 rounded ">
        <div>
          <h1 className="h3 mb-0 text-gray-800">Welcome, {user.name}</h1>
          <p className="text-muted small mb-0">Facilitator Dashboard</p>
        </div>
        <RoleSwitcher 
          currentRole={currentRole}
          availableRoles={user.availableRoles}
          onRoleChange={handleRoleChange}
        />
      </div>

      {/* Dashboard Content */}
      <div className="bg-white rounded shadow p-4">
        <Tabs
          id="facilitator-tabs"
          activeKey={key}
          onSelect={(k) => setKey(k)}
          className="mb-4"
        >
          <Tab eventKey="content" title="Learning Content">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="h5 mb-0">Learning Modules</h4>
              <Button variant="primary" size="sm">+ Create New Module</Button>
            </div>
            <Row>
              {learningModules.map(module => (
                <Col md={4} key={module.id} className="mb-4">
                  <Card className="h-100">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <Card.Title className="h6">{module.title}</Card.Title>
                        <Badge bg={module.status === 'Active' ? 'success' : 'warning'}>
                          {module.status}
                        </Badge>
                      </div>
                      <Card.Text className="small text-muted">
                        Enrolled: {module.enrolled} learners
                      </Card.Text>
                      <div className="d-flex gap-2">
                        <Button variant="outline-primary" size="sm">Edit</Button>
                        <Button variant="outline-secondary" size="sm">View</Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Tab>

          <Tab eventKey="sessions" title="Training Sessions">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="h5 mb-0">Upcoming Sessions</h4>
              <Button variant="primary" size="sm">+ Schedule Session</Button>
            </div>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Session Title</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Attendees</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map(session => (
                  <tr key={session.id}>
                    <td>{session.title}</td>
                    <td>{session.date}</td>
                    <td>{session.time}</td>
                    <td>{session.attendees}</td>
                    <td>
                      <Button variant="success" size="sm" className="me-2">Start</Button>
                      <Button variant="outline-primary" size="sm">Edit</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Tab>

          <Tab eventKey="submissions" title="Learner Activities">
            <h4 className="h5 mb-4">Pending Submissions</h4>
            {submissions.map(sub => (
              <Card key={sub.id} className="mb-3">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h5 className="h6 mb-1">{sub.learner}</h5>
                      <p className="small text-muted mb-1">{sub.module}</p>
                      <small className="text-muted">Submitted: {sub.submitted}</small>
                    </div>
                    <Badge bg={sub.status === 'Pending Review' ? 'warning' : 'success'}>
                      {sub.status}
                    </Badge>
                  </div>
                  <div className="mt-3 d-flex gap-2">
                    <Button variant="primary" size="sm">Review</Button>
                    <Button variant="outline-primary" size="sm">Give Feedback</Button>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </Tab>

          <Tab eventKey="participation" title="Participation">
            <h4 className="h5 mb-4">Monitor Participation</h4>
            <Row>
              <Col md={4}>
                <Card className="text-center bg-light">
                  <Card.Body>
                    <h6 className="text-muted small">Active Learners</h6>
                    <p className="h2 text-gray-800">42</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="text-center bg-light">
                  <Card.Body>
                    <h6 className="text-muted small">Today's Sessions</h6>
                    <p className="h2 text-gray-800">3</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="text-center bg-light">
                  <Card.Body>
                    <h6 className="text-muted small">Pending Reviews</h6>
                    <p className="h2 text-gray-800">8</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab>
        </Tabs>
      </div>
    </Container>
  );
};

export default FacilitatorPage;
import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Dropdown, ButtonGroup } from 'react-bootstrap';
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

const MentorPage = () => {
  // Mock user data
  const [user] = useState({
    name: 'Alex Morgan',
    availableRoles: ['Facilitator', 'Assessor', 'Moderator', 'Mentor', 'Intern']
  });
  
  const [currentRole, setCurrentRole] = useState('Mentor');

  const handleRoleChange = (newRole) => {
    setCurrentRole(newRole);
    // In a real app, you would navigate to the new role page
    console.log(`Switching to ${newRole} role`);
  };
  
  const interns = [
    { id: 1, name: 'Michael Brown', currentReport: 'Week 3 Report', status: 'pending', progress: 'On Track' },
    { id: 2, name: 'Sarah Wilson', currentReport: 'Week 2 Report', status: 'approved', progress: 'Ahead' },
    { id: 3, name: 'David Lee', currentReport: 'Week 4 Report', status: 'needs_revision', progress: 'At Risk' },
  ];

  const pendingActivities = [
    { id: 1, intern: 'Michael Brown', activity: 'Timesheet Approval', submitted: '2024-03-14' },
    { id: 2, intern: 'David Lee', activity: 'Report Review', submitted: '2024-03-13' },
  ];

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending': return <Badge bg="warning">Pending</Badge>;
      case 'approved': return <Badge bg="success">Approved</Badge>;
      case 'needs_revision': return <Badge bg="danger">Needs Revision</Badge>;
      default: return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const getProgressBadge = (progress) => {
    switch(progress) {
      case 'On Track': return <Badge bg="success">On Track</Badge>;
      case 'Ahead': return <Badge bg="info">Ahead</Badge>;
      case 'At Risk': return <Badge bg="danger">At Risk</Badge>;
      default: return <Badge bg="secondary">{progress}</Badge>;
    }
  };

  return (
    <Container fluid className="py-4">
      {/* Header with Role Switcher */}
      <div className="d-flex justify-content-between align-items-center mb-4 bg-white p-3 rounded ">
        <div>
          <h1 className="h3 mb-0 text-gray-800">Welcome, {user.name}</h1>
          <p className="text-muted small mb-0">Mentor Dashboard</p>
        </div>
        <RoleSwitcher 
          currentRole={currentRole}
          availableRoles={user.availableRoles}
          onRoleChange={handleRoleChange}
        />
      </div>

      {/* Dashboard Content */}
      <div className="bg-white rounded shadow p-4">
        <Row>
          <Col md={8}>
            <h4 className="h5 mb-4">Assigned Interns</h4>
            <Row>
              {interns.map(intern => (
                <Col md={6} key={intern.id} className="mb-4">
                  <Card className="h-100">
                    <Card.Body>
                      <Card.Title className="h6">{intern.name}</Card.Title>
                      <div className="small mb-3">
                        <div className="mb-2"><strong>Current:</strong> {intern.currentReport}</div>
                        <div className="mb-2"><strong>Status:</strong> {getStatusBadge(intern.status)}</div>
                        <div><strong>Progress:</strong> {getProgressBadge(intern.progress)}</div>
                      </div>
                      <div className="d-flex flex-wrap gap-2">
                        <Button variant="primary" size="sm">Review Report</Button>
                        <Button variant="outline-primary" size="sm">Give Feedback</Button>
                        <Button variant="outline-secondary" size="sm">Track Progress</Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
          <Col md={4}>
            <h4 className="h5 mb-4">Pending Activities</h4>
            {pendingActivities.map(activity => (
              <Card key={activity.id} className="mb-3">
                <Card.Body>
                  <h6 className="mb-1">{activity.intern}</h6>
                  <p className="small text-muted mb-2">{activity.activity}</p>
                  <small className="text-muted d-block mb-3">Submitted: {activity.submitted}</small>
                  <div className="d-flex gap-2">
                    <Button variant="success" size="sm">Approve</Button>
                    <Button variant="primary" size="sm">Review</Button>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </Col>
        </Row>

        <Row className="mt-4">
          <Col md={12}>
            <h4 className="h5 mb-4">Intern Development Tracking</h4>
            <Row>
              <Col md={4}>
                <Card className="text-center bg-light">
                  <Card.Body>
                    <h6 className="text-muted small">Skills Acquired</h6>
                    <p className="h2 text-gray-800">24</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="text-center bg-light">
                  <Card.Body>
                    <h6 className="text-muted small">Hours Logged</h6>
                    <p className="h2 text-gray-800">168</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="text-center bg-light">
                  <Card.Body>
                    <h6 className="text-muted small">Completed Goals</h6>
                    <p className="h2 text-gray-800">12</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default MentorPage;
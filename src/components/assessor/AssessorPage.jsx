import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge, Dropdown, ButtonGroup } from 'react-bootstrap';
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

const AssessorPage = () => {
  const [filter, setFilter] = useState('all');
  
  // Mock user data
  const [user] = useState({
    name: 'Alex Morgan',
    availableRoles: ['Facilitator', 'Assessor', 'Moderator', 'Mentor', 'Intern']
  });
  
  const [currentRole, setCurrentRole] = useState('Assessor');

  const handleRoleChange = (newRole) => {
    setCurrentRole(newRole);
    // In a real app, you would navigate to the new role page
    console.log(`Switching to ${newRole} role`);
  };
  
  const assignedWork = [
    { id: 1, learner: 'Alice Johnson', module: 'JavaScript Basics', submitted: '2024-03-14', status: 'pending', competency: 'In Progress' },
    { id: 2, learner: 'Bob Williams', module: 'React Hooks', submitted: '2024-03-13', status: 'graded', competency: 'Achieved', grade: '85%' },
    { id: 3, learner: 'Carol Davis', module: 'Node.js Fundamentals', submitted: '2024-03-12', status: 'pending', competency: 'Needs Improvement' },
  ];

  const filteredWork = filter === 'all' 
    ? assignedWork 
    : assignedWork.filter(item => item.status === filter);

  return (
    <Container fluid className="py-4">
      {/* Header with Role Switcher */}
      <div className="d-flex justify-content-between align-items-center mb-4 bg-white p-3 rounded ">
        <div>
          <h1 className="h3 mb-0 text-gray-800">Welcome, {user.name}</h1>
          <p className="text-muted small mb-0">Assessor Dashboard</p>
        </div>
        <RoleSwitcher 
          currentRole={currentRole}
          availableRoles={user.availableRoles}
          onRoleChange={handleRoleChange}
        />
      </div>

      {/* Dashboard Content */}
      <div className="bg-white rounded shadow p-4">
        <div className="d-flex align-items-center gap-3 mb-4">
          <Form.Label className="mb-0 fw-bold">Filter by:</Form.Label>
          <Form.Select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            style={{ width: '200px' }}
          >
            <option value="all">All Submissions</option>
            <option value="pending">Pending Review</option>
            <option value="graded">Graded</option>
          </Form.Select>
        </div>

        <h4 className="h5 mb-4">Assigned Learner Work</h4>
        <Row>
          {filteredWork.map(work => (
            <Col md={4} key={work.id} className="mb-4">
              <Card className="h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <Card.Title className="h6">{work.learner}</Card.Title>
                    <Badge bg={work.status === 'pending' ? 'warning' : 'success'}>
                      {work.status}
                    </Badge>
                  </div>
                  <div className="small">
                    <div className="mb-2"><strong>Module:</strong> {work.module}</div>
                    <div className="mb-2"><strong>Submitted:</strong> {work.submitted}</div>
                    <div className="mb-2"><strong>Competency:</strong> {work.competency}</div>
                    {work.grade && <div className="mb-2"><strong>Grade:</strong> {work.grade}</div>}
                  </div>
                  <div className="d-flex flex-wrap gap-2 mt-3">
                    <Button variant="primary" size="sm">Evaluate</Button>
                    <Button variant="outline-primary" size="sm">Feedback</Button>
                    {work.status === 'pending' && (
                      <Button variant="success" size="sm">Grade Now</Button>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </Container>
  );
};

export default AssessorPage;
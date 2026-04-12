import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, ProgressBar, Tabs, Tab, Dropdown, ButtonGroup } from 'react-bootstrap';
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

const InternPage = () => {
  const [key, setKey] = useState('reports');

  // Mock user data
  const [user] = useState({
    name: 'Alex Morgan',
    availableRoles: ['Facilitator', 'Assessor', 'Moderator', 'Mentor', 'Intern']
  });

  const [currentRole, setCurrentRole] = useState('Intern');

  const handleRoleChange = (newRole) => {
    setCurrentRole(newRole);
  };

  const recentReports = [
    { id: 1, week: 'Week 1', submitted: '2024-03-01', status: 'approved', feedback: 'Good work!' },
    { id: 2, week: 'Week 2', submitted: '2024-03-08', status: 'pending', feedback: null },
  ];

  const timesheets = [
    { id: 1, week: 'Week 10', hours: 35, status: 'approved' },
    { id: 2, week: 'Week 11', hours: 32, status: 'pending' },
  ];

  const progressData = {
    totalHours: 67,
    requiredHours: 200,
    reportsSubmitted: 2,
    totalReports: 12,
    competenciesAchieved: 5,
    totalCompetencies: 15
  };

  return (
    <Container fluid className="py-4">
      {/* Header with Role Switcher */}
      <div className="d-flex justify-content-between align-items-center mb-4 bg-white p-3 rounded ">
        <div>
          <h1 className="h3 mb-0 text-gray-800">Welcome, {user.name}</h1>
          <p className="text-muted small mb-0">Intern Dashboard</p>
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
          id="intern-tabs"
          activeKey={key}
          onSelect={(k) => setKey(k)}
          className="mb-4"
        >
          <Tab eventKey="reports" title="Reports">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="h5 mb-0">Internship Reports</h4>
              <Button variant="primary" size="sm">+ Create New Report</Button>
            </div>
            {recentReports.map(report => (
              <Card key={report.id} className="mb-3">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h5 className="h6 mb-2">{report.week} Report</h5>
                      <p className="small text-muted mb-2">Submitted: {report.submitted}</p>
                      {report.feedback && (
                        <p className="small mb-0"><strong>Feedback:</strong> {report.feedback}</p>
                      )}
                    </div>
                    <Badge bg={report.status === 'approved' ? 'success' : 'warning'}>
                      {report.status}
                    </Badge>
                  </div>
                  <div className="mt-3 d-flex gap-2">
                    <Button variant="outline-primary" size="sm">View</Button>
                    <Button variant="outline-secondary" size="sm">Edit</Button>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </Tab>

          <Tab eventKey="timesheets" title="Timesheets">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="h5 mb-0">Timesheets</h4>
              <Button variant="primary" size="sm">+ Log Hours</Button>
            </div>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Week</th>
                  <th>Hours Logged</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {timesheets.map(timesheet => (
                  <tr key={timesheet.id}>
                    <td>{timesheet.week}</td>
                    <td>{timesheet.hours} hours</td>
                    <td>
                      <Badge bg={timesheet.status === 'approved' ? 'success' : 'warning'}>
                        {timesheet.status}
                      </Badge>
                    </td>
                    <td>
                      <Button variant="outline-primary" size="sm" className="me-2">View</Button>
                      <Button variant="outline-secondary" size="sm">Edit</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Tab>

          <Tab eventKey="progress" title="My Progress">
            <h4 className="h5 mb-4">Internship Progress</h4>
            <Row>
              <Col md={4}>
                <Card className="mb-3">
                  <Card.Body>
                    <h6 className="text-muted small">Total Hours</h6>
                    <p className="h4 mb-3">{progressData.totalHours}/{progressData.requiredHours}</p>
                    <ProgressBar
                      now={(progressData.totalHours / progressData.requiredHours) * 100}
                      variant="primary"
                    />
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="mb-3">
                  <Card.Body>
                    <h6 className="text-muted small">Reports Submitted</h6>
                    <p className="h4 mb-3">{progressData.reportsSubmitted}/{progressData.totalReports}</p>
                    <ProgressBar
                      now={(progressData.reportsSubmitted / progressData.totalReports) * 100}
                      variant="info"
                    />
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="mb-3">
                  <Card.Body>
                    <h6 className="text-muted small">Competencies Achieved</h6>
                    <p className="h4 mb-3">{progressData.competenciesAchieved}/{progressData.totalCompetencies}</p>
                    <ProgressBar
                      now={(progressData.competenciesAchieved / progressData.totalCompetencies) * 100}
                      variant="success"
                    />
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

export default InternPage;
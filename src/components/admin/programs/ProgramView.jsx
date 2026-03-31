import { useState, useEffect } from 'react';
import {
    Badge,
    Button,
    Card,
    Col,
    Container,
    Row,
    Tab,
    Tabs,
    ListGroup,
    Alert,
    Spinner
} from 'react-bootstrap';
import {
    FaArrowLeft,
    FaCalendarAlt,
    FaClock,
    FaEdit,
    FaMapMarkerAlt,
    FaUsers,
    FaUserTie,
    FaCheckCircle,
    FaTimesCircle,
    FaCertificate,
    FaAward,
    FaBriefcase,
    FaTrash,
    FaEye,
    FaChartLine,
    FaDownload,
    FaEnvelope
} from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';

// Helper function for category color
const getCategoryColor = (category) => {
    const colors = {
        'short-course': 'primary',
        'learnership': 'success',
        'internship': 'warning'
    };
    return colors[category] || 'secondary';
};

// Mock data for demonstration
const initialPrograms = [
    {
        id: 1,
        title: "Web Development Bootcamp",
        category: "short-course",
        type: "Technical",
        description: "Learn full-stack web development from scratch. Master HTML, CSS, JavaScript, React, and Node.js in this comprehensive bootcamp.",
        duration: "12 weeks",
        capacity: 50,
        learners: 35,
        status: "active",
        startDate: "2024-03-15",
        endDate: "2024-06-15",
        facilitator: "John Doe",
        price: 1500,
        location: "Hybrid",
        tags: ["web", "javascript", "react"],
        featured: true,
        requirements: "Basic computer literacy, willingness to learn",
        learningOutcomes: [
            "Build responsive websites using HTML5, CSS3, and JavaScript",
            "Create dynamic web applications with React.js",
            "Develop RESTful APIs using Node.js and Express",
            "Work with databases like MongoDB and PostgreSQL",
            "Deploy applications to cloud platforms"
        ],
        schedule: [
            { title: "Week 1-2: HTML & CSS Fundamentals", description: "Learn the basics of web structure and styling", date: "Mar 15-28" },
            { title: "Week 3-4: JavaScript Essentials", description: "Master JavaScript programming concepts", date: "Mar 29-Apr 11" },
            { title: "Week 5-8: React.js Deep Dive", description: "Build interactive UIs with React", date: "Apr 12-May 9" },
            { title: "Week 9-10: Backend Development", description: "Create server-side applications", date: "May 10-23" },
            { title: "Week 11-12: Final Project", description: "Build a full-stack application", date: "May 24-Jun 15" }
        ],
        facilitatorBio: "John is a senior software engineer with 10+ years of experience in web development. He has trained over 500 students and helped them launch successful careers in tech.",
        facilitatorExpertise: ["React", "Node.js", "Python", "AWS", "MongoDB"],
        enrolledStudents: [
            { id: 1, name: "Sarah Johnson", email: "sarah@example.com", enrollmentDate: "2024-03-01", progress: 75 },
            { id: 2, name: "Michael Chen", email: "michael@example.com", enrollmentDate: "2024-03-02", progress: 60 },
            { id: 3, name: "Emily Rodriguez", email: "emily@example.com", enrollmentDate: "2024-03-03", progress: 90 }
        ]
    }
];

const ProgramView = ({ program: propProgram, onEdit, onDelete, getCategoryIcon, getStatusBadge }) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [program, setProgram] = useState(propProgram);
    const [loading, setLoading] = useState(!propProgram);
    const [activeTab, setActiveTab] = useState('overview');
    const [error, setError] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Fetch program if not provided as prop
    useEffect(() => {
        if (!propProgram && id) {
            fetchProgram();
        } else if (propProgram) {
            setProgram(propProgram);
            setLoading(false);
        }
    }, [id, propProgram]);

    const fetchProgram = async () => {
        setLoading(true);
        setError(null);
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            const programData = initialPrograms.find(p => p.id === parseInt(id));
            
            if (!programData) {
                setError('Program not found');
            } else {
                setProgram(programData);
            }
        } catch (error) {
            console.error('Error fetching program:', error);
            setError('Failed to load program details. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'TBD';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            });
        } catch (error) {
            return 'Invalid Date';
        }
    };

    const getEnrollmentPercentage = () => {
        if (!program?.capacity) return 0;
        return (program.learners / program.capacity) * 100;
    };

    const handleExportData = () => {
        alert('Export functionality would be implemented here');
    };

    const handleNotifyStudents = () => {
        alert('Send notification to all enrolled students');
    };

    // Loading state
    if (loading) {
        return (
            <Container className="py-5 text-center">
                <Spinner animation="border" variant="primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
                <p className="mt-3 text-muted">Loading program details...</p>
            </Container>
        );
    }

    // Error state
    if (error || !program) {
        return (
            <Container className="py-5">
                <Alert variant="warning" className="shadow-sm">
                    <Alert.Heading className="h4 mb-3">
                        {error || 'Program Not Found'}
                    </Alert.Heading>
                    <p>
                        {error || "The program you're looking for doesn't exist or has been removed."}
                    </p>
                    <hr />
                    <div className="d-flex justify-content-end">
                        <Button variant="outline-warning" onClick={() => navigate('/user/admin/programs')}>
                            <FaArrowLeft className="me-2" /> Back to Programs
                        </Button>
                    </div>
                </Alert>
            </Container>
        );
    }

    return (
        <Container fluid className="py-4">
            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <Alert variant="danger" className="position-fixed top-0 end-0 m-3 shadow" style={{ zIndex: 9999, minWidth: '300px' }}>
                    <Alert.Heading className="h6 mb-2">Delete Program?</Alert.Heading>
                    <p className="mb-2">Are you sure you want to delete "{program.title}"? This action cannot be undone.</p>
                    <div className="d-flex gap-2">
                        <Button size="sm" variant="danger" onClick={() => onDelete && onDelete(program)}>
                            Yes, Delete
                        </Button>
                        <Button size="sm" variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
                            Cancel
                        </Button>
                    </div>
                </Alert>
            )}

            {/* Header with Navigation */}
            <div className="mb-4">
                <div className="d-flex flex-wrap justify-content-between align-items-start gap-3">
                    <Button 
                        variant="outline-secondary" 
                        onClick={() => navigate('/user/admin/programs')}
                        className="mb-3"
                    >
                        <FaArrowLeft className="me-2" /> Back to Programs
                    </Button>
                    <div className="d-flex gap-2">
                        <Button 
                            variant="outline-info" 
                            onClick={handleExportData}
                            className="d-flex align-items-center gap-2"
                        >
                            <FaDownload /> Export Data
                        </Button>
                        <Button 
                            variant="outline-success" 
                            onClick={handleNotifyStudents}
                            className="d-flex align-items-center gap-2"
                        >
                            <FaEnvelope /> Notify Students
                        </Button>
                        {onEdit && (
                            <Button 
                                variant="warning" 
                                onClick={() => onEdit(program)}
                                className="d-flex align-items-center gap-2"
                            >
                                <FaEdit /> Edit Program
                            </Button>
                        )}
                        {onDelete && (
                            <Button 
                                variant="danger" 
                                onClick={() => setShowDeleteConfirm(true)}
                                className="d-flex align-items-center gap-2"
                            >
                                <FaTrash /> Delete
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <Card className="border-0 shadow-sm mb-4 overflow-hidden">
                <div className="position-relative">
                    <div 
                        className="bg-gradient" 
                        style={{ 
                            height: '200px',
                            background: `linear-gradient(135deg, ${getCategoryColor(program.category)} 0%, ${getCategoryColor(program.category)}cc 100%)`
                        }}
                    >
                        <div className="position-absolute top-50 start-0 translate-middle-y ms-4">
                            <div className="bg-white rounded-circle p-3 shadow-lg">
                                <div className={`text-${getCategoryColor(program.category)}`} style={{ fontSize: '3rem' }}>
                                    {getCategoryIcon && getCategoryIcon(program.category)}
                                </div>
                            </div>
                        </div>
                    </div>
                    <Card.Body className="pt-5 mt-4">
                        <Row className="align-items-start">
                            <Col lg={8}>
                                <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                                    {getStatusBadge && getStatusBadge(program.status)}
                                    {program.featured && (
                                        <Badge bg="warning" className="px-3 py-2">
                                            <FaAward className="me-1" /> Featured Program
                                        </Badge>
                                    )}
                                </div>
                                <h1 className="display-5 fw-bold mb-3">{program.title}</h1>
                                <div className="d-flex flex-wrap gap-3 mb-3">
                                    <div className="d-flex align-items-center gap-2 text-muted">
                                        <FaUserTie />
                                        <span>Facilitator: {program.facilitator}</span>
                                    </div>
                                    <div className="d-flex align-items-center gap-2 text-muted">
                                        <FaMapMarkerAlt />
                                        <span>{program.location}</span>
                                    </div>
                                    <div className="d-flex align-items-center gap-2 text-muted">
                                        <FaClock />
                                        <span>Duration: {program.duration}</span>
                                    </div>
                                    <div className="d-flex align-items-center gap-2 text-muted">
                                        <FaUsers />
                                        <span>{program.learners}/{program.capacity} enrolled</span>
                                    </div>
                                </div>
                            </Col>
                            <Col lg={4} className="mt-4 mt-lg-0">
                                <Card className="bg-light border-0 shadow-sm">
                                    <Card.Body>
                                        <div className="text-center mb-3">
                                            <div className="h2 fw-bold text-primary mb-0">
                                                {program.price === 0 ? 'Free' : `$${program.price}`}
                                            </div>
                                            <div className="text-muted small">Program Fee</div>
                                        </div>
                                        <hr className="my-3" />
                                        <div className="text-center">
                                            <div className="mb-2">
                                                <strong>Enrollment Status</strong>
                                            </div>
                                            <Badge bg={getEnrollmentPercentage() >= 100 ? 'danger' : 'success'} className="px-3 py-2">
                                                {getEnrollmentPercentage() >= 100 ? 'Fully Booked' : `${getEnrollmentPercentage().toFixed(0)}% Filled`}
                                            </Badge>
                                        </div>
                                        <div className="small text-muted mt-3 text-center">
                                            <FaUsers className="me-1" />
                                            {program.capacity - program.learners} seats remaining
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Card.Body>
                </div>
            </Card>

            {/* Main Content Tabs */}
            <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-4 border-bottom"
                fill
            >
                <Tab eventKey="overview" title="Overview">
                    <Card className="border-0 shadow-sm">
                        <Card.Body>
                            <Row>
                                <Col lg={8}>
                                    <h4 className="mb-3">Program Description</h4>
                                    <p className="text-muted mb-4" style={{ lineHeight: '1.8' }}>
                                        {program.description}
                                    </p>
                                    
                                    <h4 className="mb-3">What Students Will Learn</h4>
                                    <ListGroup variant="flush" className="mb-4">
                                        {program.learningOutcomes?.map((outcome, idx) => (
                                            <ListGroup.Item key={idx} className="border-0 ps-0 py-2">
                                                <FaCheckCircle className="text-success me-2" />
                                                {outcome}
                                            </ListGroup.Item>
                                        )) || (
                                            <p className="text-muted">Learning outcomes will be updated soon.</p>
                                        )}
                                    </ListGroup>

                                    <h4 className="mb-3">Requirements</h4>
                                    <p className="text-muted mb-4">{program.requirements || 'No specific requirements.'}</p>
                                    
                                    <h4 className="mb-3">Tags</h4>
                                    <div className="d-flex flex-wrap gap-2 mb-4">
                                        {program.tags?.map((tag, idx) => (
                                            <Badge key={idx} bg="light" text="dark" className="px-3 py-2">
                                                #{tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </Col>
                                <Col lg={4}>
                                    <Card className="border-0 bg-light">
                                        <Card.Body>
                                            <h5 className="mb-3">Program Details</h5>
                                            <ListGroup variant="flush">
                                                <ListGroup.Item className="bg-transparent d-flex justify-content-between px-0 py-2">
                                                    <span>Start Date:</span>
                                                    <strong>{formatDate(program.startDate)}</strong>
                                                </ListGroup.Item>
                                                <ListGroup.Item className="bg-transparent d-flex justify-content-between px-0 py-2">
                                                    <span>End Date:</span>
                                                    <strong>{formatDate(program.endDate)}</strong>
                                                </ListGroup.Item>
                                                <ListGroup.Item className="bg-transparent d-flex justify-content-between px-0 py-2">
                                                    <span>Capacity:</span>
                                                    <strong>{program.capacity} learners</strong>
                                                </ListGroup.Item>
                                                <ListGroup.Item className="bg-transparent d-flex justify-content-between px-0 py-2">
                                                    <span>Current Enrollment:</span>
                                                    <strong>{program.learners} learners</strong>
                                                </ListGroup.Item>
                                                <ListGroup.Item className="bg-transparent d-flex justify-content-between px-0 py-2">
                                                    <span>Location:</span>
                                                    <strong>{program.location}</strong>
                                                </ListGroup.Item>
                                                <ListGroup.Item className="bg-transparent d-flex justify-content-between px-0 py-2">
                                                    <span>Program Type:</span>
                                                    <strong>{program.type}</strong>
                                                </ListGroup.Item>
                                            </ListGroup>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Tab>

                <Tab eventKey="schedule" title="Schedule">
                    <Card className="border-0 shadow-sm">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h4 className="mb-0">Program Schedule</h4>
                                <Button variant="outline-primary" size="sm">
                                    <FaEdit className="me-1" /> Edit Schedule
                                </Button>
                            </div>
                            {program.schedule?.length > 0 ? (
                                <div className="timeline">
                                    {program.schedule.map((item, idx) => (
                                        <div key={idx} className="mb-4 pb-3 border-bottom">
                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                <h5 className="mb-0">{item.title}</h5>
                                                <Badge bg="info" pill>
                                                    <FaCalendarAlt className="me-1" /> {item.date}
                                                </Badge>
                                            </div>
                                            <p className="text-muted mb-0">{item.description}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted text-center py-4">
                                    No schedule defined. Click "Edit Schedule" to add one.
                                </p>
                            )}
                        </Card.Body>
                    </Card>
                </Tab>

                <Tab eventKey="facilitator" title="Facilitator">
                    <Card className="border-0 shadow-sm">
                        <Card.Body>
                            <div className="d-flex justify-content-end mb-3">
                                <Button variant="outline-primary" size="sm">
                                    <FaEdit className="me-1" /> Edit Facilitator
                                </Button>
                            </div>
                            <Row>
                                <Col md={4} className="text-center mb-4 mb-md-0">
                                    <div className="bg-light rounded-circle d-inline-flex p-4 mb-3">
                                        <FaUserTie style={{ fontSize: '4rem' }} />
                                    </div>
                                    <h5>{program.facilitator}</h5>
                                    <Badge bg="secondary" className="mt-2">Lead Facilitator</Badge>
                                </Col>
                                <Col md={8}>
                                    <h4 className="mb-3">About the Facilitator</h4>
                                    <p className="text-muted" style={{ lineHeight: '1.8' }}>
                                        {program.facilitatorBio || 'Experienced professional with extensive knowledge in this field.'}
                                    </p>
                                    <h5 className="mb-2 mt-4">Areas of Expertise</h5>
                                    <div className="d-flex flex-wrap gap-2">
                                        {program.facilitatorExpertise?.map((skill, idx) => (
                                            <Badge key={idx} bg="light" text="dark" className="px-3 py-2">
                                                {skill}
                                            </Badge>
                                        )) || (
                                            <p className="text-muted">Expertise details coming soon.</p>
                                        )}
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Tab>

                <Tab eventKey="students" title="Enrolled Students">
                    <Card className="border-0 shadow-sm">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h4 className="mb-0">Enrolled Students ({program.learners})</h4>
                                <Button variant="outline-primary" size="sm">
                                    <FaDownload className="me-1" /> Export List
                                </Button>
                            </div>
                            {program.enrolledStudents?.length > 0 ? (
                                <div className="table-responsive">
                                    <table className="table table-hover">
                                        <thead className="bg-light">
                                            <tr>
                                                <th>Student Name</th>
                                                <th>Email</th>
                                                <th>Enrollment Date</th>
                                                <th>Progress</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {program.enrolledStudents.map((student, idx) => (
                                                <tr key={idx}>
                                                    <td className="fw-semibold">{student.name}</td>
                                                    <td>{student.email}</td>
                                                    <td>{formatDate(student.enrollmentDate)}</td>
                                                    <td>
                                                        <div className="d-flex align-items-center gap-2">
                                                            <div className="progress flex-grow-1" style={{ height: '6px' }}>
                                                                <div 
                                                                    className="progress-bar bg-success" 
                                                                    style={{ width: `${student.progress}%` }}
                                                                />
                                                            </div>
                                                            <span className="small">{student.progress}%</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <Button variant="link" size="sm" className="p-0 me-2">
                                                            <FaEye />
                                                        </Button>
                                                        <Button variant="link" size="sm" className="p-0">
                                                            <FaEnvelope />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <FaUsers className="text-muted mb-3" style={{ fontSize: '3rem' }} />
                                    <p className="text-muted mb-0">No students enrolled yet.</p>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Tab>

                <Tab eventKey="analytics" title="Analytics">
                    <Card className="border-0 shadow-sm">
                        <Card.Body>
                            <h4 className="mb-4">Program Analytics</h4>
                            <Row className="mb-4">
                                <Col md={4}>
                                    <Card className="bg-light border-0 text-center">
                                        <Card.Body>
                                            <FaChartLine className="text-primary mb-2" style={{ fontSize: '2rem' }} />
                                            <h3>{getEnrollmentPercentage().toFixed(0)}%</h3>
                                            <p className="text-muted mb-0">Enrollment Rate</p>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={4}>
                                    <Card className="bg-light border-0 text-center">
                                        <Card.Body>
                                            <FaUsers className="text-primary mb-2" style={{ fontSize: '2rem' }} />
                                            <h3>{program.learners}/{program.capacity}</h3>
                                            <p className="text-muted mb-0">Total Enrolled</p>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={4}>
                                    <Card className="bg-light border-0 text-center">
                                        <Card.Body>
                                            <FaCertificate className="text-primary mb-2" style={{ fontSize: '2rem' }} />
                                            <h3>0</h3>
                                            <p className="text-muted mb-0">Completed</p>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                            <div className="text-center py-3">
                                <Button variant="outline-primary">
                                    <FaChartLine className="me-2" /> View Detailed Analytics
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Tab>
            </Tabs>

            <style jsx>{`
                .timeline {
                    position: relative;
                    padding-left: 20px;
                }
                
                .timeline::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 0;
                    bottom: 0;
                    width: 2px;
                    background: linear-gradient(to bottom, #0d6efd, #0dcaf0);
                }
                
                .bg-gradient {
                    background-size: cover;
                    background-position: center;
                }
            `}</style>
        </Container>
    );
};

export default ProgramView;
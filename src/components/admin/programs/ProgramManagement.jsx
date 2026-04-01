import { useEffect, useState } from 'react';
import {
    Alert,
    Badge,
    Button,
    Card,
    Dropdown,
    Form,
    InputGroup,
    Pagination,
    ProgressBar,
    Table
} from 'react-bootstrap';
import {
    FaBook,
    FaClock,
    FaFilter,
    FaGraduationCap,
    FaMapMarkerAlt,
    FaPlus,
    FaSearch,
    FaUsers,
    FaUserTie
} from 'react-icons/fa';

// Import mock data
import { categories, statuses } from './mockPrograms';

// Import modals
import { Outlet, useNavigate } from 'react-router-dom';
import DeleteProgramModal from './DeleteProgramModal';
import ProgramFiltersOffcanvas from './ProgramFiltersOffcanvas';
import ProgramModal from './ProgramModal';
import ViewProgramModal from './ViewModalProgram';
import { apiFetch } from '@/api/api';
import { PROGRAMS } from '@/utils/apiEndpoint';

export default function ProgramManagement() {
    const [programs, setPrograms] = useState([]);
    const [filteredPrograms, setFilteredPrograms] = useState([]);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showFiltersOffcanvas, setShowFiltersOffcanvas] = useState(false);
    const [editingProgram, setEditingProgram] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedType, setSelectedType] = useState('all');
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });
    const [viewMode, setViewMode] = useState('list');
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [showModal, setShowModal] = useState(false)
    const [respose, setResponse] = useState(null);
    const navigate = useNavigate();

    const [programForm, setProgramForm] = useState({
        name: '',
        category: '',
        type: '',
        description: '',
        capacity: 30,
        status: 'NOTSTARTED',
        startDate: '',
        endDate: '',
        location: '',
    });

    useEffect(() => {
        getPrograms();
    }, [])

    const getPrograms = async () => {
        try {
            const result = await apiFetch(`${PROGRAMS}`, { method: 'GET', })
            setPrograms(result?.payload || []);
        } catch (error) {
            setResponse({ success: false, message: 'Failed to fetch programs' })
        }
    }

    const itemsPerPage = viewMode === 'grid' ? 8 : 10;

    // Filter and search programs
    useEffect(() => {
        let result = programs;

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(program =>
                program.name.toLowerCase().includes(term) ||
                program.description.toLowerCase().includes(term) ||
                program.facilitator.toLowerCase().includes(term) ||
                program.tags.some(tag => tag.toLowerCase().includes(term))
            );
        }

        if (selectedCategory !== 'all') {
            result = result.filter(program => program.category === selectedCategory);
        }

        if (selectedStatus !== 'all') {
            result = result.filter(program => program.status === selectedStatus);
        }

        if (selectedType !== 'all') {
            result = result.filter(program => program.type === selectedType);
        }

        result.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });

        setFilteredPrograms(result);
        setCurrentPage(1);
    }, [programs, searchTerm, selectedCategory, selectedStatus, selectedType, sortConfig]);

    const totalPages = Math.ceil(filteredPrograms.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentPrograms = filteredPrograms.slice(startIndex, startIndex + itemsPerPage);

    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const handleAddProgram = () => {
        resetForm();
        setEditingProgram(null);
        setShowModal(true);
    };

    const handleEditProgram = (program) => {
        setProgramForm({ ...program });
        setEditingProgram(program);
        setShowModal(true);
    };

    const resetForm = () => {
        setProgramForm({
            name: '',
            category: '',
            type: '',
            description: '',
            capacity: 30,
            status: 'NOTSTARTED',
            startDate: '',
            endDate: '',
            location: ''
        });
    };

    const handleSaveProgram = () => {
        setLoading(true);

        setTimeout(() => {
            if (editingProgram) {
                setPrograms(prev => prev.map(program =>
                    program.id === editingProgram.id ? { ...programForm, id: editingProgram.id } : program
                ));
                showAlert('Program updated successfully!', 'success');
            } else {
                const newProgram = {
                    ...programForm,
                    id: programs.length + 1,
                    learners: 0,
                    rating: 0,
                    enrolled: false
                };
                setPrograms(prev => [...prev, newProgram]);
                showAlert('Program created successfully!', 'success');
            }

            setLoading(false);
            setShowModal(false);
        }, 500);
    };

    const handleDeleteProgram = (program) => {
        setSelectedProgram(program);
        setShowDeleteModal(true);
    };



    const showAlert = (message, variant) => {
        setAlert({ show: true, message, variant });
        setTimeout(() => setAlert({ show: false, message: '', variant: 'success' }), 3000);
    };

    const getCategoryIcon = (category) => {
        const cat = categories.find(c => c.id === category);
        if (!cat) return <FaBook />;

        switch (cat.icon) {
            case 'FaBook': return <FaBook />;
            case 'FaUserTie': return <FaUserTie />;
            case 'FaGraduationCap': return <FaGraduationCap />;
            default: return <FaBook />;
        }
    };

    const getCategoryColor = (category) => {
        const cat = categories.find(c => c.id === category);
        return cat ? cat.color : 'gray';
    };

    const getStatusBadge = (status) => {
        const statusConfig = statuses.find(s => s.id === status);
        return (
            <Badge bg={statusConfig?.color || 'secondary'} className="rounded-md w-[90px]">
                {statusConfig?.label || status}
            </Badge>
        );
    };

    const getTypeBadge = (type) => {
        return (
            <Badge bg={'secondary'} className="rounded-md w-[90px] text-uppercase">
                {type}
            </Badge>
        );
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getActions = (program) => {
        return (
            <Dropdown>
                <Dropdown.Toggle
                    size="lg"
                    className="w-full z-[9999] bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-2 py-1 rounded-md inline-flex items-center justify-around"
                >
                    ACTION
                </Dropdown.Toggle>

                <Dropdown.Menu className="px-auto min-w-[140px] bg-slate-50 border border-gray-200 rounded-md shadow-lg">
                    {[
                        {
                            label: "VIEW",
                            event: () => { navigate(`${program?.id}`) },
                            style: "text-gray-800 hover:bg-gray-700",
                        },

                        {
                            label: "EDIT",
                            event: () => {handleEditProgram(program)},
                            style: "text-yellow-800 hover:bg-yellow-700",
                        },

                        {
                            label: "DELETE",
                            event: () => { handleDeleteProgram(program) },
                            style: "text-red-800 hover:bg-red-700",
                        },

                    ].map((action, idx) => (
                        <Dropdown.Item
                            key={idx}
                            onClick={action?.event}
                            className={action?.style + ' font-semibold hover:text-slate-50 rounded-md px-4 '}
                        >
                            {action?.label}
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
        )
    }

    const resetFilters = () => {
        setSelectedCategory('all');
        setSelectedStatus('all');
        setSelectedType('all');
        setSearchTerm('');
    };

    return (
        <div className="h-screen w-full  p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                                <FaBook className="text-red-600" />
                                Programs Management
                            </h1>
                            <p className="text-gray-600">Manage short courses, learnership programs, and internships</p>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                variant="outline-secondary"
                                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                                className="flex items-center gap-2"
                            >
                                {viewMode === 'grid' ? 'List View' : 'Grid View'}
                            </Button>
                            <Button
                                variant="outline-secondary"
                                onClick={() => setShowFiltersOffcanvas(true)}
                                className="flex items-center gap-2"
                            >
                                <FaFilter /> Filters
                            </Button>
                            <Button
                                onClick={handleAddProgram}
                                className="flex items-center gap-2"
                            >
                                <FaPlus /> Add Program
                            </Button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        {categories.map((category, idx) => {
                            const count = programs.filter(p => p.category === category.id).length;
                            const activeCount = programs.filter(p => p.category === category.id && p.status === 'active').length;
                            return (
                                <Card key={idx} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                                    <Card.Body className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-gray-600">{category.label}</p>
                                                <h3 className="text-2xl font-bold text-gray-800">{count}</h3>
                                            </div>
                                            <div className={`w-12 h-12 bg-${category.color}-100 rounded-lg flex items-center justify-center`}>
                                                <div className={`text-${category.color}-600 text-xl`}>
                                                    {getCategoryIcon(category.id)}
                                                </div>
                                            </div>
                                        </div>
                                        <ProgressBar
                                            now={(activeCount / count) * 100 || 0}
                                            className="mt-2 h-1.5"
                                            variant={category.color}
                                        />
                                        <p className="text-xs text-gray-500 mt-1">{activeCount} active</p>
                                    </Card.Body>
                                </Card>
                            );
                        })}
                    </div>
                </div>

                {/* Alert */}
                {alert.show && (
                    <Alert
                        variant={alert.variant}
                        onClose={() => setAlert({ ...alert, show: false })}
                        dismissible
                        className="mb-4"
                    >
                        {alert.message}
                    </Alert>
                )}

                {/* Search Bar */}
                <Card className="border-0 shadow-sm mb-6">
                    <Card.Body className="p-4">
                        <div className="flex gap-4">
                            <InputGroup className="flex-1">
                                <InputGroup.Text className="bg-white border-r-0">
                                    <FaSearch className="text-gray-500" />
                                </InputGroup.Text>
                                <Form.Control
                                    placeholder="Search programs by name, description, or tags..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="border-l-0  "
                                />
                            </InputGroup>
                            {(selectedCategory !== 'all' || selectedStatus !== 'all' || selectedType !== 'all' || searchTerm) && (
                                <Button variant="outline-danger" onClick={resetFilters}>
                                    Clear Filters
                                </Button>
                            )}
                        </div>
                    </Card.Body>
                </Card>


                {/* Programs Content */}
                {viewMode === 'grid' ? (
                    // Grid View
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6">
                        {currentPrograms.map(program => (
                            <Card key={program.id} className="border-0 shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
                                <Card.Body className="p-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className={`w-10 h-10 bg-${getCategoryColor(program.category)}-100 rounded-lg flex items-center justify-center`}>
                                            <div className={`text-${getCategoryColor(program.category)}-600`}>
                                                {getCategoryIcon(program.category)}
                                            </div>
                                        </div>
                                    </div>

                                    <h5 className="font-bold min-h-[2.5rem] text-gray-800 mb-2 line-clamp-2">{program.name}</h5>

                                    <div className="space-y-3 mb-4">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500 flex items-center gap-1">
                                                <FaUsers className="text-xs" /> Learners
                                            </span>
                                            <span className="font-medium">
                                                {program.enrolledCount}/{program.capacity}
                                            </span>
                                        </div>
                                        <ProgressBar
                                            now={(program.enrolledCount / program.capacity) * 100}
                                            variant={getCategoryColor(program.category)}
                                            className="h-1.5"
                                        />

                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500 flex items-center gap-1">
                                                <FaClock className="text-xs" /> Duration
                                            </span>
                                            <span className="font-medium">{program.duration}</span>
                                        </div>

                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500 flex items-center gap-1">
                                                <FaMapMarkerAlt className="text-xs" /> Location
                                            </span>
                                            <span className="font-medium">{program.location}</span>
                                        </div>

                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">Status</span>
                                            {getStatusBadge(program.status)}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    {getActions(program)}

                                </Card.Body>
                            </Card>
                        ))}
                    </div>
                ) : (
                    // List View
                    <Card className="border-0 shadow-sm ">
                        <Card.Body className="p-0">
                            <div className="">
                                <Table hover className="mb-0">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="border-0 px-4 py-3 text-gray-700 font-semibold cursor-pointer" onClick={() => handleSort('title')}>
                                                Program {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                            </th>
                                            <th className="border-0 px-4 py-3 text-gray-700 font-semibold cursor-pointer" onClick={() => handleSort('category')}>
                                                Category {sortConfig.key === 'category' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                            </th>
                                            <th className="border-0 px-4 py-3 text-gray-700 font-semibold cursor-pointer" onClick={() => handleSort('type')}>
                                                Type {sortConfig.key === 'type' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                            </th>
                                            <th className="border-0 px-4 py-3 text-gray-700 font-semibold cursor-pointer" onClick={() => handleSort('status')}>
                                                Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                            </th>
                                            <th className="border-0 px-4 py-3 text-gray-700 font-semibold cursor-pointer" onClick={() => handleSort('learners')}>
                                                Learners {sortConfig.key === 'learners' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                            </th>
                                            <th className="border-0 px-4 py-3 text-gray-700 font-semibold">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentPrograms.map(program => (
                                            <tr onClick={() => navigate(`${program?.id}`)} key={program.id} className="cursor-pointer hover:bg-red-50/30 border-b border-gray-100">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 bg-${getCategoryColor(program.category)}-100 rounded-md flex items-center justify-center`}>
                                                            <div className={`text-${getCategoryColor(program.category)}-600`}>
                                                                {getCategoryIcon(program.category)}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-gray-800">{program.name}</div>
                                                            <div className="text-sm text-gray-600">{program.facilitator}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <Badge bg="light" text="dark" className="border border-gray-200 px-3 py-1">
                                                        {program.category === 'SHORT_COURSE' ? 'Short Course' :
                                                            program.category === 'LEARNERSHIP' ? 'Learnership' : 'Internship'}
                                                    </Badge>
                                                </td>

                                                <td className="p-4 ">
                                                    {getTypeBadge(program.type)}
                                                </td>

                                                <td className="p-4 ">
                                                    {getStatusBadge(program.status)}
                                                </td>
                                                <td className="p-4">
                                                    <div>
                                                        <div className="font-medium">{program?.enrolledCount}/{program.capacity}</div>
                                                        <ProgressBar
                                                            now={(program.enrolledCount) / program.capacity * 100}
                                                            variant={getCategoryColor(program.category)}
                                                            className="h-1 mt-1 w-24"
                                                        />
                                                    </div>
                                                </td>
                                                <td onClick={(e)=>e.stopPropagation()} className="p-4">
                                                    {getActions(program)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>

                            {/* Empty State */}
                            {filteredPrograms.length === 0 && (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <FaBook className="text-gray-400 text-2xl" />
                                    </div>
                                    <h4 className="text-gray-700 font-medium mb-2">No programs found</h4>
                                    <p className="text-gray-500 mb-4">Try adjusting your filters or add a new program</p>
                                    <Button variant="primary" onClick={handleAddProgram}>
                                        <FaPlus className="me-2" /> Add First Program
                                    </Button>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                )}

                {/* Pagination */}
                {filteredPrograms.length > 0 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between py-6 gap-4">
                        <div className="text-sm text-gray-600">
                            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredPrograms.length)} of {filteredPrograms.length} programs
                        </div>
                        <Pagination className="mb-0">
                            <Pagination.Prev
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            />
                            {[...Array(totalPages)].map((_, idx) => (
                                <Pagination.Item
                                    key={idx + 1}
                                    active={idx + 1 === currentPage}
                                    onClick={() => setCurrentPage(idx + 1)}
                                >
                                    {idx + 1}
                                </Pagination.Item>
                            ))}
                            <Pagination.Next
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            />
                        </Pagination>
                    </div>
                )}
            </div>

            {/* Modals and Offcanvas */}
            <ProgramModal
                show={showModal}
                onHide={() => setShowModal(false)}
                programForm={programForm}
                setProgramForm={setProgramForm}
                editingProgram={editingProgram}
                onSave={handleSaveProgram}
                getPrograms={getPrograms}
            />

            <ViewProgramModal
                show={showViewModal}
                onHide={() => setShowViewModal(false)}
                program={selectedProgram}
                onEdit={handleEditProgram}
                getCategoryIcon={getCategoryIcon}
                getStatusBadge={getStatusBadge}
            />

            <DeleteProgramModal
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                program={selectedProgram}
                setResponse={setResponse}
                getPrograms={getPrograms}
            />

            <ProgramFiltersOffcanvas
                show={showFiltersOffcanvas}
                onHide={() => setShowFiltersOffcanvas(false)}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                onApply={() => setShowFiltersOffcanvas(false)}
                onReset={resetFilters}
            />
        </div>
    );
}
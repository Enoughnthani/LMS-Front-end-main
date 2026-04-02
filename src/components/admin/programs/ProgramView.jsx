import { apiFetch } from '@/api/api';
import { BASE_URL, PROGRAMS, USERS } from '@/utils/apiEndpoint';
import { useEffect, useState } from 'react';
import {
    FaArrowLeft,
    FaAward,
    FaBuilding,
    FaCalendarAlt,
    FaChalkboardTeacher,
    FaChartLine,
    FaDownload,
    FaEdit,
    FaEnvelope,
    FaEye,
    FaGraduationCap,
    FaMapMarkerAlt,
    FaPlus,
    FaSearch,
    FaTimesCircle,
    FaTrash,
    FaUserPlus,
    FaUsers,
    FaFilter,
    FaUserGraduate,
    FaUser,
    FaVenusMars,
    FaEnvelope as FaEnvelopeIcon,
    FaPhone,
    FaIdCard
} from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';

const ProgramViewAdmin = ({ onEdit, onDelete }) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [program, setProgram] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [error, setError] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Enrollment modal states
    const [showEnrollModal, setShowEnrollModal] = useState(false);
    const [allLearners, setAllLearners] = useState([]);
    const [filteredLearners, setFilteredLearners] = useState([]);
    const [learnerSearchTerm, setLearnerSearchTerm] = useState('');
    const [loadingLearners, setLoadingLearners] = useState(false);
    const [enrolledLearnerIds, setEnrolledLearnerIds] = useState([]);
    const [enrollingId, setEnrollingId] = useState(null);
    
    // Filter states
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        gender: '',
        status: '',
        searchBy: 'name' // 'name', 'email', 'idNo'
    });

    // Instructor management states
    const [showInstructorModal, setShowInstructorModal] = useState(false);
    const [instructorForm, setInstructorForm] = useState({
        name: '',
        email: '',
        phone: '',
        expertise: '',
        bio: ''
    });

    const [enrolledStudents, setEnrolledStudents] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProgram();
        fetchEnrolledStudents();
        fetchInstructors();
    }, [id]);

    const fetchProgram = async () => {
        setLoading(true);
        try {
            const result = await apiFetch(`${PROGRAMS}/${id}`);
            if (result?.payload) {
                setProgram(result.payload);
            } else {
                setError('Program not found');
            }
        } catch (error) {
            console.error('Error fetching program:', error);
            setError('Failed to load program details');
        } finally {
            setLoading(false);
        }
    };

    const fetchEnrolledStudents = async () => {
        try {
            // Replace with your actual endpoint to get enrolled learners for this program
            const result = await apiFetch(`${PROGRAMS}/${id}/enrollments`);
            const enrolled = result?.payload || [];
            setEnrolledStudents(enrolled);
            const enrolledIds = enrolled.map(student => student.learnerId || student.id);
            setEnrolledLearnerIds(enrolledIds);
        } catch (error) {
            console.error('Error fetching enrollments:', error);
        }
    };

    const fetchInstructors = async () => {
        try {
            // Mock API call - replace with actual endpoint
            const result = await apiFetch(`${PROGRAMS}/${id}/instructors`);
            setInstructors(result?.payload || []);
        } catch (error) {
            console.error('Error fetching instructors:', error);
        }
    };

    const fetchAllLearners = async () => {
        setLoadingLearners(true);
        try {
            // Fetch learners based on program category
            const endpoint = program?.category === 'INTERNSHIP' ? '/interns' : '/learners';
            const result = await apiFetch(`${USERS}${endpoint}`);
            if (result?.payload) {
                setAllLearners(result.payload);
                setFilteredLearners(result.payload);
            }
        } catch (error) {
            console.error('Error fetching learners:', error);
        } finally {
            setLoadingLearners(false);
        }
    };

    // Open enrollment modal and fetch learners
    const openEnrollModal = () => {
        setShowEnrollModal(true);
        fetchAllLearners();
        setLearnerSearchTerm('');
        setFilters({ gender: '', status: '', searchBy: 'name' });
        setShowFilters(false);
    };

    // Filter and search learners
    useEffect(() => {
        let filtered = [...allLearners];
        
        // Apply search
        if (learnerSearchTerm) {
            filtered = filtered.filter(learner => {
                const searchLower = learnerSearchTerm.toLowerCase();
                switch (filters.searchBy) {
                    case 'email':
                        return learner.email?.toLowerCase().includes(searchLower);
                    case 'idNo':
                        return learner.idNo?.toLowerCase().includes(searchLower);
                    default:
                        return learner.firstname?.toLowerCase().includes(searchLower) ||
                               learner.lastname?.toLowerCase().includes(searchLower) ||
                               `${learner.firstname} ${learner.lastname}`.toLowerCase().includes(searchLower);
                }
            });
        }
        
        // Apply gender filter
        if (filters.gender) {
            filtered = filtered.filter(learner => learner.gender === filters.gender);
        }
        
        // Apply status filter
        if (filters.status) {
            filtered = filtered.filter(learner => learner.status === filters.status);
        }
        
        setFilteredLearners(filtered);
    }, [learnerSearchTerm, filters, allLearners]);

    const handleEnroll = async (learner) => {
        setEnrollingId(learner.id);
        try {
            const enrollmentData = {
                programId: program.id,
                learnerId: learner.id,
                type: program?.category === 'INTERNSHIP' ? 'intern' : 'learner'
            };
            
            await apiFetch(`${PROGRAMS}/${id}/enroll`, {
                method: 'POST',
                body: enrollmentData
            });
            
            // Update local states
            setEnrolledLearnerIds([...enrolledLearnerIds, learner.id]);
            const newEnrolledStudent = {
                id: learner.id,
                name: `${learner.firstname} ${learner.lastname}`,
                email: learner.email,
                phone: learner.contactNumber,
                enrollmentDate: new Date().toISOString(),
                progress: 0
            };
            setEnrolledStudents([...enrolledStudents, newEnrolledStudent]);
            
            // Update program enrolled count
            setProgram({
                ...program,
                enrolledCount: program.enrolledCount + 1
            });
            
            // Show success message (optional)
            alert(`${learner.firstname} ${learner.lastname} has been enrolled successfully!`);
            
        } catch (error) {
            console.error('Error enrolling learner:', error);
            alert('Failed to enroll learner. Please try again.');
        } finally {
            setEnrollingId(null);
        }
    };

    const handleAddInstructor = async (e) => {
        e.preventDefault();
        try {
            await apiFetch(`${PROGRAMS}/${id}/instructors`, {
                method: 'POST',
                body: JSON.stringify(instructorForm)
            });
            setShowInstructorModal(false);
            fetchInstructors();
            setInstructorForm({ name: '', email: '', phone: '', expertise: '', bio: '' });
        } catch (error) {
            console.error('Error adding instructor:', error);
        }
    };

    const getCategoryColor = (category) => {
        const colors = {
            'SHORT-COURSE': 'from-blue-500 to-blue-600',
            'LEARNERSHIP': 'from-emerald-500 to-emerald-600',
            'INTERNSHIP': 'from-sky-500 to-sky-600'
        };
        return colors[category] || 'from-gray-500 to-gray-600';
    };

    const getCategoryBadgeColor = (category) => {
        const colors = {
            'SHORT-COURSE': 'bg-blue-100 text-blue-800',
            'LEARNERSHIP': 'bg-emerald-100 text-emerald-800',
            'INTERNSHIP': 'bg-amber-100 text-amber-800'
        };
        return colors[category] || 'bg-gray-100 text-gray-800';
    };

    const getStatusColor = (status) => {
        const colors = {
            'NOTSTARTED': 'bg-gray-100 text-gray-800',
            'INPROGRESS': 'bg-blue-100 text-blue-800',
            'COMPLETED': 'bg-green-100 text-green-800',
            'CANCELLED': 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusText = (status) => {
        const texts = {
            'NOTSTARTED': 'Not Started',
            'INPROGRESS': 'In Progress',
            'COMPLETED': 'Completed',
            'CANCELLED': 'Cancelled'
        };
        return texts[status] || status;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'TBD';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getEnrollmentPercentage = () => {
        if (!program?.capacity) return 0;
        return (program.enrolledCount / program.capacity) * 100;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                    <p className="mt-4 text-gray-600">Loading program details...</p>
                </div>
            </div>
        );
    }

    if (error || !program) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg shadow-sm">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <FaTimesCircle className="h-6 w-6 text-yellow-400" />
                            </div>
                            <div className="ml-3">
                                <h3 className="text-lg font-medium text-yellow-800">
                                    {error || 'Program Not Found'}
                                </h3>
                                <p className="mt-2 text-sm text-yellow-700">
                                    {error || "The program you're looking for doesn't exist or has been removed."}
                                </p>
                                <div className="mt-4">
                                    <button
                                        onClick={() => navigate('/user/admin/programs')}
                                        className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition"
                                    >
                                        <FaArrowLeft className="mr-2" /> Back to Programs
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <FaTrash className="text-red-600 text-xl" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Delete Program?</h3>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete "{program.name}"? This action cannot be undone and will remove all associated data.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => onDelete && onDelete(program)}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Enroll Modal - Updated Version */}
            {showEnrollModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-6 border-b border-gray-200">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">
                                    Enroll {program.category === 'INTERNSHIP' ? 'Interns' : 'Learners'}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    Select from existing {program.category === 'INTERNSHIP' ? 'interns' : 'learners'} to enroll in this program
                                </p>
                            </div>
                            <button
                                onClick={() => setShowEnrollModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <FaTimesCircle className="text-xl" />
                            </button>
                        </div>

                        {/* Search and Filters Bar */}
                        <div className="p-6 border-b border-gray-200 bg-gray-50">
                            <div className="flex flex-wrap gap-4">
                                {/* Search Input */}
                                <div className="flex-1 min-w-[200px]">
                                    <div className="relative">
                                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder={`Search by ${filters.searchBy === 'name' ? 'name' : filters.searchBy === 'email' ? 'email' : 'ID number'}...`}
                                            value={learnerSearchTerm}
                                            onChange={(e) => setLearnerSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                {/* Search By Dropdown */}
                                <select
                                    value={filters.searchBy}
                                    onChange={(e) => setFilters({ ...filters, searchBy: e.target.value })}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="name">Search by Name</option>
                                    <option value="email">Search by Email</option>
                                    <option value="idNo">Search by ID Number</option>
                                </select>

                                {/* Filter Toggle Button */}
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={`inline-flex items-center gap-2 px-4 py-2 border rounded-lg transition ${
                                        showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    <FaFilter /> Filters
                                    {(filters.gender || filters.status) && (
                                        <span className="ml-1 w-2 h-2 bg-blue-600 rounded-full"></span>
                                    )}
                                </button>
                            </div>

                            {/* Advanced Filters */}
                            {showFilters && (
                                <div className="mt-4 flex flex-wrap gap-4 pt-4 border-t border-gray-200">
                                    <div className="flex-1 min-w-[150px]">
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Gender</label>
                                        <select
                                            value={filters.gender}
                                            onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                        >
                                            <option value="">All Genders</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div className="flex-1 min-w-[150px]">
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                                        <select
                                            value={filters.status}
                                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                        >
                                            <option value="">All Status</option>
                                            <option value="ACTIVE">Active</option>
                                            <option value="INACTIVE">Inactive</option>
                                            <option value="SUSPENDED">Suspended</option>
                                        </select>
                                    </div>
                                    <div className="flex items-end">
                                        <button
                                            onClick={() => setFilters({ gender: '', status: '', searchBy: 'name' })}
                                            className="px-3 py-2 text-sm text-red-600 hover:text-red-700"
                                        >
                                            Clear Filters
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Learners List */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {loadingLearners ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
                                </div>
                            ) : filteredLearners.length > 0 ? (
                                <div className="grid gap-3">
                                    {filteredLearners.map((learner) => {
                                        const isEnrolled = enrolledLearnerIds.includes(learner.id);
                                        const isEnrolling = enrollingId === learner.id;
                                        
                                        return (
                                            <div
                                                key={learner.id}
                                                className={`flex items-center justify-between p-4 border rounded-xl transition-all ${
                                                    isEnrolled ? 'bg-gray-50 border-gray-200' : 'hover:shadow-md border-gray-200 hover:border-blue-200'
                                                }`}
                                            >
                                                <div className="flex items-start gap-4 flex-1">
                                                    {/* Avatar */}
                                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                                                        {learner.firstname?.charAt(0)}{learner.lastname?.charAt(0)}
                                                    </div>
                                                    
                                                    {/* Learner Info */}
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                                            <h4 className="font-semibold text-gray-900">
                                                                {learner.firstname} {learner.lastname}
                                                            </h4>
                                                            <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                                                                {learner.role?.join(', ')}
                                                            </span>
                                                            {learner.status === 'ACTIVE' ? (
                                                                <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">Active</span>
                                                            ) : (
                                                                <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full">Inactive</span>
                                                            )}
                                                        </div>
                                                        
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                                                            <div className="flex items-center gap-2">
                                                                <FaEnvelopeIcon className="w-3 h-3" />
                                                                <span>{learner.email}</span>
                                                            </div>
                                                            {learner.contactNumber && (
                                                                <div className="flex items-center gap-2">
                                                                    <FaPhone className="w-3 h-3" />
                                                                    <span>{learner.contactNumber}</span>
                                                                </div>
                                                            )}
                                                            {learner.gender && (
                                                                <div className="flex items-center gap-2">
                                                                    <FaVenusMars className="w-3 h-3" />
                                                                    <span>{learner.gender}</span>
                                                                </div>
                                                            )}
                                                            {learner.idNo && (
                                                                <div className="flex items-center gap-2">
                                                                    <FaIdCard className="w-3 h-3" />
                                                                    <span>{learner.idNo}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        
                                                        {learner.dob && (
                                                            <p className="text-xs text-gray-400 mt-1">
                                                                DOB: {formatDate(learner.dob)}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                {/* Action Button */}
                                                <div className="ml-4">
                                                    {isEnrolled ? (
                                                        <button
                                                            disabled
                                                            className="px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed flex items-center gap-2"
                                                        >
                                                            <FaUserPlus /> Enrolled
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleEnroll(learner)}
                                                            disabled={isEnrolling}
                                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50"
                                                        >
                                                            {isEnrolling ? (
                                                                <>
                                                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                                                    Enrolling...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <FaUserPlus /> Enroll
                                                                </>
                                                            )}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <FaUsers className="text-gray-300 text-5xl mx-auto mb-4" />
                                    <p className="text-gray-500 mb-2">No {program.category === 'INTERNSHIP' ? 'interns' : 'learners'} found</p>
                                    <p className="text-sm text-gray-400 mb-4">
                                        {learnerSearchTerm || filters.gender || filters.status 
                                            ? "Try adjusting your search or filters" 
                                            : "No users available for enrollment"}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer with Create User Button */}
                        <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
                            <button
                                onClick={() => {
                                    setShowEnrollModal(false);
                                    navigate('/user/admin/user-management/create', { 
                                        state: { 
                                            userType: program?.category === 'INTERNSHIP' ? 'intern' : 'learner',
                                            returnTo: `/user/admin/programs/${id}`
                                        } 
                                    });
                                }}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                            >
                                <FaUserPlus /> Create New {program.category === 'INTERNSHIP' ? 'Intern' : 'Learner'}
                            </button>
                            <button
                                onClick={() => setShowEnrollModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Instructor/Mentor Modal */}
            {showInstructorModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-900">
                                {program.category === 'INTERNSHIP' ? 'Add Mentor' : 'Add Facilitator'}
                            </h3>
                            <button
                                onClick={() => setShowInstructorModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <FaTimesCircle />
                            </button>
                        </div>
                        <form onSubmit={handleAddInstructor}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={instructorForm.name}
                                        onChange={(e) => setInstructorForm({ ...instructorForm, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={instructorForm.email}
                                        onChange={(e) => setInstructorForm({ ...instructorForm, email: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        value={instructorForm.phone}
                                        onChange={(e) => setInstructorForm({ ...instructorForm, phone: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Areas of Expertise
                                    </label>
                                    <input
                                        type="text"
                                        value={instructorForm.expertise}
                                        onChange={(e) => setInstructorForm({ ...instructorForm, expertise: e.target.value })}
                                        placeholder="e.g., Java, Python, Web Development"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Bio
                                    </label>
                                    <textarea
                                        rows="3"
                                        value={instructorForm.bio}
                                        onChange={(e) => setInstructorForm({ ...instructorForm, bio: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 justify-end mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowInstructorModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                >
                                    {program.category === 'INTERNSHIP' ? 'Add Mentor' : 'Add Facilitator'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Rest of your existing component JSX remains the same */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
                {/* Header Navigation */}
                <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                    <button
                        onClick={() => navigate('/user/admin/programs')}
                        className="rounded inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition group"
                    >
                        <FaArrowLeft className="group-hover:-translate-x-1 transition" />
                        Back to Programs
                    </button>
                    <div className="flex gap-3">
                        <button
                            onClick={openEnrollModal}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-sm"
                        >
                            <FaUserPlus /> Enroll {program.category === 'INTERNSHIP' ? 'Intern' : 'Learner'}
                        </button>
                        <button
                            onClick={() => setShowInstructorModal(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition shadow-sm"
                        >
                            <FaChalkboardTeacher /> 
                            {program.category === 'INTERNSHIP' ? 'Add Mentor' : 'Add Facilitator'}
                        </button>
                        {onEdit && (
                            <button
                                onClick={() => onEdit(program)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
                            >
                                <FaEdit /> Edit Program
                            </button>
                        )}
                        {onDelete && (
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow-sm"
                            >
                                <FaTrash /> Delete
                            </button>
                        )}
                    </div>
                </div>

                {/* Hero Section - Keep your existing hero section code */}
                <div className="relative rounded-2xl overflow-hidden shadow-xl mb-8">
                    <div className="absolute inset-0">
                        <img
                            src={`${BASE_URL}${program.imageBase64}`}
                            alt={program.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className={`absolute inset-0 bg-gradient-to-r ${getCategoryColor(program.category)} opacity-70`} />

                    <div className="relative px-6 py-12 lg:py-16">
                        <div className="flex flex-col lg:flex-row gap-8 items-start">
                            <div className="flex-1 space-y-6">
                                <div className="flex flex-wrap gap-3">
                                    <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${getCategoryBadgeColor(program.category)}`}>
                                        {program.category}
                                    </span>
                                    <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${getStatusColor(program.status)}`}>
                                        {getStatusText(program.status)}
                                    </span>
                                    {program.featured && (
                                        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium bg-amber-100 text-amber-800">
                                            <FaAward className="w-3 h-3" /> Featured
                                        </span>
                                    )}
                                </div>

                                <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                                    {program.name}
                                </h1>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2 text-white/90 text-sm">
                                        <FaMapMarkerAlt className="w-4 h-4" />
                                        <span>{program.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-white/90 text-sm">
                                        <FaCalendarAlt className="w-4 h-4" />
                                        <span>{formatDate(program.startDate)} - {formatDate(program.endDate)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-white/90 text-sm">
                                        <FaBuilding className="w-4 h-4" />
                                        <span>Type: {program.type}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-white/90 text-sm">
                                        <FaUsers className="w-4 h-4" />
                                        <span>{program.enrolledCount}/{program.capacity} enrolled</span>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Card */}
                            <div className="w-full lg:w-80">
                                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                                    <div className="text-center space-y-4">
                                        <div className="text-white/80 text-sm font-medium">Enrollment Status</div>
                                        <div className={`inline-flex px-4 py-2 rounded-full text-sm font-semibold ${getEnrollmentPercentage() >= 100 ? 'bg-red-500/20 text-red-200' : 'bg-emerald-500/20 text-emerald-200'}`}>
                                            {getEnrollmentPercentage() >= 100 ? 'Fully Booked' : `${getEnrollmentPercentage().toFixed(0)}% Filled`}
                                        </div>
                                        {getEnrollmentPercentage() < 100 && (
                                            <div className="mt-2">
                                                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                                                        style={{ width: `${getEnrollmentPercentage()}%` }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        <div className="text-white/60 text-xs flex items-center justify-center gap-1">
                                            <FaUsers className="w-3 h-3" />
                                            {program.capacity - program.enrolledCount} seats remaining
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Tab Navigation */}
                <div className="mb-6 border-b border-gray-200">
                    <nav className="flex gap-6 overflow-x-auto">
                        {[
                            { key: 'overview', label: 'Overview' },
                            {
                                key: 'mentors',
                                label: program?.category === 'INTERNSHIP' ? 'Mentors' : 'Facilitators'
                            },
                            {
                                key: 'participants',
                                label: program?.category === 'INTERNSHIP' ? 'Interns' : 'Learners'
                            },
                            { key: 'analytics', label: 'Analytics' }
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`pb-3 bg-white px-1 text-sm font-medium transition-colors relative ${
                                    activeTab === tab.key
                                        ? 'text-blue-600 border-b-2 border-blue-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Tab Content - Keep your existing tab content */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <div className="p-6 lg:p-8">
                            <div className="grid lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2">
                                    <div
                                        className="prose prose-blue max-w-none text-gray-600 leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: program.description }}
                                    />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Program Details</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between py-2 border-b border-gray-100">
                                            <span className="text-gray-500">Start Date</span>
                                            <span className="font-medium text-gray-900">{formatDate(program.startDate)}</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-gray-100">
                                            <span className="text-gray-500">End Date</span>
                                            <span className="font-medium text-gray-900">{formatDate(program.endDate)}</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-gray-100">
                                            <span className="text-gray-500">Capacity</span>
                                            <span className="font-medium text-gray-900">{program.capacity} seats</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-gray-100">
                                            <span className="text-gray-500">Current Enrollment</span>
                                            <span className="font-medium text-gray-900">{program.enrolledCount} enrolled</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-gray-100">
                                            <span className="text-gray-500">Location</span>
                                            <span className="font-medium text-gray-900 truncate px-1">{program.location}</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-gray-100">
                                            <span className="text-gray-500">Program Type</span>
                                            <span className="font-medium text-gray-900">{program.type}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Mentors/Facilitators Tab */}
                    {activeTab === 'mentors' && (
                        <div className="p-6 lg:p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Program {program.category === 'INTERNSHIP' ? 'Mentors' : 'Facilitators'}
                                </h3>
                                <button
                                    onClick={() => setShowInstructorModal(true)}
                                    className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                >
                                    <FaPlus className="w-3 h-3" />
                                    {program.category === 'INTERNSHIP' ? 'Add Mentor' : 'Add Facilitator'}
                                </button>
                            </div>
                            {instructors.length > 0 ? (
                                <div className="grid md:grid-cols-2 gap-6">
                                    {instructors.map((instructor, idx) => (
                                        <div key={idx} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition">
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                                    {instructor.name.charAt(0)}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-gray-900">{instructor.name}</h4>
                                                    <p className="text-sm text-gray-500">{instructor.email}</p>
                                                    {instructor.phone && (
                                                        <p className="text-sm text-gray-500 mt-1">{instructor.phone}</p>
                                                    )}
                                                    {instructor.expertise && (
                                                        <div className="mt-2 flex flex-wrap gap-1">
                                                            {instructor.expertise.split(',').map((skill, i) => (
                                                                <span key={i} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                                                                    {skill.trim()}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {instructor.bio && (
                                                        <p className="text-sm text-gray-600 mt-2">{instructor.bio}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <FaChalkboardTeacher className="text-gray-300 text-5xl mx-auto mb-4" />
                                    <p className="text-gray-500">No {program.category === 'INTERNSHIP' ? 'mentors' : 'facilitators'} assigned yet</p>
                                    <p className="text-sm text-gray-400 mt-1">
                                        Click "{program.category === 'INTERNSHIP' ? 'Add Mentor' : 'Add Facilitator'}" to assign someone to this program
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Participants Tab */}
                    {activeTab === 'participants' && (
                        <div className="p-6 lg:p-8">
                            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Enrolled {program.category === 'INTERNSHIP' ? 'Interns' : 'Learners'} ({enrolledStudents.length})
                                </h3>
                                <div className="flex gap-3">
                                    <div className="relative">
                                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            type="text"
                                            placeholder="Search students..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <button className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                                        <FaDownload className="w-3 h-3" /> Export
                                    </button>
                                </div>
                            </div>
                            {enrolledStudents.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 border-b border-gray-200">
                                            <tr>
                                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Student Name</th>
                                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Email</th>
                                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Phone</th>
                                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Enrollment Date</th>
                                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Progress</th>
                                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {enrolledStudents.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())).map((student, idx) => (
                                                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                                    <td className="py-3 px-4 font-medium text-gray-900">{student.name}</td>
                                                    <td className="py-3 px-4 text-gray-600">{student.email}</td>
                                                    <td className="py-3 px-4 text-gray-600">{student.phone || '-'}</td>
                                                    <td className="py-3 px-4 text-gray-600">{formatDate(student.enrollmentDate)}</td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-full bg-green-500 rounded-full"
                                                                    style={{ width: `${student.progress || 0}%` }}
                                                                />
                                                            </div>
                                                            <span className="text-xs text-gray-600">{student.progress || 0}%</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex gap-2">
                                                            <button className="text-blue-600 hover:text-blue-800">
                                                                <FaEnvelope />
                                                            </button>
                                                            <button className="text-gray-600 hover:text-gray-800">
                                                                <FaEye />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <FaUsers className="text-gray-300 text-5xl mx-auto mb-4" />
                                    <p className="text-gray-500">No {program.category === 'INTERNSHIP' ? 'interns' : 'learners'} enrolled yet</p>
                                    <button
                                        onClick={openEnrollModal}
                                        className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                    >
                                        <FaUserPlus /> Enroll First {program.category === 'INTERNSHIP' ? 'Intern' : 'Learner'}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Analytics Tab */}
                    {activeTab === 'analytics' && (
                        <div className="p-6 lg:p-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">Program Analytics</h3>
                            <div className="grid md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center">
                                    <FaChartLine className="text-blue-600 text-3xl mx-auto mb-3" />
                                    <div className="text-2xl font-bold text-gray-900">{getEnrollmentPercentage().toFixed(0)}%</div>
                                    <p className="text-sm text-gray-600 mt-1">Enrollment Rate</p>
                                </div>
                                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-center">
                                    <FaUsers className="text-green-600 text-3xl mx-auto mb-3" />
                                    <div className="text-2xl font-bold text-gray-900">{program.enrolledCount}/{program.capacity}</div>
                                    <p className="text-sm text-gray-600 mt-1">Total Enrolled</p>
                                </div>
                                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 text-center">
                                    <FaGraduationCap className="text-purple-600 text-3xl mx-auto mb-3" />
                                    <div className="text-2xl font-bold text-gray-900">0</div>
                                    <p className="text-sm text-gray-600 mt-1">Completed</p>
                                </div>
                            </div>
                            <div className="text-center pt-4">
                                <button className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                                    <FaChartLine /> View Detailed Analytics Report
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProgramViewAdmin;
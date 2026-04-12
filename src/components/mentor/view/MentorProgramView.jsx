import React, { useState } from 'react';
import {
    FiUsers, FiCalendar, FiMapPin, FiClock, FiBookOpen,
    FiUserCheck, FiUserPlus, FiMail, FiPhone, FiMoreVertical,
    FiSearch, FiFilter, FiDownload, FiChevronLeft, FiChevronRight
} from 'react-icons/fi';
import {
    FaChalkboardTeacher, FaUserGraduate, FaChartLine,
    FaCheckCircle, FaClock, FaStar, FaEnvelope
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const MentorProgramView = () => {
    const navigate = useNavigate()
    const [mentorData] = useState({
        "active": true,
        "assignedPrograms": [
            {
                "assignedDate": "2026-04-12T20:17:39",
                "assignedRoles": ["MENTOR"],
                "capacity": 30,
                "category": "INTERNSHIP",
                "description": "<p>This</p>",
                "endDate": "2026-04-12",
                "enrolledCount": 0,
                "enrollmentData": [],
                "id": 14,
                "imageUrl": "/uploads/programs/0a386bf3-6c89-4c56-a13c-fe126ff54ab5.jpg",
                "location": "2394 Aubry Matlakala Street 0152",
                "name": "Business HR",
                "startDate": "2026-04-12",
                "status": "NOT_STARTED",
                "type": "BUSINESS"
            }
        ],
        "contactNumber": "0672181960",
        "createdAt": "2026-04-12T18:15:55.000Z",
        "dob": "2001-04-17",
        "email": "enoughnthani@email.co.za",
        "firstname": "Enough Tonny",
        "lastname": "Nthani",
        "gender": "Male",
        "id": 68,
        "idNo": "0104179303187",
        "lastLogin": "2026-04-12T20:18:47",
        "role": ["MENTOR"],
        "status": "ACTIVE"
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Mock learners data (would come from API)
    const [learners] = useState([
        {
            id: 1,
            firstname: "Thabo",
            lastname: "Mbeki",
            email: "thabo.mbeki@email.com",
            phone: "0712345678",
            enrolledDate: "2026-04-12",
            progress: 45,
            status: "Active",
            attendance: 85,
            lastActive: "2026-04-12T14:30:00"
        },
        {
            id: 2,
            firstname: "Lerato",
            lastname: "Dlamini",
            email: "lerato.dlamini@email.com",
            phone: "0723456789",
            enrolledDate: "2026-04-12",
            progress: 62,
            status: "Active",
            attendance: 92,
            lastActive: "2026-04-12T15:45:00"
        },
        {
            id: 3,
            firstname: "Sipho",
            lastname: "Nkosi",
            email: "sipho.nkosi@email.com",
            phone: "0734567890",
            enrolledDate: "2026-04-12",
            progress: 38,
            status: "Active",
            attendance: 70,
            lastActive: "2026-04-12T10:15:00"
        },
        {
            id: 4,
            firstname: "Nomsa",
            lastname: "Khumalo",
            email: "nomsa.khumalo@email.com",
            phone: "0745678901",
            enrolledDate: "2026-04-11",
            progress: 78,
            status: "Active",
            attendance: 95,
            lastActive: "2026-04-12T16:20:00"
        },
        {
            id: 5,
            firstname: "Andile",
            lastname: "Cele",
            email: "andile.cele@email.com",
            phone: "0756789012",
            enrolledDate: "2026-04-10",
            progress: 28,
            status: "Inactive",
            attendance: 45,
            lastActive: "2026-04-10T09:00:00"
        }
    ]);

    const program = mentorData.assignedPrograms[0];

    // Filter learners
    const filteredLearners = learners.filter(intern =>
        `${intern.firstname} ${intern.lastname}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        intern.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination
    const totalPages = Math.ceil(filteredLearners.length / itemsPerPage);
    const paginatedLearners = filteredLearners.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Statistics
    const stats = {
        totalLearners: learners.length,
        activeLearners: learners.filter(l => l.status === 'Active').length,
        averageProgress: Math.round(learners.reduce((acc, l) => acc + l.progress, 0) / learners.length),
        averageAttendance: Math.round(learners.reduce((acc, l) => acc + l.attendance, 0) / learners.length)
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Get progress color
    const getProgressColor = (progress) => {
        if (progress >= 75) return 'bg-emerald-500';
        if (progress >= 50) return 'bg-blue-500';
        if (progress >= 25) return 'bg-amber-500';
        return 'bg-red-500';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                                {program.name.charAt(0)}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">{program.name}</h1>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="text-sm text-gray-500 flex items-center gap-1">
                                        <FiCalendar size={14} />
                                        {formatDate(program.startDate)} - {formatDate(program.endDate)}
                                    </span>
                                    <span className="text-sm text-gray-500 flex items-center gap-1">
                                        <FiMapPin size={14} />
                                        {program.location.split(',')[0]}
                                    </span>
                                    <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                                        {program.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-700">{mentorData.firstname} {mentorData.lastname}</p>
                                <p className="text-xs text-gray-500">Mentor</p>
                            </div>
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                                {mentorData.firstname.charAt(0)}{mentorData.lastname.charAt(0)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-6 py-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-lg transition">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total Learners</p>
                                <p className="text-3xl font-bold text-gray-800">{stats.totalLearners}</p>
                                <p className="text-xs text-gray-400 mt-1">Capacity: {program.capacity}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <FaUserGraduate className="text-blue-500 text-xl" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-lg transition">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Active Learners</p>
                                <p className="text-3xl font-bold text-emerald-600">{stats.activeLearners}</p>
                                <p className="text-xs text-gray-400 mt-1">{Math.round((stats.activeLearners / stats.totalLearners) * 100)}% of total</p>
                            </div>
                            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                                <FiUserCheck className="text-emerald-500 text-xl" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-lg transition">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Avg. Progress</p>
                                <p className="text-3xl font-bold text-blue-600">{stats.averageProgress}%</p>
                                <p className="text-xs text-gray-400 mt-1">Course completion</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <FaChartLine className="text-blue-500 text-xl" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-lg transition">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Avg. Attendance</p>
                                <p className="text-3xl font-bold text-purple-600">{stats.averageAttendance}%</p>
                                <p className="text-xs text-gray-400 mt-1">Last 30 days</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                <FaClock className="text-purple-500 text-xl" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Learners Section */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">Enrolled Learners</h2>
                            <p className="text-sm text-gray-500">Manage and track intern progress</p>
                        </div>
                        <div className="flex gap-3">
                            <div className="relative">
                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search learners..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                                />
                            </div>
                            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2">
                                <FiDownload size={18} />
                                Export
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left p-4 text-sm font-semibold text-gray-600">Learner</th>
                                    <th className="text-left p-4 text-sm font-semibold text-gray-600">Contact</th>
                                    <th className="text-left p-4 text-sm font-semibold text-gray-600">Enrolled Date</th>
                                    <th className="text-left p-4 text-sm font-semibold text-gray-600">Progress</th>
                                    <th className="text-left p-4 text-sm font-semibold text-gray-600">Attendance</th>
                                    <th className="text-left p-4 text-sm font-semibold text-gray-600">Status</th>
                                    <th className="text-left p-4 text-sm font-semibold text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedLearners.map((intern) => (
                                    <tr
                                        onClick={() => navigate('../intern-view/' + intern?.id)}
                                        key={intern.id} className="border-b cursor-pointer border-gray-100 hover:bg-gray-50 transition">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                                                    {intern.firstname.charAt(0)}{intern.lastname.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800">{intern.firstname} {intern.lastname}</p>
                                                    <p className="text-xs text-gray-500">ID: {intern.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="space-y-1">
                                                <p className="text-sm text-gray-600 flex items-center gap-1">
                                                    <FiMail size={12} /> {intern.email}
                                                </p>
                                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                                    <FiPhone size={12} /> {intern.phone}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-sm text-gray-600">{formatDate(intern.enrolledDate)}</p>
                                        </td>
                                        <td className="p-4">
                                            <div className="w-32">
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span className="text-gray-600">{intern.progress}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className={`${getProgressColor(intern.progress)} h-2 rounded-full transition-all`}
                                                        style={{ width: `${intern.progress}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium text-gray-700">{intern.attendance}%</span>
                                                {intern.attendance >= 80 && <FaStar className="text-yellow-400 text-sm" />}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${intern.status === 'Active'
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : 'bg-red-100 text-red-700'
                                                }`}>
                                                {intern.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                                View Profile
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                            <div className="text-sm text-gray-500">
                                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredLearners.length)} of {filteredLearners.length} learners
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                    <FiChevronLeft />
                                </button>
                                <div className="flex gap-1">
                                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                        let pageNum;
                                        if (totalPages <= 5) {
                                            pageNum = i + 1;
                                        } else if (currentPage <= 3) {
                                            pageNum = i + 1;
                                        } else if (currentPage >= totalPages - 2) {
                                            pageNum = totalPages - 4 + i;
                                        } else {
                                            pageNum = currentPage - 2 + i;
                                        }
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => setCurrentPage(pageNum)}
                                                className={`px-3 py-1 rounded-lg transition ${currentPage === pageNum
                                                        ? 'bg-blue-600 text-white'
                                                        : 'border border-gray-300 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                </div>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                    <FiChevronRight />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {filteredLearners.length === 0 && (
                        <div className="p-12 text-center">
                            <FiUsers className="text-6xl text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-700 mb-2">No learners found</h3>
                            <p className="text-sm text-gray-500">Try adjusting your search criteria</p>
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                        <div className="flex items-center gap-3 mb-3">
                            <FaEnvelope className="text-blue-500 text-xl" />
                            <h3 className="font-semibold text-gray-800">Message Learners</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">Send announcements or individual messages to learners</p>
                        <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
                            Compose Message →
                        </button>
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-100">
                        <div className="flex items-center gap-3 mb-3">
                            <FaChartLine className="text-purple-500 text-xl" />
                            <h3 className="font-semibold text-gray-800">Progress Reports</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">Generate and download progress reports</p>
                        <button className="text-purple-600 text-sm font-medium hover:text-purple-700">
                            Generate Report →
                        </button>
                    </div>
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-5 border border-emerald-100">
                        <div className="flex items-center gap-3 mb-3">
                            <FiCalendar className="text-emerald-500 text-xl" />
                            <h3 className="font-semibold text-gray-800">Schedule Session</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">Schedule mentoring sessions with learners</p>
                        <button className="text-emerald-600 text-sm font-medium hover:text-emerald-700">
                            Schedule →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MentorProgramView;
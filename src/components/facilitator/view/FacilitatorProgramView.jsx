import React, { useState } from 'react';
// Note: In a real app, you'd need to install and import icons:
// npm install lucide-react
import {
  Menu, X, FolderOpen, FileText, Users, BookOpen, ClipboardList,
  Calendar, ChevronRight, ChevronDown, Upload, Eye, Download,
  CheckCircle, Clock, AlertCircle, Plus, Search, Filter,
  Image as ImageIcon, File, FileSpreadsheet, FileArchive
} from 'lucide-react';

const FacilitatorProgramView = () => {
  // Data from the provided object
  const facilitatorData = {
    active: true,
    assignedPrograms: [
      {
        assignedDate: "2026-04-12T01:12:00",
        assignedRoles: ["MODERATOR", "FACILITATOR", "ASSESSOR"],
        capacity: 80,
        category: "LEARNERSHIP",
        description: "<p>Learn full-stack development using modern technologies like Java, React, and Spring Boot.</p><p>Key Features:</p><p>Hands-on coding projects</p><p>Real-world application building</p><p>Git &amp; version control</p><p>Benefits:</p><p>Industry-ready skills</p><p>Portfolio development</p><p>Job readiness</p><p>Schedule:</p><p>Duration: 12 weeks</p><p>Days: Mon–Fri</p><p>Time: 09:00 – 15:00</p><p>Learn More:</p><p><a target=\"_blank\" rel=\"noopener noreferrer nofollow\" class=\"text-blue-500 underline cursor-pointer\" href=\"https://example.com/software-bootcamp\">https://example.com/software-bootcamp</a></p><p></p>",
        endDate: "2026-04-12",
        enrolledCount: 0,
        enrollmentData: [],
        id: 13,
        imageUrl: "/uploads/programs/1ae6dd1f-c1f1-4a27-a007-9859e5e4be5c.jpg",
        location: "2394 Aubry Matlakala Street 0152",
        name: " Software Development Bootcamp",
        startDate: "2026-04-12",
        status: "NOT_STARTED",
        type: "ICT"
      }
    ],
    contactNumber: "0711161559",
    createdAt: "2026-04-11T22:48:32.000Z",
    dob: "2000-12-15",
    email: "ntuthuko@outlook.com",
    firstname: "Ntuthuku",
    gender: "Male",
    id: 56,
    idNo: "0012158180199",
    lastLogin: "2026-04-12T13:06:48",
    lastname: "Zulu",
    prevLogin: "2026-04-12T00:57:08",
    role: ["FACILITATOR", "MODERATOR", "ASSESSOR"],
    status: "ACTIVE"
  };

  const program = facilitatorData.assignedPrograms[0];

  // State for sidebar and active tab
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('content'); // content, assessments, exams, submissions, learners

  // File Explorer State
  const [expandedFolders, setExpandedFolders] = useState({
    workbooks: true,
    unitStandards: false,
    presentations: false,
    assignments: false
  });

  // Mock File Structure
  const fileStructure = {
    workbooks: {
      name: 'Workbooks',
      type: 'folder',
      children: [
        { name: 'Module 1 - Introduction.pdf', type: 'file', size: '2.4 MB', date: '2026-04-01' },
        { name: 'Module 2 - JavaScript Basics.pdf', type: 'file', size: '3.1 MB', date: '2026-04-02' },
        { name: 'Module 3 - React Fundamentals.pdf', type: 'file', size: '4.2 MB', date: '2026-04-03' },
        { name: 'Workbook Exercises.docx', type: 'file', size: '1.8 MB', date: '2026-04-04' }
      ]
    },
    unitStandards: {
      name: 'Unit Standards',
      type: 'folder',
      children: [
        { name: 'US-115359 - Programming Concepts.pdf', type: 'file', size: '1.2 MB', date: '2026-03-28' },
        { name: 'US-115360 - OOP Principles.pdf', type: 'file', size: '2.1 MB', date: '2026-03-29' },
        { name: 'US-115361 - Database Design.pdf', type: 'file', size: '1.9 MB', date: '2026-03-30' }
      ]
    },
    presentations: {
      name: 'Presentations',
      type: 'folder',
      children: [
        { name: 'Week 1 - Welcome Slides.pptx', type: 'file', size: '5.3 MB', date: '2026-04-01' },
        { name: 'Week 2 - Java Basics.pptx', type: 'file', size: '4.8 MB', date: '2026-04-08' },
        { name: 'Week 3 - Spring Boot Overview.pptx', type: 'file', size: '6.1 MB', date: '2026-04-15' }
      ]
    },
    assignments: {
      name: 'Assignments',
      type: 'folder',
      children: [
        { name: 'Assignment 1 - Requirements.pdf', type: 'file', size: '0.8 MB', date: '2026-04-01' },
        { name: 'Assignment 1 - Submission Template.docx', type: 'file', size: '0.5 MB', date: '2026-04-01' },
        { name: 'Assignment 2 - Project Guidelines.pdf', type: 'file', size: '1.1 MB', date: '2026-04-10' }
      ]
    }
  };

  // Mock Learners Data
  const enrolledLearners = [
    { id: 1, name: 'Thabo Mbeki', email: 'thabo@example.com', status: 'Active', enrolledDate: '2026-04-01', progress: 45 },
    { id: 2, name: 'Lerato Dlamini', email: 'lerato@example.com', status: 'Active', enrolledDate: '2026-04-01', progress: 62 },
    { id: 3, name: 'Sipho Nkosi', email: 'sipho@example.com', status: 'Active', enrolledDate: '2026-04-02', progress: 38 },
    { id: 4, name: 'Nomsa Khumalo', email: 'nomsa@example.com', status: 'Inactive', enrolledDate: '2026-04-01', progress: 12 },
    { id: 5, name: 'Andile Cele', email: 'andile@example.com', status: 'Active', enrolledDate: '2026-04-03', progress: 78 }
  ];

  // Mock Submissions Data
  const submissions = [
    { id: 1, learnerName: 'Thabo Mbeki', assignment: 'Assignment 1', submittedDate: '2026-04-10', status: 'Graded', grade: 85 },
    { id: 2, learnerName: 'Lerato Dlamini', assignment: 'Assignment 1', submittedDate: '2026-04-09', status: 'Pending', grade: null },
    { id: 3, learnerName: 'Sipho Nkosi', assignment: 'Assignment 1', submittedDate: '2026-04-11', status: 'Reviewed', grade: 72 },
    { id: 4, learnerName: 'Nomsa Khumalo', assignment: 'Assignment 1', submittedDate: null, status: 'Not Submitted', grade: null }
  ];

  // Mock Assessments
  const assessments = [
    { id: 1, name: 'Quiz 1 - JavaScript Basics', type: 'Quiz', dueDate: '2026-04-20', totalMarks: 50, weight: 15 },
    { id: 2, name: 'Mid-term Project', type: 'Project', dueDate: '2026-05-15', totalMarks: 100, weight: 30 },
    { id: 3, name: 'Final Exam', type: 'Exam', dueDate: '2026-06-30', totalMarks: 150, weight: 40 }
  ];

  // Mock Exams
  const exams = [
    { id: 1, name: 'Summative Exam - Module 1-3', date: '2026-05-20', duration: '3 hours', totalMarks: 100, venue: 'Online' },
    { id: 2, name: 'Practical Assessment', date: '2026-06-10', duration: '4 hours', totalMarks: 100, venue: 'Lab A' }
  ];

  const toggleFolder = (folder) => {
    setExpandedFolders(prev => ({ ...prev, [folder]: !prev[folder] }));
  };

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    if (ext === 'pdf') return <FileText size={16} className="text-red-500" />;
    if (ext === 'docx' || ext === 'doc') return <FileText size={16} className="text-blue-600" />;
    if (ext === 'xlsx' || ext === 'xls') return <FileSpreadsheet size={16} className="text-green-600" />;
    if (ext === 'pptx' || ext === 'ppt') return <FileArchive size={16} className="text-orange-500" />;
    if (ext === 'jpg' || ext === 'png' || ext === 'gif') return <ImageIcon size={16} className="text-purple-500" />;
    return <File size={16} className="text-gray-500" />;
  };

  // Sidebar navigation items
  const navItems = [
    { id: 'content', label: 'Content', icon: <FolderOpen size={20} /> },
    { id: 'assessments', label: 'Assessments', icon: <ClipboardList size={20} /> },
    { id: 'exams', label: 'Exams', icon: <Calendar size={20} /> },
    { id: 'submissions', label: 'Submissions', icon: <Upload size={20} /> },
    { id: 'learners', label: 'Learners', icon: <Users size={20} /> }
  ];

  const renderContent = () => {
    switch(activeTab) {
      case 'content':
        return (
          <div className="space-y-6">
            {/* File Explorer */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-semibold text-gray-800">Course Materials</h3>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition">
                  <Plus size={16} />
                  Upload Content
                </button>
              </div>
              <div className="p-4">
                {/* Folder: Workbooks */}
                <div className="mb-2">
                  <div 
                    className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                    onClick={() => toggleFolder('workbooks')}
                  >
                    {expandedFolders.workbooks ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    <FolderOpen size={18} className="text-yellow-600" />
                    <span className="font-medium text-gray-700">Workbooks</span>
                    <span className="text-xs text-gray-400 ml-auto">{fileStructure.workbooks.children.length} items</span>
                  </div>
                  {expandedFolders.workbooks && (
                    <div className="ml-6 pl-2 border-l-2 border-gray-200 space-y-1 mt-1">
                      {fileStructure.workbooks.children.map((file, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg">
                          {getFileIcon(file.name)}
                          <span className="text-sm text-gray-700 flex-1">{file.name}</span>
                          <span className="text-xs text-gray-400">{file.size}</span>
                          <button className="p-1 hover:bg-gray-200 rounded">
                            <Eye size={14} className="text-gray-500" />
                          </button>
                          <button className="p-1 hover:bg-gray-200 rounded">
                            <Download size={14} className="text-gray-500" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Folder: Unit Standards */}
                <div className="mb-2">
                  <div 
                    className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                    onClick={() => toggleFolder('unitStandards')}
                  >
                    {expandedFolders.unitStandards ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    <FolderOpen size={18} className="text-yellow-600" />
                    <span className="font-medium text-gray-700">Unit Standards</span>
                    <span className="text-xs text-gray-400 ml-auto">{fileStructure.unitStandards.children.length} items</span>
                  </div>
                  {expandedFolders.unitStandards && (
                    <div className="ml-6 pl-2 border-l-2 border-gray-200 space-y-1 mt-1">
                      {fileStructure.unitStandards.children.map((file, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg">
                          {getFileIcon(file.name)}
                          <span className="text-sm text-gray-700 flex-1">{file.name}</span>
                          <span className="text-xs text-gray-400">{file.size}</span>
                          <button className="p-1 hover:bg-gray-200 rounded">
                            <Eye size={14} className="text-gray-500" />
                          </button>
                          <button className="p-1 hover:bg-gray-200 rounded">
                            <Download size={14} className="text-gray-500" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Folder: Presentations */}
                <div className="mb-2">
                  <div 
                    className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                    onClick={() => toggleFolder('presentations')}
                  >
                    {expandedFolders.presentations ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    <FolderOpen size={18} className="text-yellow-600" />
                    <span className="font-medium text-gray-700">Presentations</span>
                    <span className="text-xs text-gray-400 ml-auto">{fileStructure.presentations.children.length} items</span>
                  </div>
                  {expandedFolders.presentations && (
                    <div className="ml-6 pl-2 border-l-2 border-gray-200 space-y-1 mt-1">
                      {fileStructure.presentations.children.map((file, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg">
                          {getFileIcon(file.name)}
                          <span className="text-sm text-gray-700 flex-1">{file.name}</span>
                          <span className="text-xs text-gray-400">{file.size}</span>
                          <button className="p-1 hover:bg-gray-200 rounded">
                            <Eye size={14} className="text-gray-500" />
                          </button>
                          <button className="p-1 hover:bg-gray-200 rounded">
                            <Download size={14} className="text-gray-500" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Folder: Assignments */}
                <div className="mb-2">
                  <div 
                    className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                    onClick={() => toggleFolder('assignments')}
                  >
                    {expandedFolders.assignments ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    <FolderOpen size={18} className="text-yellow-600" />
                    <span className="font-medium text-gray-700">Assignments</span>
                    <span className="text-xs text-gray-400 ml-auto">{fileStructure.assignments.children.length} items</span>
                  </div>
                  {expandedFolders.assignments && (
                    <div className="ml-6 pl-2 border-l-2 border-gray-200 space-y-1 mt-1">
                      {fileStructure.assignments.children.map((file, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg">
                          {getFileIcon(file.name)}
                          <span className="text-sm text-gray-700 flex-1">{file.name}</span>
                          <span className="text-xs text-gray-400">{file.size}</span>
                          <button className="p-1 hover:bg-gray-200 rounded">
                            <Eye size={14} className="text-gray-500" />
                          </button>
                          <button className="p-1 hover:bg-gray-200 rounded">
                            <Download size={14} className="text-gray-500" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                <p className="text-sm text-gray-500">Total Resources</p>
                <p className="text-2xl font-bold text-gray-800">14</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                <p className="text-sm text-gray-500">Folders</p>
                <p className="text-2xl font-bold text-gray-800">4</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="text-lg font-semibold text-gray-800">2026-04-11</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                <p className="text-sm text-gray-500">Storage Used</p>
                <p className="text-2xl font-bold text-gray-800">34.2 MB</p>
              </div>
            </div>
          </div>
        );

      case 'assessments':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-semibold text-gray-800">Assessments</h3>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition">
                  <Plus size={16} />
                  Create Assessment
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left p-3 text-sm font-semibold text-gray-600">Assessment Name</th>
                      <th className="text-left p-3 text-sm font-semibold text-gray-600">Type</th>
                      <th className="text-left p-3 text-sm font-semibold text-gray-600">Due Date</th>
                      <th className="text-left p-3 text-sm font-semibold text-gray-600">Total Marks</th>
                      <th className="text-left p-3 text-sm font-semibold text-gray-600">Weight</th>
                      <th className="text-left p-3 text-sm font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assessments.map(assessment => (
                      <tr key={assessment.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-3 text-sm text-gray-700">{assessment.name}</td>
                        <td className="p-3 text-sm">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">{assessment.type}</span>
                        </td>
                        <td className="p-3 text-sm text-gray-600">{assessment.dueDate}</td>
                        <td className="p-3 text-sm text-gray-600">{assessment.totalMarks}</td>
                        <td className="p-3 text-sm text-gray-600">{assessment.weight}%</td>
                        <td className="p-3 text-sm">
                          <button className="text-blue-600 hover:text-blue-800 mr-3">Edit</button>
                          <button className="text-green-600 hover:text-green-800">View Submissions</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'exams':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-semibold text-gray-800">Exams Schedule</h3>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition">
                  <Plus size={16} />
                  Schedule Exam
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left p-3 text-sm font-semibold text-gray-600">Exam Name</th>
                      <th className="text-left p-3 text-sm font-semibold text-gray-600">Date</th>
                      <th className="text-left p-3 text-sm font-semibold text-gray-600">Duration</th>
                      <th className="text-left p-3 text-sm font-semibold text-gray-600">Total Marks</th>
                      <th className="text-left p-3 text-sm font-semibold text-gray-600">Venue</th>
                      <th className="text-left p-3 text-sm font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exams.map(exam => (
                      <tr key={exam.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-3 text-sm text-gray-700">{exam.name}</td>
                        <td className="p-3 text-sm text-gray-600">{exam.date}</td>
                        <td className="p-3 text-sm text-gray-600">{exam.duration}</td>
                        <td className="p-3 text-sm text-gray-600">{exam.totalMarks}</td>
                        <td className="p-3 text-sm text-gray-600">{exam.venue}</td>
                        <td className="p-3 text-sm">
                          <button className="text-blue-600 hover:text-blue-800 mr-3">Edit</button>
                          <button className="text-orange-600 hover:text-orange-800">Manage</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'submissions':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-semibold text-gray-800">Assignment Submissions</h3>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Filter size={18} className="text-gray-500" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Search size={18} className="text-gray-500" />
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left p-3 text-sm font-semibold text-gray-600">Learner</th>
                      <th className="text-left p-3 text-sm font-semibold text-gray-600">Assignment</th>
                      <th className="text-left p-3 text-sm font-semibold text-gray-600">Submitted Date</th>
                      <th className="text-left p-3 text-sm font-semibold text-gray-600">Status</th>
                      <th className="text-left p-3 text-sm font-semibold text-gray-600">Grade</th>
                      <th className="text-left p-3 text-sm font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map(sub => (
                      <tr key={sub.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-3 text-sm text-gray-700">{sub.learnerName}</td>
                        <td className="p-3 text-sm text-gray-600">{sub.assignment}</td>
                        <td className="p-3 text-sm text-gray-600">{sub.submittedDate || '-'}</td>
                        <td className="p-3 text-sm">
                          {sub.status === 'Graded' && <span className="flex items-center gap-1 text-green-600"><CheckCircle size={14} /> Graded</span>}
                          {sub.status === 'Pending' && <span className="flex items-center gap-1 text-yellow-600"><Clock size={14} /> Pending</span>}
                          {sub.status === 'Reviewed' && <span className="flex items-center gap-1 text-blue-600"><Eye size={14} /> Reviewed</span>}
                          {sub.status === 'Not Submitted' && <span className="flex items-center gap-1 text-red-500"><AlertCircle size={14} /> Not Submitted</span>}
                        </td>
                        <td className="p-3 text-sm text-gray-600">{sub.grade || '-'}</td>
                        <td className="p-3 text-sm">
                          <button className="text-blue-600 hover:text-blue-800">Review</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'learners':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-semibold text-gray-800">Enrolled Learners</h3>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition">
                    Export List
                  </button>
                  <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition">
                    Send Message
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left p-3 text-sm font-semibold text-gray-600">Name</th>
                      <th className="text-left p-3 text-sm font-semibold text-gray-600">Email</th>
                      <th className="text-left p-3 text-sm font-semibold text-gray-600">Enrolled Date</th>
                      <th className="text-left p-3 text-sm font-semibold text-gray-600">Status</th>
                      <th className="text-left p-3 text-sm font-semibold text-gray-600">Progress</th>
                      <th className="text-left p-3 text-sm font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enrolledLearners.map(learner => (
                      <tr key={learner.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-3 text-sm font-medium text-gray-700">{learner.name}</td>
                        <td className="p-3 text-sm text-gray-600">{learner.email}</td>
                        <td className="p-3 text-sm text-gray-600">{learner.enrolledDate}</td>
                        <td className="p-3 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs ${learner.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {learner.status}
                          </span>
                        </td>
                        <td className="p-3 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${learner.progress}%` }}></div>
                            </div>
                            <span className="text-xs text-gray-500">{learner.progress}%</span>
                          </div>
                        </td>
                        <td className="p-3 text-sm">
                          <button className="text-blue-600 hover:text-blue-800 mr-3">View Profile</button>
                          <button className="text-gray-600 hover:text-gray-800">Message</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Program Summary Card */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
              <h4 className="font-semibold text-gray-800 mb-3">Program Summary</h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Total Enrolled</p>
                  <p className="text-2xl font-bold text-gray-800">{enrolledLearners.length} / {program.capacity}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Active Learners</p>
                  <p className="text-2xl font-bold text-green-600">{enrolledLearners.filter(l => l.status === 'Active').length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Average Progress</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {Math.round(enrolledLearners.reduce((acc, l) => acc + l.progress, 0) / enrolledLearners.length)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Facilitator Dashboard</h1>
              <p className="text-sm text-gray-500">{program.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-700">{facilitatorData.firstname} {facilitatorData.lastname}</p>
              <p className="text-xs text-gray-500">{facilitatorData.role.join(', ')}</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
              {facilitatorData.firstname.charAt(0)}{facilitatorData.lastname.charAt(0)}
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 min-h-[calc(100vh-64px)]`}>
          <nav className="p-4 space-y-2">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${
                  activeTab === item.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {item.icon}
                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </button>
            ))}
          </nav>
          
          {/* Program Info in Sidebar */}
          {sidebarOpen && (
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
              <div className="text-xs text-gray-500 space-y-1">
                <p>Program ID: {program.id}</p>
                <p>Status: <span className="text-yellow-600">{program.status}</span></p>
                <p>Location: {program.location.split(' ').slice(0, 2).join(' ')}...</p>
              </div>
            </div>
          )}
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {/* Program Info Banner */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-2xl font-bold">
                  {program.name.charAt(1)}
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-800">{program.name}</h2>
                  <div className="flex flex-wrap gap-4 mt-1 text-sm text-gray-500">
                    <span className="flex items-center gap-1">📅 {program.startDate} → {program.endDate}</span>
                    <span className="flex items-center gap-1">📍 {program.location}</span>
                    <span className="flex items-center gap-1">📋 {program.category}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Moderator</span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Facilitator</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">Assessor</span>
                </div>
              </div>
            </div>

            {/* Dynamic Content */}
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default FacilitatorProgramView;
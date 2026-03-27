import { apiFetch } from '@/api/api';
import ResponseMessage from '@/components/common/ResponseMessage';
import { USERS } from '@/utils/apiEndpoint';
import { AlertCircle, CheckCircle, PenSquareIcon, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Card,
  Dropdown,
  Form,
  InputGroup,
  Modal,
  Offcanvas,
  Pagination,
  Spinner,
  Table
} from 'react-bootstrap';
import {
  FaBookOpen,
  FaChalkboardTeacher,
  FaClipboardCheck,
  FaCrown,
  FaDownload,
  FaEdit,
  FaEnvelope,
  FaGavel,
  FaGraduationCap,
  FaHistory,
  FaIdCard,
  FaKey,
  FaPhone,
  FaSave,
  FaSearch,
  FaSeedling,
  FaShieldAlt,
  FaTimes,
  FaTrash,
  FaUpload,
  FaUserCog,
  FaUserGraduate,
  FaUserPlus,
  FaUsers,
  FaUserTie
} from 'react-icons/fa';
import { FiMail, FiUser } from 'react-icons/fi';
import { useTopLoader } from '../../../contexts/TopLoaderContext';
import { formatLastLogin } from '../../../utils/formatLastLogin.js';
import { readableDate } from '../../../utils/readableDate.js';
import { isValidSouthAfricanID } from "../../../utils/validateIdNo.js";
import RoleManagerModal from './RoleManagerModal';
import UserProfileOffcanvas from './UserProfileOffcanvas';

export default function UserManagement() {
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });
  const [bulkSelection, setBulkSelection] = useState([]);
  const [response, setResponse] = useState(null);
  const { start, complete } = useTopLoader();
  const [validated, setValidated] = useState(false);
  const [invalidIdno, setInvalidIdno] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [roleRequired, setRoleRequired] = useState(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [bulkFile, setBulkFile] = useState(null);
  const itemsPerPage = 20;
  const [users, setUsers] = useState(null);
  const [showModal, setShowModal] = useState(null);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false)
  const [roleManager, setShowRoleManager] = useState(false);

  const [userForm, setUserForm] = useState({
    firstname: "",
    lastname: "",
    contactNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    idNo: '',
    role: ["LEARNER"],
    status: "ACTIVE"
  });

  const roles = ['ADMIN', 'PROGRAM_MANAGER', 'FACILITATOR', 'MENTOR', 'INTERN', 'LEARNER', 'ASSESSOR', 'MODERATOR'];

  // ========== FETCH USERS ==========
  async function getUsers() {
    try {
      start();
      const result = await apiFetch(USERS);
      setUsers(result);
    } catch (e) {
      setResponse({ success: false, message: "An error has occurred." });
    } finally {
      complete();
    }
  }

  useEffect(() => {
    getUsers();
  }, []);

  // ========== FILTER AND SEARCH ==========
  useEffect(() => {
    let result = users;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result?.filter(user =>
        user?.firstname?.toLowerCase().includes(term) ||
        user?.lastname?.toLowerCase().includes(term) ||
        user?.idNo?.toLowerCase().includes(term) ||
        user?.email?.toLowerCase().includes(term)
      );
    }

    if (selectedRole !== 'all') {
      result = result?.filter(user => user?.role?.some(r => r === selectedRole));
    }

    result?.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    setFilteredUsers(result);
    setCurrentPage(1);
  }, [users, searchTerm, selectedRole, selectedStatus, sortConfig]);

  // ========== PAGINATION ==========
  const totalPages = Math.ceil(filteredUsers?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsers = filteredUsers?.slice(startIndex, startIndex + itemsPerPage);

  // ========== HANDLERS ==========
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "contactNumber" && value !== "") {
      if (!/^\d*$/.test(value) || value.length > 10 || value[0] !== "0") return;
    }

    setUserForm({ ...userForm, [name]: value });

    if (name === "idNo") {
      if (!isValidSouthAfricanID(value)) {
        setResponse({ success: false, message: "Invalid id number." });
        setInvalidIdno(true);
      } else {
        setResponse(null);
        setInvalidIdno(false);
      }
    }
  };

  const handleEditUser = (user) => {
    setUserForm({ ...user });
    setEditingUser(user);
    setShowModal(true);
  };

  const handleViewUser = (user) => {
    setUserForm({ ...user });
    setShowUserDetails(true);
  };

  const handleDeleteClick = (user) => {
    setUserForm({ ...user });
    setShowDeleteModal(true);
  };

  // ========== CREATE/UPDATE USER ==========
  async function handleRegister(e) {
    setLoading(true);
    e.preventDefault();
    start();

    if (e.currentTarget.checkValidity() === false) {
      e.stopPropagation();
      setLoading(false);
      setValidated(true);
      setTimeout(() => {
        complete();
      }, 1500);
      return;
    }

    if (userForm.role.length === 0) {
      setResponse({ success: false, message: "Please select at least one role." });
      complete();
      setLoading(false);
      setRoleRequired(true);
      return;
    }

    try {
      const result = await apiFetch(USERS, {
        method: "POST",
        body: JSON.stringify(userForm)
      });

      setResponse(result);
      if (result?.success) {
        getUsers();
        resetForm();
        setTimeout(() => {
          setResponse(null);
        }, 15000);
      }
    } catch (error) {
      setResponse({ success: false, message: "An error occurred. Please try again." });
    } finally {
      complete();
      setLoading(false);
    }
  }

  // ========== DELETE USER ==========
  async function handleDeleteUser() {
    start();
    try {
      let result = await apiFetch(`${USERS}/${userForm.id}`, {
        method: "DELETE"
      });
      setResponse(result);
      getUsers();
    } catch (error) {
      setResponse({ success: false, message: "An error occurred while deleting a user." });
    } finally {
      complete();
      setShowDeleteModal(false);
    }
  }

  // ========== BULK ACTIONS ==========

  // Bulk Upload
  const handleBulkUpload = async () => {
    if (!bulkFile) {
      setResponse({ success: false, message: "Please select a file" });
      return;
    }

    start();
    try {
      const formData = new FormData();
      formData.append('file', bulkFile);

      const result = await apiFetch(`${USERS}/bulk`, {
        method: "POST",
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setResponse(result);
      if (result?.success) {
        getUsers();
        setShowBulkUploadModal(false);
        setBulkFile(null);
      }
    } catch (error) {
      setResponse({ success: false, message: "Bulk upload failed" });
    } finally {
      complete();
    }
  };

  // Bulk Delete
  const handleBulkDelete = async () => {

    start();
    try {
      const result = await apiFetch(`${USERS}/bulk-delete`, {
        method: "POST",
        body: JSON.stringify({ userIds: bulkSelection })
      });

      setResponse(result)
      getUsers();

      if (result?.success) {
        setBulkSelection([]);
        setShowBulkDeleteModal(false)
      }
    } catch (error) {
      setResponse({ message: 'Bulk delete failed' + error });
    } finally {
      complete();
    }
  };

  // Bulk Role Assign
  const handleBulkRoleAssign = async (role) => {
    start();
    try {
      const result = await apiFetch(`${USERS}/bulk-role`, {
        method: "POST",
        body: JSON.stringify({
          userIds: bulkSelection,
          role: role
        })
      });

      setResponse(result);

      if (result?.success) {
        setBulkSelection([]);
        getUsers();
      }
    } catch (error) {
      setResponse({ success: false, message: 'Bulk role assignment failed'});
    } finally {
      complete();
    } 
  };

  // Bulk Status Update
  const handleBulkStatusUpdate = async (status) => {
    start();
    try {
      const result = await apiFetch(`${USERS}/bulk-status`, {
        method: "POST",
        body: JSON.stringify({
          userIds: bulkSelection,
          status: status
        })
      });
      setResponse(result)

      if (result?.success) {
        setBulkSelection([]);
        getUsers();
      }
    } catch (error) {
      setResponse({ success: false, message: 'Bulk status update failed' });
    } finally {
      complete();
    }
  };

  // Bulk Export
  const handleBulkExport = () => {
    const selectedUsers = users?.filter(u => bulkSelection.includes(u.id)) || [];
    const csv = convertToCSV(selectedUsers);
    downloadCSV(csv, 'users_export.csv');
    setResponse({ message: `${bulkSelection.length} users exported`, success: true });
  };


  const handleSelectAll = () => {
    if (bulkSelection.length === currentUsers?.length) {
      setBulkSelection([]);
    } else {
      setBulkSelection(currentUsers?.map(user => user.id) || []);
    }
  };

  const handleBulkSelect = (userId) => {
    setBulkSelection(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };



  const resetForm = () => {
    setUserForm({
      firstname: "",
      lastname: "",
      contactNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
      idNo: '',
      role: ["LEARNER"],
      status: "ACTIVE"
    });
    setEditingUser(null);
  };

  const convertToCSV = (data) => {
    const headers = ['First Name', 'Last Name', 'Email', 'Phone', 'ID Number', 'Roles', 'Status'];
    const rows = data.map(u => [
      u.firstname,
      u.lastname,
      u.email,
      u.contactNumber,
      u.idNo,
      u.role?.join(';'),
      u.status
    ]);

    return [headers, ...rows]
      .map(row => row.join(','))
      .join('\n');
  };

  const downloadCSV = (csv, filename) => {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getRoleIcon = (role, size = 14) => {
    const iconProps = {
      size,
      className: 'transition-transform group-hover:scale-110'
    };
    switch (role?.toUpperCase()) {
      case 'ADMIN':
        return <FaCrown {...iconProps} className="text-amber-500" />;
      case 'FACILITATOR':
        return <FaChalkboardTeacher {...iconProps} className="text-blue-500" />;
      case 'MENTOR':
        return <FaUserGraduate {...iconProps} className="text-purple-500" />;
      case 'INTERN':
        return <FaSeedling {...iconProps} className="text-green-500" />;
      case 'LEARNER':
        return <FaBookOpen {...iconProps} className="text-indigo-500" />;
      case 'ASSESSOR':
        return <FaClipboardCheck {...iconProps} className="text-orange-500" />;
      case 'MODERATOR':
        return <FaGavel {...iconProps} className="text-red-500" />;
      default:
        return <FiUser {...iconProps} className="text-gray-400" />;
    }
  };

  return (
    <div className="h-screen w-full overflow-y-auto p-6 flex flex-col">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <FaUsers className="text-red-600" />
              User Management
            </h1>
            <p className="text-gray-600">Manage all users, roles, and permissions</p>
          </div>
          <div className="grid md:grid-cols-2 gap-2">
            <Button
              variant="outline-info"
              size='sm'
              onClick={() => setShowBulkUploadModal(true)}
              className="flex items-center gap-2 px-4 py-2"
            >
              <FaUpload /> Bulk Upload
            </Button>
            <Button
              variant="outline-primary"
              size='sm'
              onClick={() => {
                setEditingUser(null);
                setShowModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2"
            >
              <FaUserPlus /> Add New User
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="hidden md:grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-9 gap-3 mb-6">
          {[
            { label: 'Total Users', role: "all", value: users?.length, icon: <FaUsers />, color: 'bg-gradient-to-br from-blue-500 to-blue-600' },
            { label: 'Admins', role: "ADMIN", value: users?.filter(u => u.role?.some(r => r === 'ADMIN')).length, icon: <FaKey />, color: 'bg-gradient-to-br from-red-500 to-red-600' },
            { label: 'program manager', role: "PROGRAM_MANAGER", value: users?.filter(u => u.role?.some(r => r === 'PROGRAM MANAGER')).length, icon: <FaGraduationCap />, color: 'bg-gradient-to-br from-green-500 to-green-600' },
            { label: 'Learners', role: "LEARNER", value: users?.filter(u => u.role?.some(r => r === 'LEARNER')).length, icon: <FaGraduationCap />, color: 'bg-gradient-to-br from-green-500 to-green-600' },
            { label: 'Facilitators', role: "FACILITATOR", value: users?.filter(u => u.role?.some(r => r === 'FACILITATOR')).length, icon: <FaChalkboardTeacher />, color: 'bg-gradient-to-br from-purple-500 to-purple-600' },
            { label: 'Mentors', role: "MENTOR", value: users?.filter(u => u.role?.some(r => r === 'MENTOR')).length, icon: <FaUserTie />, color: 'bg-gradient-to-br from-indigo-500 to-indigo-600' },
            { label: 'Interns', role: "INTERN", value: users?.filter(u => u.role?.some(r => r === 'INTERN')).length, icon: <FaUserGraduate />, color: 'bg-gradient-to-br from-yellow-500 to-yellow-600' },
            { label: 'Assessors', role: "ASSESSOR", value: users?.filter(u => u.role?.some(r => r === 'ASSESSOR')).length, icon: <FaClipboardCheck />, color: 'bg-gradient-to-br from-teal-500 to-teal-600' },
            { label: 'Moderators', role: "MODERATOR", value: users?.filter(u => u.role?.some(r => r === 'MODERATOR')).length, icon: <FaShieldAlt />, color: 'bg-gradient-to-br from-slate-600 to-slate-700' },
          ].map((stat, idx) => (
            <Card
              onClick={() => setSelectedRole(stat.role)}
              key={idx}
              className="border-0 cursor-pointer transition-all duration-200 hover:scale-105 group"
            >
              <Card.Body className="p-3">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center text-white text-lg mb-2 group-hover:shadow-md transition-all`}>
                    {stat.icon}
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-800 leading-tight">{stat.value || 0}</h3>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{stat.label}</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>

      <ResponseMessage setResponse={setResponse} response={response} />


      {/* Bulk Actions Bar */}
      {bulkSelection.length > 0 && (
        <div className="bg-gradient-to-r from-red-50 to-red-50/50 p-4 rounded-lg border border-red-200 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge bg="danger" className="px-3 py-1">
                {bulkSelection.length} selected
              </Badge>
              <span className="text-gray-700">Bulk actions:</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Dropdown>
                <Dropdown.Toggle variant="outline-primary" size="sm" className="flex items-center gap-2">
                  <FaUserCog /> Assign Role
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {roles.map(role => (
                    <Dropdown.Item
                      key={role}
                      onClick={() => handleBulkRoleAssign(role)}
                      className="flex items-center gap-2"
                    >
                      {getRoleIcon(role)} {role}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>

              <Dropdown>
                <Dropdown.Toggle variant="outline-warning" size="sm" className="flex items-center gap-2">
                  <FaHistory /> Status
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handleBulkStatusUpdate('ACTIVE')}>
                    <CheckCircle className="text-green-500 me-2" size={14} /> Activate
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleBulkStatusUpdate('INACTIVE')}>
                    <AlertCircle className="text-red-500 me-2" size={14} /> Deactivate
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              <Button
                variant="outline-success"
                size="sm"
                onClick={handleBulkExport}
                className="flex items-center gap-2"
              >
                <FaDownload /> Export
              </Button>

              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => setShowBulkDeleteModal(true)}
                className="flex items-center gap-2"
              >
                <FaTrash /> Delete
              </Button>

              <Button
                variant="link"
                size="sm"
                onClick={() => setBulkSelection([])}
                className="text-gray-600"
              >
                Clear
              </Button>
            </div>
          </div>


        </div>
      )}

      {/* Filters and Search */}
      <Card className="border-0 mb-6">
        <Card.Body className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <InputGroup>
                <InputGroup.Text className="bg-white border-r-0">
                  <FaSearch className="text-gray-500" />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search users by name, email, or ID number"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-l-0"
                />
              </InputGroup>
            </div>

            <Form.Select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="border-gray-300"
            >
              <option value="all">All Roles</option>
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </Form.Select>
          </div>
        </Card.Body>
      </Card>

      {/* Users Table */}
      <Card className="border-0 flex-1">
        <Card.Body>
          <div className="overflow-auto">
            <Table hover className="mb-0 border-separate border-spacing-0">
              <thead className="bg-white/80 backdrop-blur-sm sticky top-0">
                <tr>
                  <th className="border-b border-slate-200 px-4 py-3.5 w-12">
                    <Form.Check
                      type="checkbox"
                      className="accent-rose-600"
                      checked={bulkSelection.length === currentUsers?.length && currentUsers?.length > 0}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="border-b border-slate-200 px-4 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">User</th>
                  <th className="border-b border-slate-200 px-4 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Email</th>
                  <th className="border-b border-slate-200 px-4 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Role</th>
                  <th className="border-b border-slate-200 px-4 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-40">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentUsers?.map((user, key) => (
                  <tr
                    key={key}
                    className="group transition-colors duration-200 hover:bg-rose-50/40"
                  >
                    <td className="px-4 py-4 align-middle">
                      <Form.Check
                        type="checkbox"
                        className="accent-rose-600"
                        checked={bulkSelection.includes(user.id)}
                        onChange={() => handleBulkSelect(user.id)}
                      />
                    </td>
                    <td className="px-4 py-4 align-middle">
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="font-medium text-slate-900">
                            {user?.firstname} {user?.lastname}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 align-middle">
                      <div className="flex items-center gap-2 text-slate-600">
                        <FiMail className="text-slate-400" size={16} />
                        <span className="text-sm">{user.email}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 align-middle">
                      <div className="flex items-center gap-2 flex-wrap">
                        {user?.role && user.role.length > 0 ? (
                          <>
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-rose-50 text-rose-700 border border-rose-100 ring-1 ring-rose-100/50">
                              {getRoleIcon(user.role[0])}
                              {user.role[0]}
                            </span>
                            {user.role.length > 1 && (
                              <Dropdown align="end">
                                <Dropdown.Toggle
                                  as="span"
                                  className="cursor-pointer inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-white text-slate-600 hover:bg-white hover:text-slate-800 transition-colors border-0"
                                >
                                  +{user.role.length - 1}
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="p-2 min-w-[160px] border border-slate-200 rounded-lg mt-1">
                                  {user.role.slice(1).map((r, idx) => (
                                    <Dropdown.Item
                                      key={idx}
                                      className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 rounded-md hover:bg-white transition-colors"
                                      disabled
                                    >
                                      {getRoleIcon(r)}
                                      <span>{r}</span>
                                    </Dropdown.Item>
                                  ))}
                                </Dropdown.Menu>
                              </Dropdown>
                            )}
                          </>
                        ) : (
                          <span className="text-slate-400 text-sm italic">No role assigned</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 align-middle">
                      <Dropdown className=" inline-block">
                        <Dropdown.Toggle
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-2 py-1 rounded inline-flex items-center focus:outline-none"
                        >
                          ACTION
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="px-auto absolute z-[9999] min-w-[140px] bg-slate-50 border border-gray-200 rounded-md shadow-lg">
                          {[
                            {
                              label: "ROLE MANAGER",
                              event: () => { setShowRoleManager(true); setUserForm(user) },
                              style: "text-gray-800 hover:bg-gray-700",
                            },
                            {
                              label: "DEACTIVATE",
                              style: "text-yellow-800 hover:bg-yellow-700",
                            },
                            {
                              label: "ACTIVATE",
                              style: "text-green-800 hover:bg-green-700",
                            },
                            {
                              label: "DELETE",
                              event: () => { setShowDeleteModal(true); setUserForm(user) },
                              style: "text-red-700 hover:bg-red-700",
                            },
                            {
                              label: "EDIT",
                              event: () => handleEditUser(user),
                              style: "text-blue-800 hover:bg-blue-700",
                            },
                            {
                              label: "VIEW",
                              event: () => { setShowUserDetails(true); setUserForm(user) },
                              style: "text-yellow-600 hover:bg-yellow-600",
                            },
                          ].map((action, idx) => (
                            <Dropdown.Item
                              key={idx}
                              onClick={action?.event}
                              className={action?.style + ' font-semibold hover:text-slate-50 rounded-md mx-1 '}
                            >
                              {action?.label}
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {/* Empty State */}
          {filteredUsers?.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiUser className="text-gray-400 text-2xl" />
              </div>
              <h4 className="text-gray-700 font-medium mb-2">No users found</h4>
              <p className="text-gray-500 mb-4">Try adjusting your filters or add a new user</p>
              <Button variant="outline-success" className='flex mx-auto items-center'
                onClick={() => {
                  setEditingUser(null);
                  setShowModal(true);
                }}>
                <FaUserPlus className="me-2" /> Add User
              </Button>
            </div>
          )}
        </Card.Body>

        <Card.Footer className='border-t border-gray-200 bg-white'>
          {filteredUsers?.length > 0 && (
            <div className="flex items-center justify-between px-4 py-3">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredUsers?.length)} of {filteredUsers?.length} users
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
        </Card.Footer>
      </Card>

      {/* Add/Edit User Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
        backdrop="static"
        keyboard={false}
      >
        <Form noValidate validated={validated} onSubmit={handleRegister}>
          <Modal.Header closeButton className="flex border-0 py-3">
            <Modal.Title className="flex gap-2 items-center text-xl font-bold text-gray-800">
              {editingUser ? <PenSquareIcon size={25} className='text-slate-600' /> : <FaUserPlus size={25} className='text-blue-600' />}
              {editingUser ? 'Edit User' : 'Add New User'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="pt-0">

            <ResponseMessage setResponse={setResponse} response={response} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Form.Group>
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="firstname"
                  value={userForm?.firstname}
                  onChange={handleInputChange}
                  placeholder="Enter first name"
                  required
                  className="border-gray-300"
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="lastname"
                  value={userForm?.lastname}
                  onChange={handleInputChange}
                  placeholder="Enter last name"
                  required
                  className="border-gray-300"
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={userForm?.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                  required
                  className="border-gray-300"
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="tel"
                  name="contactNumber"
                  value={userForm?.contactNumber}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                  required
                  className="border-gray-300"
                />
              </Form.Group>


              <Form.Group>
                <Form.Label className='truncate' >Identification Number (RSA ID)</Form.Label>
                <Form.Control
                  type="tel"
                  name="idNo"
                  value={userForm?.idNo}
                  required
                  maxLength={13}
                  onChange={handleInputChange}
                  placeholder="Enter identification number"
                  className="border-gray-300"
                  isInvalid={invalidIdno}
                />
              </Form.Group>


              <Form.Group>
                <Form.Label className='truncate'>Password</Form.Label>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={userForm?.password}
                  onChange={handleInputChange}
                  required={!editingUser}
                  className="border-gray-300"
                />

              </Form.Group>


              <Form.Group className='col-span-2'>
                <Form.Label className='truncate'>Status</Form.Label>
                <Form.Select
                  name="status"
                  value={userForm?.status}
                  required
                  onChange={handleInputChange}
                  className="border-gray-300"
                >
                  <option value={"ACTIVE"}>Active</option>
                  <option value={"INACTIVE"}>Inactive</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="space-y-2 col-span-2">
                <Form.Label className="truncate">Roles</Form.Label>

                {userForm?.role?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {userForm.role.map((role, key) => (
                      <span
                        key={key}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                      >
                        {role}
                        <button
                          type="button"
                          onClick={() => {
                            setUserForm(prev => ({
                              ...prev,
                              role: prev.role.filter(r => r !== role)
                            }));
                          }}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <div className={`${roleRequired ? 'border-red-400' : 'border-slate-300'} border rounded-lg p-4 bg-white`}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {roles.map(role => (
                      <div
                        key={role}
                        className="flex cursor-pointer items-center gap-2 p-2 hover:bg-gray-50 rounded-md transition-colors min-w-0"
                      >
                        <Form.Check
                          type="checkbox"
                          id={`role-${role}`}
                          name="role"
                          value={role}
                          checked={userForm?.role?.includes(role)}
                          onChange={(e) => {
                            const { value, checked } = e.target;
                            setUserForm(prev => ({
                              ...prev,
                              role: checked
                                ? [...prev.role, value]
                                : prev.role.filter(r => r !== value)
                            }));
                          }}
                          className="text-blue-600 cursor-pointer flex-shrink-0"
                        />
                        <Form.Label
                          htmlFor={`role-${role}`}
                          className="m-0 text-sm font-medium cursor-pointer truncate select-none"
                        >
                          {role}
                        </Form.Label>
                      </div>
                    ))}
                  </div>
                </div>
              </Form.Group>
            </div>

            {!editingUser && (
              <Alert variant="info" className="flex items-center mb-0">
                <FaEnvelope className="me-2" />
                The user will receive an email with login instructions.
              </Alert>
            )}
          </Modal.Body>
          <Modal.Footer className="border-t pt-4">
            <Button
              variant="outline-secondary"
              onClick={() => setShowModal(false)}
              disabled={loading}
            >
              Close
            </Button>
            <Button
              variant="outline-success"
              type='submit'
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" />
                  {editingUser ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <FaSave />
                  {editingUser ? 'Update User' : 'Create User'}
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Bulk Upload Modal */}
      <Modal
        show={showBulkUploadModal}
        onHide={() => setShowBulkUploadModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="flex items-center gap-2 text-xl font-bold text-gray-800">
            <FaUpload className="text-info" />
            Bulk Upload Users
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <div className="mb-4">
            <Alert variant="info">
              <p className="mb-2"><strong>CSV Format Required:</strong></p>
              <p className="mb-1">firstname,lastname,email,phone,idnumber,roles,status</p>
              <p className="text-sm">Example: John,Doe,john@email.com,0812345678,9001015123089,LEARNER,ACTIVE</p>
            </Alert>
          </div>

          <ResponseMessage setResponse={setResponse} response={response} />


          <Form.Group>
            <Form.Label>Select CSV File</Form.Label>
            <Form.Control
              type="file"
              accept=".csv"
              onChange={(e) => setBulkFile(e.target.files[0])}
            />
          </Form.Group>

          <div className="mt-4">
            <Button
              variant="outline-success"
              size="sm"
              onClick={() => {
                const template = "firstname,lastname,email,contactNumber,idNo,role\nJohn,Doe,john@email.com,0812345678,9001015123089,LEARNER";
                downloadCSV(template, 'template.csv');
              }}
            >
              <FaDownload className="me-2" /> Download Template
            </Button>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="outline-secondary" onClick={() => setShowBulkUploadModal(false)}>
            Cancel
          </Button>
          <Button
            variant="info"
            onClick={handleBulkUpload}
            disabled={!bulkFile}
            className="text-white"
          >
            Upload & Create Users
          </Button>
        </Modal.Footer>
      </Modal>

      {/* View User Offcanvas */}
      {/*<Offcanvas
        show={showUserDetails}
        onHide={() => setShowUserDetails(false)}
        placement='end'
        className="!w-[100%]"
      >
        <Offcanvas.Header className="border-b px-6 py-4">
          <Offcanvas.Title className="text-xl font-bold text-gray-900">
            User Profile
          </Offcanvas.Title>
          <X onClick={() => setShowUserDetails(false)} className='ms-auto cursor-pointer text-red-600' />
        </Offcanvas.Header>

        <Offcanvas.Body className="p-6">
          <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4">
              {userForm?.firstname?.[0]}{userForm?.lastname?.[0]}
            </div>
            <h4 className="text-2xl font-bold text-gray-900 mb-1">
              {userForm?.firstname} {userForm?.lastname}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-2">
                {userForm?.role && userForm.role.length > 0 ? (
                  <>
                    <span className="flex items-center justify-start gap-2 px-3 min-w-[130px] py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                      {getRoleIcon(userForm.role[0])}
                      <span className="ml-1">{userForm.role[0]}</span>
                    </span>
                    {userForm.role.length > 1 && (
                      <Dropdown align="end">
                        <Dropdown.Toggle
                          as="span"
                          className="cursor-pointer inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 border-0"
                        >
                          +{userForm.role.length - 1} more
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="p-2 min-w-[150px]">
                          {userForm.role.slice(1).map((r, idx) => (
                            <Dropdown.Item
                              key={idx}
                              className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-50"
                              disabled
                            >
                              {getRoleIcon(r)}
                              <span>{r}</span>
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                    )}
                  </>
                ) : (
                  <span className="text-gray-400 text-sm">No role</span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl p-4">
              <h5 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                <FiUser className="text-red-500" /> Personal Information
              </h5>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 bg-white rounded-lg">
                  <FiMail className="text-red-500 w-5 h-5" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Email Address</p>
                    <p className="font-medium text-gray-800">{userForm?.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2 bg-white rounded-lg">
                  <FaPhone className="text-red-500 w-5 h-5" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Contact Number</p>
                    <p className="font-medium text-gray-800">{userForm?.contactNumber || '—'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2 bg-white rounded-lg">
                  <FaIdCard className="text-red-500 w-5 h-5" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">ID Number</p>
                    <p className="font-medium text-gray-800">{userForm?.idNo || '—'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl p-4">
              <h5 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                <FaHistory className="text-red-500" /> Account Activity
              </h5>
              <div className="space-y-3">
                <div className="bg-white p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Account Created</p>
                  <p className="font-medium text-gray-800">
                    {readableDate(userForm?.createdAt)}
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Last Login</p>
                  <p className="font-medium text-gray-800">
                    {formatLastLogin(userForm?.last_login) || "User has not logged in yet"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Offcanvas.Body>

      <div className="border-t bg-gray-50 px-6 py-4 flex justify-end gap-3">
        <Button
          variant="warning"
          onClick={() => {
            setShowUserDetails(false);
            handleEditUser(userForm);
          }}
          className="flex items-center gap-2 px-5 py-2 border-2 hover:bg-red-50 transition-all duration-200"
        >
          <FaEdit className="w-4 h-4" /> Edit
        </Button>
        <Button
          variant="outline-primary"
          onClick={() => setShowUserDetails(false)}
          className="flex items-center gap-2 px-5 py-2 hover:shadow-md transition-all duration-200"
        >
          <FaTimes className="w-4 h-4" /> Close
        </Button>
      </div>
    </Offcanvas>*/}

      <UserProfileOffcanvas
        showUserDetails={showUserDetails}
        setShowUserDetails={setShowUserDetails}
        userForm={userForm}
        getRoleIcon={getRoleIcon}
        readableDate={readableDate}
        formatLastLogin={formatLastLogin}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
        size="sm"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header className="border-0 pb-0 flex justify-between">
          <Modal.Title className="text-lg font-semibold text-gray-800">
            Confirm Delete
          </Modal.Title>
          <X onClick={() => setShowDeleteModal(false)} className='text-red-600 cursor-pointer' />
        </Modal.Header>

        <Modal.Body className="text-center pt-2 pb-4">
          <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <FaTrash className="text-red-500 text-xl" />
          </div>

          <h5 className="font-semibold text-gray-800 mb-1">
            Delete {userForm.firstname} {userForm.lastname}?
          </h5>

          <p className="text-gray-500 text-sm mb-3">
            This action cannot be undone.
          </p>

          {userForm.role?.length > 0 && (
            <div className="flex justify-center gap-1 flex-wrap mb-4">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                {getRoleIcon(userForm.role[0])}
                {userForm.role[0]}
              </span>
              {userForm.role.length > 1 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  +{userForm.role.length - 1}
                </span>
              )}
            </div>
          )}
        </Modal.Body>

        <Modal.Footer className="border-0 pt-0 justify-content-center gap-2">
          <Button
            variant="outline-secondary"
            onClick={() => setShowDeleteModal(false)}
            disabled={loading}
            className="px-4"
          >
            Cancel
          </Button>
          <Button
            variant="outline-danger"
            onClick={handleDeleteUser}
            disabled={loading}
            className="px-4 d-flex align-items-center gap-2"
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" />
                Deleting...
              </>
            ) : (
              <>
                <FaTrash size={14} /> Delete
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/**BULK DELETE MODAL */}

      <Modal
        show={showBulkDeleteModal}
        onHide={() => setShowBulkDeleteModal(false)}
        centered
        backdrop="static"
        className="text-gray-800"
      >
        <Modal.Header closeButton className="border-b border-gray-200 pb-4">
          <Modal.Title className="text-xl font-semibold text-gray-900">
            Bulk Delete
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="py-6">
          <p className="text-gray-700">
            Are you sure you want to delete <strong className="font-semibold text-gray-900">{bulkSelection.length}</strong> user{bulkSelection.length !== 1 ? 's' : ''}?
          </p>
          <p className="mt-3 text-sm text-red-600 bg-red-50 p-3 rounded-md">
            ⚠️ This action cannot be undone.
          </p>
        </Modal.Body>

        <Modal.Footer className="border-t border-gray-200 pt-4 gap-3">
          <Button
            variant="outline-danger"
            onClick={() => setShowBulkDeleteModal(false)}
            className="px-4 py-2 text-sm font-medium"
          >
            Cancel
          </Button>
          <Button
            variant="success"
            onClick={handleBulkDelete}
            className="px-4 py-2 text-sm font-medium"
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      <RoleManagerModal show={roleManager} setShow={setShowRoleManager} user={userForm} />
    </div >
  );
}
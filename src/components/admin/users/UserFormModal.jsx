import { apiFetch } from '@/api/api';
import ResponseMessage from '@/components/common/ResponseMessage';
import { USERS } from '@/utils/apiEndpoint';
import { PenSquareIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Alert, Button, Form, Modal, Spinner } from 'react-bootstrap';
import { FaEnvelope, FaSave, FaUserPlus } from 'react-icons/fa';
import { useTopLoader } from '../../../contexts/TopLoaderContext';
import { isValidSouthAfricanID } from "../../../utils/validateIdNo.js";
import { useApiResponse } from '@/contexts/ApiResponseContext';

export default function UserFormModal({
    show,
    setShow,
    editingUser,
    setEditingUser,
    getUsers,
    setResponse,
    response
}) {
    const [loading, setLoading] = useState(false);
    const [validated, setValidated] = useState(false);
    const [invalidIdno, setInvalidIdno] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [roleRequired, setRoleRequired] = useState(false);
    const { start, complete } = useTopLoader();
    const { showResponse } = useApiResponse()

    const roles = ['ADMIN', 'PROGRAM_MANAGER', 'FACILITATOR', 'MENTOR', 'INTERN', 'LEARNER', 'ASSESSOR', 'MODERATOR'];

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

    const resetForm = () => {
        if (editingUser) {
            setUserForm({ ...editingUser });
        } else {
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
        }
        setInvalidIdno(false);
        setRoleRequired(false);
        setValidated(false);
    };

    useEffect(() => {
        if (show) {
            if (editingUser) {
                setUserForm({
                    ...editingUser,
                    password: "",
                    confirmPassword: ""
                });
            } else {
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
            }

            setInvalidIdno(false);
            setRoleRequired(false);
            setValidated(false);
        }
    }, [editingUser, show]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === "contactNumber" && value !== "") {
            if (!/^\d*$/.test(value) || value.length > 10 || value[0] !== "0") return;
        }

        setUserForm({ ...userForm, [name]: value });
    };

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        start();

        if (e.currentTarget.checkValidity() === false) {
            e.stopPropagation();
            setLoading(false);
            setValidated(true);
            setTimeout(() => complete(), 1500);
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
            const url = editingUser ? `${USERS}/${userForm.id}` : USERS;
            const method = editingUser ? "PUT" : "POST";

            const result = await apiFetch(url, {
                method,
                body: userForm
            });

            setResponse(result);
            showResponse(result)

            await getUsers();

            if (result?.success) {
                handleClose();
            }


        } catch (error) {
            setResponse({ success: false, message: "An error occurred. Please try again." + error.message });
        } finally {
            complete();
            setLoading(false);
        }
    };

    const handleClose = () => {
        setShow(false);
        setEditingUser(null);
        resetForm();
        setValidated(false);
        setInvalidIdno(false);
        setRoleRequired(false);
    };

    return (
        <Modal
            show={show}
            onHide={handleClose}
            size="lg"
            centered
            backdrop="static"
            keyboard={false}
        >
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Modal.Header closeButton className="flex border-0 py-3">
                    <Modal.Title className="flex gap-2 items-center text-xl font-bold text-gray-800">
                        {editingUser ?
                            <PenSquareIcon size={25} className='text-slate-600' /> :
                            <FaUserPlus size={25} className='text-blue-600' />
                        }
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
                            <Form.Label className='truncate'>Identification Number (RSA ID)</Form.Label>
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
                            <div className="position-relative">
                                <Form.Control
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={userForm?.password}
                                    onChange={handleInputChange}
                                    required={!editingUser}
                                    className="border-gray-300"
                                />
                                <Button
                                    variant="link"
                                    className="position-absolute end-0 top-0 text-decoration-none"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{ zIndex: 2 }}
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </Button>
                            </div>
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
                        onClick={handleClose}
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
    );
}
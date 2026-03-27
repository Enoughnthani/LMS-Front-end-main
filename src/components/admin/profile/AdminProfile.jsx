import { Calendar, CalendarClock, IdCard } from 'lucide-react';
import { useState } from 'react';
import { Alert, Badge, Button, Card, Form, InputGroup, Tab, Tabs } from 'react-bootstrap';
import { BsGenderFemale, BsGenderMale } from 'react-icons/bs';
import {
  FaBell,
  FaCheckCircle,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaKey,
  FaLock,
  FaPhone,
  FaSave,
  FaShieldAlt,
  FaTimes,
  FaUpload,
  FaUserEdit
} from 'react-icons/fa';
import { FiMail, FiSettings, FiUser } from 'react-icons/fi';
import { readableDate } from '../../../utils/readableDate';
import { formatLastLogin } from '../../../utils/formatLastLogin';  

export default function AdminProfile({ user, setUser }) {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);

  const [adminData, setAdminData] = useState({
    firstname: 'Alex',
    lastname: 'Johnson',
    email: 'alex.johnson@company.com',
    phone: '+1 (555) 123-4567',
    role: 'Super Administrator',
    department: 'IT & Operations',
    joinDate: 'Jan 15, 2023',
    lastLogin: 'Today, 09:42 AM',
    status: 'active',
    bio: 'Lead administrator for the internship and leadership programs. Specialized in system management and user support.',
    notificationEmail: true,
    notificationSMS: false,
    twoFactorEnabled: true,
  });

  const [formData, setFormData] = useState({ ...adminData });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [profileImage, setProfileImage] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      setAdminData({ ...formData });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
    setIsEditing(!isEditing);
  };

  const handleCancelEdit = () => {
    setFormData({ ...adminData });
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordUpdate = () => {
    // Password validation logic here
    if (passwordData.newPassword === passwordData.confirmPassword) {
      Alert.success('Password updated successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } else {
      Alert.error('Passwords do not match!');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        setFormData(prev => ({ ...prev }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="h-screen overflow-y-auto w-full p-4 md:p-6">
      <div className="">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center text-white text-2xl md:text-3xl font-bold">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : adminData.firstname[0] + adminData.lastname[0]}
                </div>
                {isEditing && (
                  <label htmlFor="profile-upload" className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center  cursor-pointer hover:bg-gray-50 transition-all border-2 border-red-100">
                    <FaUpload className="text-red-600 text-sm" />
                    <input
                      id="profile-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>
              <div className='flex flex-col items-center'>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                  {adminData.firstname} {adminData.lastname}
                </h1>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <Badge bg="danger" className="px-3 py-1.5 rounded-full text-sm">
                    {adminData.role}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end gap-3">
              {saveSuccess && (
                <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg border border-green-200 flex items-center gap-2">
                  <FaCheckCircle /> Profile updated successfully!
                </div>
              )}
              <div className="flex gap-3">
                <Button
                  variant={isEditing ? "outline-danger" : "outline-primary"}
                  size="sm"
                  onClick={isEditing ? handleCancelEdit : () => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2"
                >
                  {isEditing ? (
                    <>
                      <FaTimes /> Cancel
                    </>
                  ) : (
                    <>
                      <FaUserEdit /> Edit Profile
                    </>
                  )}
                </Button>
                {isEditing && (
                  <Button
                    variant="outline-success"
                    size="sm"
                    onClick={handleEditToggle}
                    className="flex items-center gap-2 px-4 py-2"
                  >
                    <FaSave /> Save Changes
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Card className="border-0 rounded-xl overflow-hidden">
          <Card.Body className="p-0">
            <Tabs
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)}
              className="px-6 pt-4 border-b border-gray-200"
              fill
            >
              <Tab
                eventKey="profile"
                title={
                  <span className="flex items-center gap-2 py-2">
                    <FiUser className="text-lg" /> Profile Information
                  </span>
                }
              />
              <Tab
                eventKey="security"
                title={
                  <span className="flex items-center gap-2 py-2">
                    <FaShieldAlt className="text-lg" /> Security
                  </span>
                }
              />
              <Tab
                eventKey="preferences"
                title={
                  <span className="flex items-center gap-2 py-2">
                    <FiSettings className="text-lg" /> Preferences
                  </span>
                }
              />
            </Tabs>

            <div className="p-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Form.Group>
                      <Form.Label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                        <FiUser /> First Name
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="firstname"
                        value={user?.firstname}
                        onChange={handleInputChange}
                        className="border-gray-300  py-2.5"
                        placeholder="Enter first name"
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                        <FiUser /> Last Name
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="lastname"
                        value={user?.lastname}
                        onChange={handleInputChange}
                        className="border-gray-300  py-2.5"
                        placeholder="Enter last name"
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                        <FiMail /> Email Address
                      </Form.Label>

                      <InputGroup>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="border-gray-300  py-2.5"
                          placeholder="Enter email address"
                        />

                        <Badge bg="success" className="text-xs flex items-center justify-center">
                          Verified
                        </Badge>
                      </InputGroup>
                    </Form.Group>

                    <Form.Group>
                      <Form.Label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                        <FaPhone /> Phone Number
                      </Form.Label>
                      <Form.Control
                        type="tel"
                        name="contact_number"
                        value={user?.contact_number}
                        onChange={handleInputChange}
                        className="border-gray-300  py-2.5"
                        placeholder="Enter phone number"
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                        <IdCard /> Identification Number (RSA ID)
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="id_no"
                        value={user?.id_no}
                        onChange={handleInputChange}
                        className="border-gray-300  py-2.5"
                        placeholder="Enter phone number"
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                        <Calendar /> Date Of Birth
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="dob"
                        value={user?.id_no}
                        className="border-gray-300  py-2.5"
                        disabled
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                        {user?.gender === "Male" ? <BsGenderMale /> : <BsGenderFemale />} Gender
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="gender"
                        value={user?.gender}
                        className="border-gray-300  py-2.5"
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                        <CalendarClock /> Created On
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="createdAt"
                        value={readableDate(user?.createdAt)}
                        className="border-gray-300  py-2.5"
                        disabled
                      />
                    </Form.Group>
                  </div>

                  <div className="bg-gradient-to-r from-red-50 to-red-50/50 p-3 rounded-xl border border-red-100">
                    <div>
                      <p className="text-sm font-semibold text-gray-600 mb-1">
                        {user?.prev_login
                          ? `Last login: ${formatLastLogin(user.prev_login)}`
                          : "This is your first login"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <Card className="border-0  bg-gradient-to-r from-red-50 to-red-50/50">
                    <Card.Body className="p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                          <FaLock className="text-red-600 text-xl" />
                        </div>
                        <div>
                          <h5 className="font-bold text-gray-800">Password Security</h5>
                          <p className="text-sm text-gray-600">Update your password to keep your account secure</p>
                        </div>
                      </div>

                      <Form.Group className="mb-4">
                        <Form.Label className="text-gray-700 font-medium">Current Password</Form.Label>
                        <div className="relative">
                          <Form.Control
                            type={showPassword ? "text" : "password"}
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            placeholder="Enter current password"
                            className="border-gray-300  pe-10 py-2.5"
                          />
                          <Button
                            variant="link"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </Button>
                        </div>
                      </Form.Group>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <Form.Group>
                          <Form.Label className="text-gray-700 font-medium">New Password</Form.Label>
                          <Form.Control
                            type={showPassword ? "text" : "password"}
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            placeholder="Enter new password"
                            className="border-gray-300  py-2.5"
                          />
                        </Form.Group>

                        <Form.Group>
                          <Form.Label className="text-gray-700 font-medium">Confirm Password</Form.Label>
                          <Form.Control
                            type={showPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            placeholder="Confirm new password"
                            className="border-gray-300  py-2.5"
                          />
                        </Form.Group>
                      </div>

                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="text-sm text-gray-500">
                          <p className="mb-1">Password requirements:</p>
                          <ul className="list-disc list-inside space-y-1">
                            <li>At least 8 characters</li>
                            <li>Uppercase & lowercase letters</li>
                            <li>At least one number</li>
                          </ul>
                        </div>
                        <Button
                          variant="danger"
                          onClick={handlePasswordUpdate}
                          disabled={!passwordData.currentPassword || !passwordData.newPassword}
                          className="px-6 py-2.5 flex items-center gap-2"
                        >
                          <FaKey /> Update Password
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <Card className="border-0 ">
                    <Card.Body className="p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <FaBell className="text-purple-600" />
                        </div>
                        <div>
                          <h5 className="font-bold text-gray-800">Notification Preferences</h5>
                          <p className="text-sm text-gray-600">Choose how you want to receive notifications</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-red-200 transition-colors">
                          <div className="flex items-center gap-3">
                            <FaEnvelope className="text-gray-500" />
                            <div>
                              <h6 className="font-medium text-gray-800">Email Notifications</h6>
                              <p className="text-sm text-gray-600">Receive updates and alerts via email</p>
                            </div>
                          </div>
                          <Form.Check
                            type="switch"
                            id="email-notifications"
                            checked={adminData.notificationEmail}
                            onChange={(e) => setAdminData(prev => ({
                              ...prev,
                              notificationEmail: e.target.checked
                            }))}
                          />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-red-200 transition-colors">
                          <div className="flex items-center gap-3">
                            <FaPhone className="text-gray-500" />
                            <div>
                              <h6 className="font-medium text-gray-800">SMS Notifications</h6>
                              <p className="text-sm text-gray-600">Receive important alerts via SMS</p>
                            </div>
                          </div>
                          <Form.Check
                            type="switch"
                            id="sms-notifications"
                            checked={adminData.notificationSMS}
                            onChange={(e) => setAdminData(prev => ({
                              ...prev,
                              notificationSMS: e.target.checked
                            }))}
                          />
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              )}
            </div>
          </Card.Body>
        </Card>

        {/* Footer Actions */}
        <div className="mt-6 flex justify-between items-center text-sm text-gray-500">
          <div>
            <span className="font-medium">System Access Level: </span>
            <Badge bg="danger" className="ms-2">Full Administrator</Badge>
          </div>
          <div className="text-xs">
            Last profile update: {new Date().toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
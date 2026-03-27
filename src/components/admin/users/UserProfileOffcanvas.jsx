import React from 'react';
import { Offcanvas, Dropdown } from 'react-bootstrap';
import { X, User, Mail, Phone, CreditCard, Clock, Shield, Calendar, MapPin, MoreHorizontal } from 'lucide-react';

const UserProfileOffcanvas = ({ 
  showUserDetails, 
  setShowUserDetails, 
  userForm, 
  getRoleIcon, 
  readableDate, 
  formatLastLogin 
}) => {
  
  const getInitials = () => {
    const first = userForm?.firstname?.[0] || '';
    const last = userForm?.lastname?.[0] || '';
    return (first + last).toUpperCase();
  };

  const getFullName = () => {
    return `${userForm?.firstname || ''} ${userForm?.lastname || ''}`.trim() || 'Unknown User';
  };

  return (
    <Offcanvas
      show={showUserDetails}
      onHide={() => setShowUserDetails(false)}
      placement="end"
      className="!w-[420px] !max-w-full"
      backdropClassName="backdrop-blur-sm bg-black/30"
    >
      {/* Glassmorphism Header */}
      <Offcanvas.Header className="border-b border-gray-100/80 px-6 py-5 bg-white/95 backdrop-blur-xl sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 via-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/20">
            <User className="w-5 h-5 text-white" />
          </div>
          <Offcanvas.Title className="text-lg font-bold text-gray-900 tracking-tight">
            User Profile
          </Offcanvas.Title>
        </div>
        <button 
          onClick={() => setShowUserDetails(false)}
          className="ms-auto p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 group"
        >
          <X className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
        </button>
      </Offcanvas.Header>

      <Offcanvas.Body className="p-0 bg-gray-50/50">
        {/* Hero Section */}
        <div className="relative px-6 pt-8 pb-6 bg-white overflow-hidden">
          {/* Decorative Background Blobs */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-red-100 to-rose-50 rounded-full blur-3xl opacity-60" />
          <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-gradient-to-tr from-orange-50 to-red-50 rounded-full blur-2xl opacity-40" />
          
          <div className="relative flex flex-col items-center">
            {/* Avatar with Glow Ring */}
            <div className="relative mb-5">
              <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-rose-600 rounded-full blur opacity-20 scale-110" />
              <div className="w-28 h-28 bg-gradient-to-br from-red-500 via-rose-500 to-red-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-red-500/30 ring-4 ring-white relative z-10">
                {getInitials()}
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-full border-4 border-white shadow-sm z-20" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
              {getFullName()}
            </h2>
            
            {/* Role Badges */}
            <div className="flex items-center gap-2 flex-wrap justify-center">
              {userForm?.role && userForm.role.length > 0 ? (
                <>
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border border-red-100 shadow-sm">
                    {getRoleIcon(userForm.role[0])}
                    <span>{userForm.role[0]}</span>
                  </span>
                  
                  {userForm.role.length > 1 && (
                    <Dropdown align="end">
                      <Dropdown.Toggle
                        as="button"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all border-0"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                        <span>+{userForm.role.length - 1}</span>
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="p-2 min-w-[180px] border-0 shadow-xl rounded-xl mt-2">
                        <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          All Roles
                        </div>
                        {userForm.role.slice(1).map((r, idx) => (
                          <Dropdown.Item
                            key={idx}
                            className="flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg hover:bg-red-50 transition-colors"
                            disabled
                          >
                            <span className="text-red-500">{getRoleIcon(r)}</span>
                            <span className="text-gray-700 font-medium">{r}</span>
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  )}
                </>
              ) : (
                <span className="text-gray-400 text-sm italic">No role assigned</span>
              )}
            </div>
          </div>
        </div>

        {/* Content Cards */}
        <div className="px-6 py-6 space-y-5">
          
          {/* Personal Information */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-sm">
                <User className="w-4 h-4 text-white" />
              </div>
              <h5 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                Personal Information
              </h5>
            </div>
            
            <div className="space-y-3">
              <div className="group flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0 group-hover:bg-red-100 transition-colors">
                  <Mail className="w-5 h-5 text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 mb-0.5">Email Address</p>
                  <p className="font-semibold text-gray-900 truncate">{userForm?.email || '—'}</p>
                </div>
              </div>

              <div className="group flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0 group-hover:bg-orange-100 transition-colors">
                  <Phone className="w-5 h-5 text-orange-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 mb-0.5">Contact Number</p>
                  <p className="font-semibold text-gray-900">{userForm?.contactNumber || '—'}</p>
                </div>
              </div>

              <div className="group flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                  <CreditCard className="w-5 h-5 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 mb-0.5">ID Number</p>
                  <p className="font-semibold text-gray-900">{userForm?.idNo || '—'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Activity */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-sm">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <h5 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                Account Activity
              </h5>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start gap-4 p-3 rounded-xl bg-gradient-to-r from-gray-50 to-transparent">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-emerald-500" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500 mb-0.5">Account Created</p>
                  <p className="font-semibold text-gray-900">{readableDate(userForm?.createdAt)}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-3 rounded-xl bg-gradient-to-r from-gray-50 to-transparent">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-purple-500" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500 mb-0.5">Last Login</p>
                  <p className="font-semibold text-gray-900">
                    {formatLastLogin(userForm?.last_login) || (
                      <span className="text-gray-400 italic">User has not logged in yet</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Security Status Banner */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 border border-emerald-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center">
                <Shield className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-emerald-900">Account Secure</p>
                <p className="text-xs text-emerald-600">All security checks passed</p>
              </div>
              <div className="ms-auto">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-sm">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Footer Actions */}
        <div className="px-6 py-4 bg-white border-t border-gray-100 sticky bottom-0">
          <div className="flex gap-3">
            <button 
              onClick={() => setShowUserDetails(false)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-semibold text-sm hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
            <button className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold text-sm shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 transition-all hover:-translate-y-0.5">
              Edit Profile
            </button>
          </div>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default UserProfileOffcanvas;
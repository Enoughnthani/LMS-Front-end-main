import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { 
  Users, 
  X, 
  Search, 
  Plus, 
  Trash2, 
  Shield, 
  CheckCircle2, 
  Clock,
  ChevronRight
} from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';

const RoleManagerModal = ({ show, setShow, user }) => {
  const roles = [
    { id: 'ADMIN', label: 'Admin', desc: 'Full system access & control' },
    { id: 'PROGRAM_MANAGER', label: 'Program Manager', desc: 'Manage programs and curriculum' },
    { id: 'FACILITATOR', label: 'Facilitator', desc: 'Lead sessions and workshops' },
    { id: 'MENTOR', label: 'Mentor', desc: 'Guide and support learners' },
    { id: 'INTERN', label: 'Intern', desc: 'Participate in learning activities' },
    { id: 'LEARNER', label: 'Learner', desc: 'Access learning materials' },
    { id: 'ASSESSOR', label: 'Assessor', desc: 'Evaluate and grade submissions' },
    { id: 'MODERATOR', label: 'Moderator', desc: 'Moderate content and discussions' }
  ];

  const [currentRoles, setCurrentRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user && user.role) {
      setCurrentRoles(user.role);
    } else {
      setCurrentRoles([]);
    }
  }, [user]);

  const availableRoles = roles.filter(role => 
    !currentRoles.includes(role.id) && 
    (role.label.toLowerCase().includes(searchTerm.toLowerCase()) || 
     role.id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const assignRole = (roleId) => {
    if (!currentRoles.includes(roleId)) {
      setCurrentRoles([...currentRoles, roleId]);
    }
  };

  const removeRole = (roleId) => {
    setCurrentRoles(currentRoles.filter(r => r !== roleId));
  };

  const getRoleLabel = (roleId) => roles.find(r => r.id === roleId)?.label || roleId;

  const getUserDisplayName = () => {
    if (!user) return 'User';
    return `${user.firstname || ''} ${user.lastname || ''}`.trim() || user.email || 'User';
  };

  return (
    <Modal 
      show={show} 
      onHide={() => setShow(false)} 
      centered 
      size="lg"
      backdropClassName="backdrop-blur-sm bg-black/20"
      contentClassName="border-0 shadow-2xl"
    >
      {/* Clean Header */}
      <Modal.Header className="border-0 pb-0 bg-white">
        <div className="flex items-center gap-4 w-full">
          {/* Subtle Avatar */}
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
            <Users className="w-6 h-6 text-slate-600" />
          </div>
          
          <div className="flex-1">
            <Modal.Title className="text-lg font-semibold text-slate-900">
              Manage User Roles
            </Modal.Title>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-medium text-slate-700">
                {getUserDisplayName()}
              </span>
              {user?.email && (
                <span className="text-xs text-slate-400">
                  {user.email}
                </span>
              )}
            </div>
          </div>
          
          <button 
            onClick={() => setShow(false)}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </Modal.Header>

      <Modal.Body className="p-6 bg-slate-50/50">
        {/* Current Roles Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              Current Roles
              <span className="bg-slate-200 text-slate-700 text-xs px-2 py-0.5 rounded-full font-medium">
                {currentRoles.length}
              </span>
            </label>
            {currentRoles.length > 0 && (
              <button 
                onClick={() => setCurrentRoles([])}
                className="text-xs text-slate-500 hover:text-red-500 font-medium flex items-center gap-1 px-2 py-1 rounded-md hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                Clear all
              </button>
            )}
          </div>
          
          {currentRoles.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {currentRoles.map((roleId, index) => (
                <div
                  key={index}
                  className="group flex items-center gap-2 pl-3 pr-2 py-2 bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md hover:border-slate-300 transition-all"
                >
                  <Shield className="w-4 h-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700">
                    {getRoleLabel(roleId)}
                  </span>
                  <button
                    onClick={() => removeRole(roleId)}
                    className="p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors ml-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-white rounded-xl border border-dashed border-slate-200">
              <Shield className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500">No roles assigned</p>
            </div>
          )}
        </div>

        {/* Available Roles Section */}
        <div>
          <label className="text-sm font-semibold text-slate-900 mb-4 block">
            Available Roles
          </label>
          
          {/* Clean Search Input */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search roles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-400 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
              </button>
            )}
          </div>

          {/* Clean Roles List */}
          {availableRoles.length > 0 ? (
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
              {availableRoles.map((role, index) => (
                <div
                  key={index}
                  className="group flex items-center justify-between p-3 bg-white rounded-lg border border-slate-100 hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer"
                  onClick={() => assignRole(role.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                      <Shield className="w-5 h-5 text-slate-500" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-slate-900 block">
                        {role.label}
                      </span>
                      <span className="text-xs text-slate-500">
                        {role.desc}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      assignRole(role.id);
                    }}
                    className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-900 hover:text-white flex items-center justify-center transition-all"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-white rounded-xl border border-dashed border-slate-200">
              <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500">No available roles found</p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-sm text-slate-600 hover:text-slate-900 mt-2 font-medium"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>
      </Modal.Body>

      {/* Clean Footer */}
      <Modal.Footer className="border-t border-slate-100 bg-white px-6 py-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Clock className="w-3 h-3" />
            <span>Changes apply immediately</span>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="light"
              onClick={() => setShow(false)}
              className="px-4 py-2 rounded-lg font-medium text-slate-700 hover:bg-slate-100 border-0"
            >
              Cancel
            </Button>
            <Button 
              onClick={() => {
                console.log('User ID:', user?.id);
                console.log('Updated roles:', currentRoles);
                setShow(false);
              }}
              className="px-4 py-2 rounded-lg font-medium bg-slate-900 hover:bg-slate-800 text-white border-0 shadow-sm hover:shadow transition-all"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Modal.Footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </Modal>
  );
};

export default RoleManagerModal;
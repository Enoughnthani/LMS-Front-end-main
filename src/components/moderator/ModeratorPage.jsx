import React, { useState } from 'react';

// Role Switcher Component (embedded) - Tailwind version
const RoleSwitcher = ({ currentRole, availableRoles, onRoleChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex justify-center items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={() => setIsOpen(!isOpen)}
        >
          Current Role: {currentRole}
          <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute right-0 z-20 mt-2 w-56 rounded-md  bg-white ring-1 ring-black ring-opacity-5">
            <div className="py-1" role="menu" aria-orientation="vertical">
              {availableRoles.map(role => (
                <button
                  key={role}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    role === currentRole
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    onRoleChange(role);
                    setIsOpen(false);
                  }}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const ModeratorPage = () => {
  // Mock user data
  const [user] = useState({
    name: 'Alex Morgan',
    availableRoles: ['Facilitator', 'Assessor', 'Moderator', 'Mentor', 'Intern']
  });
  
  const [currentRole, setCurrentRole] = useState('Moderator');
  const [selectedLearnership, setSelectedLearnership] = useState('all');

  const handleRoleChange = (newRole) => {
    setCurrentRole(newRole);
    console.log(`Switching to ${newRole} role`);
  };

  // Learnership Programs Data
  const learnerships = [
    { 
      id: 1, 
      name: 'Full Stack Web Development', 
      code: 'FSWD-2024',
      learners: 45,
      activeModerations: 12,
      progress: 68,
      status: 'active'
    },
    { 
      id: 2, 
      name: 'Data Science Foundation', 
      code: 'DSF-2024',
      learners: 32,
      activeModerations: 8,
      progress: 45,
      status: 'active'
    },
    { 
      id: 3, 
      name: 'Cloud Computing', 
      code: 'CLC-2024',
      learners: 28,
      activeModerations: 5,
      progress: 32,
      status: 'active'
    },
    { 
      id: 4, 
      name: 'Cybersecurity Essentials', 
      code: 'CSE-2024',
      learners: 23,
      activeModerations: 3,
      progress: 24,
      status: 'pending'
    },
  ];

  // Learners Data by Learnership
  const learnersData = {
    'FSWD-2024': [
      { id: 1, name: 'John Doe', submissions: 8, pendingModeration: 2, status: 'active', lastActive: '2024-03-15', competency: 85 },
      { id: 2, name: 'Jane Smith', submissions: 12, pendingModeration: 4, status: 'active', lastActive: '2024-03-14', competency: 92 },
      { id: 3, name: 'Mike Johnson', submissions: 6, pendingModeration: 1, status: 'warning', lastActive: '2024-03-10', competency: 45 },
      { id: 4, name: 'Sarah Williams', submissions: 10, pendingModeration: 3, status: 'active', lastActive: '2024-03-15', competency: 78 },
      { id: 5, name: 'Tom Brown', submissions: 4, pendingModeration: 0, status: 'inactive', lastActive: '2024-03-01', competency: 25 },
    ],
    'DSF-2024': [
      { id: 6, name: 'Emily Davis', submissions: 9, pendingModeration: 3, status: 'active', lastActive: '2024-03-15', competency: 88 },
      { id: 7, name: 'Chris Wilson', submissions: 7, pendingModeration: 2, status: 'active', lastActive: '2024-03-13', competency: 72 },
    ],
    'CLC-2024': [
      { id: 8, name: 'Lisa Anderson', submissions: 5, pendingModeration: 2, status: 'active', lastActive: '2024-03-12', competency: 65 },
    ],
    'CSE-2024': [
      { id: 9, name: 'David Martin', submissions: 3, pendingModeration: 1, status: 'active', lastActive: '2024-03-11', competency: 42 },
    ]
  };

  // Pending Reviews Data
  const pendingReviews = [
    { id: 1, learnership: 'FSWD-2024', learner: 'John Doe', type: 'Project Submission', title: 'E-commerce App', submitted: '2024-03-15', priority: 'high', timeElapsed: '2 days' },
    { id: 2, learnership: 'FSWD-2024', learner: 'Jane Smith', type: 'Assessment', title: 'React Hooks Quiz', submitted: '2024-03-15', priority: 'medium', timeElapsed: '1 day' },
    { id: 3, learnership: 'DSF-2024', learner: 'Emily Davis', type: 'Project', title: 'Data Analysis Report', submitted: '2024-03-14', priority: 'high', timeElapsed: '3 days' },
    { id: 4, learnership: 'CLC-2024', learner: 'Lisa Anderson', type: 'Lab Work', title: 'AWS Deployment', submitted: '2024-03-14', priority: 'low', timeElapsed: '2 days' },
    { id: 5, learnership: 'FSWD-2024', learner: 'Mike Johnson', type: 'Discussion', title: 'Code Review Request', submitted: '2024-03-13', priority: 'medium', timeElapsed: '4 days' },
    { id: 6, learnership: 'CSE-2024', learner: 'David Martin', type: 'Quiz', title: 'Network Security', submitted: '2024-03-12', priority: 'high', timeElapsed: '5 days' },
  ];

  const filteredReviews = selectedLearnership === 'all' 
    ? pendingReviews 
    : pendingReviews.filter(review => review.learnership === selectedLearnership);

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Header with Role Switcher */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-white rounded-xl  p-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome, {user.name}</h1>
            <p className="text-sm text-gray-500">Moderator Dashboard • Learnership Programs</p>
          </div>
          <RoleSwitcher 
            currentRole={currentRole}
            availableRoles={user.availableRoles}
            onRoleChange={handleRoleChange}
          />
        </div>
      </div>

      {/* Learnership Programs Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Learnership Programs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {learnerships.map(program => (
            <div 
              key={program.id} 
              className={`bg-white rounded-xl  p-4 cursor-pointer transition-all hover:shadow-md ${
                selectedLearnership === program.code ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedLearnership(program.code)}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900">{program.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  program.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {program.status}
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-3">{program.code}</p>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Learners</span>
                <span className="font-medium">{program.learners}</span>
              </div>
              <div className="flex justify-between text-sm mb-3">
                <span className="text-gray-600">Pending</span>
                <span className="font-medium text-yellow-600">{program.activeModerations}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 rounded-full h-2" 
                  style={{ width: `${program.progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">{program.progress}% complete</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Learners List - Left Column */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl  overflow-hidden">
            <div className="bg-white border-b border-gray-200 py-4 px-4">
              <h3 className="font-semibold text-gray-900">
                Learners 
                {selectedLearnership !== 'all' && (
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    ({learnersData[selectedLearnership]?.length || 0})
                  </span>
                )}
              </h3>
            </div>
            <div className="max-h-[600px] overflow-y-auto">
              {selectedLearnership !== 'all' ? (
                <div className="divide-y divide-gray-200">
                  {learnersData[selectedLearnership]?.map(learner => (
                    <div key={learner.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900">{learner.name}</h4>
                          <p className="text-xs text-gray-500">Last active: {learner.lastActive}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(learner.status)}`}>
                          {learner.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                        <div>
                          <p className="text-gray-500">Submissions</p>
                          <p className="font-medium">{learner.submissions}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Pending</p>
                          <p className="font-medium text-yellow-600">{learner.pendingModeration}</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-500">Competency</span>
                          <span className="font-medium">{learner.competency}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className={`rounded-full h-1.5 ${
                              learner.competency >= 70 ? 'bg-green-500' : 
                              learner.competency >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${learner.competency}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  Select a learnership program to view learners
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pending Reviews - Middle and Right Columns */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl  overflow-hidden">
            <div className="bg-white border-b border-gray-200 py-4 px-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-900">Pending Reviews</h3>
                <select 
                  className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={selectedLearnership}
                  onChange={(e) => setSelectedLearnership(e.target.value)}
                >
                  <option value="all">All Learnerships</option>
                  {learnerships.map(p => (
                    <option key={p.id} value={p.code}>{p.code} - {p.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="p-4 max-h-[600px] overflow-y-auto">
              <div className="space-y-4">
                {filteredReviews.map(review => (
                  <div key={review.id} className="border border-gray-200 rounded-lg p-4 hover: transition-shadow">
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full border border-gray-200">
                        {review.learnership}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full border border-gray-200">
                        {review.type}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(review.priority)}`}>
                        {review.priority} priority
                      </span>
                    </div>
                    
                    <div className="mb-3">
                      <h4 className="font-medium text-gray-900">{review.title}</h4>
                      <p className="text-sm text-gray-600">Learner: {review.learner}</p>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Submitted: {review.submitted}
                      </div>
                      <div className="flex items-center text-sm">
                        <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                          review.timeElapsed.includes('5') ? 'bg-red-500' : 
                          review.timeElapsed.includes('4') ? 'bg-yellow-500' : 'bg-green-500'
                        }`}></span>
                        {review.timeElapsed} ago
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button className="px-4 border-0 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                        Review
                      </button>
                      <button className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors">
                        Verify
                      </button>
                      <button className="px-4 py-2 border border-red-300 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors">
                        Flag Issue
                      </button>
                    </div>
                  </div>
                ))}

                {filteredReviews.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    No pending reviews for this learnership
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quality Metrics Footer */}
      <div className="max-w-7xl mx-auto mt-6">
        <div className="bg-white rounded-xl  p-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1">Assessment Accuracy</p>
              <p className="text-2xl font-bold text-blue-600">94%</p>
            </div>
            <div className="text-center border-l border-r border-gray-200">
              <p className="text-sm text-gray-500 mb-1">Pending Moderations</p>
              <p className="text-2xl font-bold text-yellow-600">12</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1">Resolved Today</p>
              <p className="text-2xl font-bold text-green-600">8</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModeratorPage;
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  FaSearch, FaUserGraduate, FaEnvelope, FaPhone, FaCalendarAlt, 
  FaVenusMars, FaEye, FaCheckCircle, FaClock, FaChartLine,
  FaUsers, FaUserCheck, FaUserFriends, FaTrophy, FaFilter,
  FaSortAmountDown, FaGraduationCap, FaChevronRight, FaSlidersH
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function EnrolledLearnerView() {
  const { programId } = useParams();
  const [learners, setLearners] = useState([]);
  const [filteredLearners, setFilteredLearners] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGender, setFilterGender] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const mockLearners = [
      {
        id: 1,
        firstname: "Alice",
        lastname: "Johnson",
        email: "alice.johnson@example.com",
        contactNumber: "0812345678",
        gender: "Female",
        dob: "1995-03-15",
        enrollmentDate: "2026-01-15",
        status: "ACTIVE",
        progress: 75,
        lastActive: "2026-04-28",
        reportsSubmitted: 3,
        assessmentsCompleted: 5
      },
      {
        id: 2,
        firstname: "Bob",
        lastname: "Smith",
        email: "bob.smith@example.com",
        contactNumber: "0823456789",
        gender: "Male",
        dob: "1994-07-22",
        enrollmentDate: "2026-01-15",
        status: "ACTIVE",
        progress: 60,
        lastActive: "2026-04-27",
        reportsSubmitted: 2,
        assessmentsCompleted: 4
      },
      {
        id: 3,
        firstname: "Carol",
        lastname: "Davis",
        email: "carol.davis@example.com",
        contactNumber: "0834567890",
        gender: "Female",
        dob: "1996-11-08",
        enrollmentDate: "2026-02-01",
        status: "ACTIVE",
        progress: 45,
        lastActive: "2026-04-26",
        reportsSubmitted: 1,
        assessmentsCompleted: 3
      },
      {
        id: 4,
        firstname: "David",
        lastname: "Wilson",
        email: "david.wilson@example.com",
        contactNumber: "0845678901",
        gender: "Male",
        dob: "1993-09-30",
        enrollmentDate: "2026-01-20",
        status: "INACTIVE",
        progress: 30,
        lastActive: "2026-04-15",
        reportsSubmitted: 1,
        assessmentsCompleted: 2
      },
      {
        id: 5,
        firstname: "Emma",
        lastname: "Brown",
        email: "emma.brown@example.com",
        contactNumber: "0856789012",
        gender: "Female",
        dob: "1997-05-12",
        enrollmentDate: "2026-02-10",
        status: "ACTIVE",
        progress: 85,
        lastActive: "2026-04-29",
        reportsSubmitted: 3,
        assessmentsCompleted: 6
      }
    ];
    
    setTimeout(() => {
      setLearners(mockLearners);
      setFilteredLearners(mockLearners);
      setLoading(false);
    }, 800);
  }, [programId]);

  useEffect(() => {
    let result = [...learners];
    
    if (searchTerm) {
      result = result.filter(learner => 
        learner.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        learner.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        learner.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterGender !== 'ALL') {
      result = result.filter(learner => learner.gender === filterGender);
    }
    
    if (filterStatus !== 'ALL') {
      result = result.filter(learner => learner.status === filterStatus);
    }
    
    // Sort
    result.sort((a, b) => {
      if (sortBy === 'name') return `${a.firstname} ${a.lastname}`.localeCompare(`${b.firstname} ${b.lastname}`);
      if (sortBy === 'progress') return b.progress - a.progress;
      if (sortBy === 'enrollment') return new Date(b.enrollmentDate) - new Date(a.enrollmentDate);
      return 0;
    });
    
    setFilteredLearners(result);
  }, [searchTerm, filterGender, filterStatus, learners, sortBy]);

  const stats = {
    total: learners.length,
    active: learners.filter(l => l.status === 'ACTIVE').length,
    inactive: learners.filter(l => l.status === 'INACTIVE').length,
    female: learners.filter(l => l.gender === 'Female').length,
    male: learners.filter(l => l.gender === 'Male').length,
    avgProgress: Math.round(learners.reduce((sum, l) => sum + l.progress, 0) / learners.length) || 0
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'from-emerald-400 to-teal-500';
    if (progress >= 50) return 'from-amber-400 to-orange-500';
    return 'from-rose-400 to-pink-500';
  };

  const getProgressBg = (progress) => {
    if (progress >= 80) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (progress >= 50) return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-rose-50 text-rose-700 border-rose-200';
  };

  const getAvatarGradient = (gender, id) => {
    const gradients = gender === 'Female' 
      ? ['from-rose-300 via-pink-400 to-fuchsia-500', 'from-orange-300 via-red-400 to-rose-500']
      : ['from-sky-300 via-blue-400 to-indigo-500', 'from-teal-300 via-cyan-400 to-blue-500'];
    return gradients[id % gradients.length];
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="w-full overflow-y-auto h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100">
      {/* Subtle ambient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 right-1/4 w-80 h-80 bg-teal-200/15 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                  <FaGraduationCap className="text-white text-sm" />
                </div>
                <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Program #{programId}</span>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-transparent">
                Enrolled Learners
              </h1>
              <p className="text-sm text-gray-500 mt-1">Monitor progress and engagement across all enrolled participants</p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/60 shadow-sm p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 font-medium ${
                    viewMode === 'grid' 
                      ? 'bg-gray-900 text-white shadow-md' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 font-medium ${
                    viewMode === 'list' 
                      ? 'bg-gray-900 text-white shadow-md' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'
                  }`}
                >
                  List
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8"
        >
          {[
            { icon: FaUsers, label: 'Total', value: stats.total, color: 'from-slate-500 to-gray-600', bg: 'bg-slate-50', text: 'text-slate-700' },
            { icon: FaUserCheck, label: 'Active', value: stats.active, color: 'from-emerald-400 to-teal-500', bg: 'bg-emerald-50', text: 'text-emerald-700' },
            { icon: FaClock, label: 'Inactive', value: stats.inactive, color: 'from-rose-400 to-pink-500', bg: 'bg-rose-50', text: 'text-rose-700' },
            { icon: FaUserFriends, label: 'Female', value: stats.female, color: 'from-pink-400 to-fuchsia-500', bg: 'bg-pink-50', text: 'text-pink-700' },
            { icon: FaUserGraduate, label: 'Male', value: stats.male, color: 'from-sky-400 to-blue-500', bg: 'bg-sky-50', text: 'text-sky-700' },
            { icon: FaChartLine, label: 'Avg Progress', value: `${stats.avgProgress}%`, color: 'from-amber-400 to-orange-500', bg: 'bg-amber-50', text: 'text-amber-700' },
          ].map((stat, i) => (
            <motion.div 
              key={stat.label}
              variants={itemVariants}
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
              className="bg-white/70 backdrop-blur-md rounded-2xl p-4 border border-white/50 shadow-sm shadow-gray-200/50 hover:shadow-md hover:shadow-gray-200/50 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                  <stat.icon className="text-white text-xs" />
                </div>
                <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">{stat.label}</span>
              </div>
              <p className={`text-2xl font-bold ${stat.text}`}>{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Filters Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200/60 shadow-sm p-4 mb-6"
        >
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1 relative group">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors text-sm" />
              <input
                type="text"
                placeholder="Search learners by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all placeholder:text-gray-400"
              />
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all flex items-center gap-2 ${
                  showFilters 
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                    : 'bg-white border-gray-200/60 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <FaSlidersH size={12} />
                Filters
              </button>
              
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none px-4 py-3 pr-10 bg-white border border-gray-200/60 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 cursor-pointer font-medium"
                >
                  <option value="name">Sort by Name</option>
                  <option value="progress">Sort by Progress</option>
                  <option value="enrollment">Sort by Enrollment</option>
                </select>
                <FaSortAmountDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs" />
              </div>
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pt-3 mt-3 border-t border-gray-100 flex gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-500 uppercase">Gender:</span>
                    {['ALL', 'Female', 'Male'].map(g => (
                      <button
                        key={g}
                        onClick={() => setFilterGender(g)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          filterGender === g
                            ? 'bg-gray-900 text-white shadow-sm'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {g === 'ALL' ? 'All' : g}
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-500 uppercase">Status:</span>
                    {['ALL', 'ACTIVE', 'INACTIVE'].map(s => (
                      <button
                        key={s}
                        onClick={() => setFilterStatus(s)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          filterStatus === s
                            ? s === 'ACTIVE' ? 'bg-emerald-600 text-white' : s === 'INACTIVE' ? 'bg-gray-600 text-white' : 'bg-gray-900 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 animate-pulse" />
              <div className="absolute inset-0 w-12 h-12 rounded-2xl border-2 border-white/30 animate-spin" style={{ borderTopColor: 'transparent' }} />
            </div>
            <p className="mt-4 text-sm text-gray-400 font-medium">Loading learners...</p>
          </div>
        ) : filteredLearners.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200/60 p-16 text-center"
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <FaUserGraduate className="text-gray-300 text-3xl" />
            </div>
            <p className="text-gray-600 font-semibold text-lg">No learners found</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filter criteria</p>
          </motion.div>
        ) : viewMode === 'grid' ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
          >
            <AnimatePresence>
              {filteredLearners.map((learner, index) => (
                <motion.div
                  key={learner.id}
                  variants={itemVariants}
                  layout
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="group bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200/40 shadow-sm hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-300 overflow-hidden"
                >
                  {/* Top accent bar */}
                  <div className={`h-1 bg-gradient-to-r ${getProgressColor(learner.progress)}`} />
                  
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${getAvatarGradient(learner.gender, learner.id)} flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/20`}>
                          {learner.firstname[0]}{learner.lastname[0]}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{learner.firstname} {learner.lastname}</h3>
                          <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${learner.gender === 'Female' ? 'bg-pink-400' : 'bg-blue-400'}`} />
                            <span>{learner.gender}</span>
                            <span className="text-gray-300">•</span>
                            <span>{new Date(learner.dob).getFullYear()}</span>
                          </div>
                        </div>
                      </div>
                      <span className={`text-[11px] px-2.5 py-1 rounded-full font-semibold border ${
                        learner.status === 'ACTIVE' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-gray-50 text-gray-500 border-gray-200'
                      }`}>
                        {learner.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <div className="space-y-2.5 mb-4">
                      <div className="flex items-center gap-3 text-sm text-gray-500 group/item hover:text-gray-700 transition-colors">
                        <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                          <FaEnvelope size={11} className="text-gray-400" />
                        </div>
                        <span className="truncate">{learner.email}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-500 group/item hover:text-gray-700 transition-colors">
                        <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                          <FaPhone size={11} className="text-gray-400" />
                        </div>
                        <span>{learner.contactNumber}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-500 group/item hover:text-gray-700 transition-colors">
                        <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                          <FaCalendarAlt size={11} className="text-gray-400" />
                        </div>
                        <span>Enrolled {new Date(learner.enrollmentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>
                    
                    {/* Progress Section */}
                    <div className="mb-4 p-3 rounded-xl bg-gray-50/80">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-medium text-gray-500">Course Progress</span>
                        <span className={`text-sm font-bold ${learner.progress >= 80 ? 'text-emerald-600' : learner.progress >= 50 ? 'text-amber-600' : 'text-rose-600'}`}>
                          {learner.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200/50 rounded-full h-2 overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${learner.progress}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          className={`h-full rounded-full bg-gradient-to-r ${getProgressColor(learner.progress)}`}
                        />
                      </div>
                    </div>
                    
                    {/* Footer Stats */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex gap-4">
                        <div className="text-center">
                          <p className="text-lg font-bold text-gray-800">{learner.reportsSubmitted}</p>
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Reports</p>
                        </div>
                        <div className="w-px bg-gray-200" />
                        <div className="text-center">
                          <p className="text-lg font-bold text-gray-800">{learner.assessmentsCompleted}</p>
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Assessments</p>
                        </div>
                      </div>
                      <button className="w-9 h-9 rounded-xl bg-gray-50 hover:bg-gray-900 hover:text-white text-gray-400 flex items-center justify-center transition-all duration-200 group/btn">
                        <FaEye size={13} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-200/60">
                    <th className="text-left p-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Learner</th>
                    <th className="text-left p-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="text-left p-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Enrolled</th>
                    <th className="text-left p-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Progress</th>
                    <th className="text-left p-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-left p-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Activity</th>
                    <th className="p-4 w-16"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredLearners.map((learner) => (
                    <motion.tr 
                      key={learner.id}
                      whileHover={{ backgroundColor: 'rgba(249, 250, 251, 0.8)' }}
                      className="group transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getAvatarGradient(learner.gender, learner.id)} flex items-center justify-center text-white text-xs font-bold shadow-md`}>
                            {learner.firstname[0]}{learner.lastname[0]}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{learner.firstname} {learner.lastname}</p>
                            <p className="text-xs text-gray-400">{learner.gender}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-sm text-gray-600">{learner.email}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{learner.contactNumber}</p>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {new Date(learner.enrollmentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-24 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className={`h-full rounded-full bg-gradient-to-r ${getProgressColor(learner.progress)}`} 
                              style={{ width: `${learner.progress}%` }} 
                            />
                          </div>
                          <span className={`text-xs font-bold ${learner.progress >= 80 ? 'text-emerald-600' : learner.progress >= 50 ? 'text-amber-600' : 'text-rose-600'}`}>
                            {learner.progress}%
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full font-semibold border ${
                          learner.status === 'ACTIVE' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                            : 'bg-gray-50 text-gray-500 border-gray-200'
                        }`}>
                          <span className={`w-1 h-1 rounded-full ${learner.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                          {learner.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-500">
                        <div className="flex gap-3 text-xs">
                          <span className="text-gray-400">{learner.reportsSubmitted} reports</span>
                          <span className="text-gray-300">|</span>
                          <span className="text-gray-400">{learner.assessmentsCompleted} assessments</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <button className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-gray-900 hover:text-white text-gray-400 flex items-center justify-center transition-all">
                          <FaChevronRight size={12} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
        
        {/* Footer */}
        {filteredLearners.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 flex items-center justify-between text-xs text-gray-400"
          >
            <span>Showing <span className="font-semibold text-gray-600">{filteredLearners.length}</span> of <span className="font-semibold text-gray-600">{learners.length}</span> learners</span>
            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-full bg-gray-300" />
              <span className="w-2 h-2 rounded-full bg-gray-300" />
              <span className="w-2 h-2 rounded-full bg-gray-800" />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
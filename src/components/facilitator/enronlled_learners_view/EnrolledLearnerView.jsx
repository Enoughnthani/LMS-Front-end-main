import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  FaSearch, FaUserGraduate, FaEnvelope, FaPhone, FaCalendarAlt, 
  FaVenusMars, FaEye, FaUsers, FaUserCheck, FaUserFriends,
  FaFilter, FaSortAmountDown, FaGraduationCap, FaChevronRight
} from 'react-icons/fa';

export default function EnrolledLearnerView() {
  const { programId } = useParams();
  const [learners, setLearners] = useState([]);
  const [filteredLearners, setFilteredLearners] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGender, setFilterGender] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [loading, setLoading] = useState(true);
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
        status: "ACTIVE"
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
        status: "ACTIVE"
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
        status: "ACTIVE"
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
        status: "INACTIVE"
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
        status: "ACTIVE"
      }
    ];
    
    setLearners(mockLearners);
    setFilteredLearners(mockLearners);
    setLoading(false);
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
    
    result.sort((a, b) => {
      if (sortBy === 'name') return `${a.firstname} ${a.lastname}`.localeCompare(`${b.firstname} ${b.lastname}`);
      if (sortBy === 'enrollment') return new Date(b.enrollmentDate) - new Date(a.enrollmentDate);
      return 0;
    });
    
    setFilteredLearners(result);
  }, [searchTerm, filterGender, filterStatus, learners, sortBy]);

  const stats = {
    total: learners.length,
    active: learners.filter(l => l.status === 'ACTIVE').length,
    female: learners.filter(l => l.gender === 'Female').length,
    male: learners.filter(l => l.gender === 'Male').length
  };

  return (
    <div className="h-screen overflow-y-auto bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center">
              <FaGraduationCap className="text-white text-sm" />
            </div>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Program #{programId}</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-800">Enrolled Learners</h1>
          <p className="text-sm text-gray-500 mt-1">View all enrolled learners in this program</p>
        </div>

        {/* Stats Row */}
        <div className="flex flex-wrap gap-6 mb-6 pb-4 border-b border-gray-200">
          <div>
            <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Total</p>
          </div>
          <div className="w-px h-10 bg-gray-200"></div>
          <div>
            <p className="text-2xl font-semibold text-emerald-600">{stats.active}</p>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Active</p>
          </div>
          <div className="w-px h-10 bg-gray-200"></div>
          <div>
            <p className="text-2xl font-semibold text-pink-600">{stats.female}</p>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Female</p>
          </div>
          <div className="w-px h-10 bg-gray-200"></div>
          <div>
            <p className="text-2xl font-semibold text-blue-600">{stats.male}</p>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Male</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 focus:ring-0"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                showFilters ? 'bg-gray-800 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FaFilter size={12} />
              Filters
            </button>
            
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2.5 pr-9 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-gray-400 cursor-pointer appearance-none"
              >
                <option value="name">Sort by Name</option>
                <option value="enrollment">Sort by Enrollment</option>
              </select>
              <FaSortAmountDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs" />
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-500 uppercase">Gender:</span>
                <div className="flex gap-1">
                  {['ALL', 'Female', 'Male'].map(g => (
                    <button
                      key={g}
                      onClick={() => setFilterGender(g)}
                      className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                        filterGender === g
                          ? 'bg-gray-800 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {g === 'ALL' ? 'All' : g}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-500 uppercase">Status:</span>
                <div className="flex gap-1">
                  {['ALL', 'ACTIVE', 'INACTIVE'].map(s => (
                    <button
                      key={s}
                      onClick={() => setFilterStatus(s)}
                      className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                        filterStatus === s
                          ? s === 'ACTIVE' ? 'bg-emerald-600 text-white' : s === 'INACTIVE' ? 'bg-gray-600 text-white' : 'bg-gray-800 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Learners Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div>
          </div>
        ) : filteredLearners.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <FaUserGraduate className="text-gray-300 text-4xl mx-auto mb-3" />
            <p className="text-gray-500">No learners found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Gender</th>
                  <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date of Birth</th>
                  <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Enrolled</th>
                  <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="p-4 w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLearners.map((learner) => (
                  <tr key={learner.id} className="hover:bg-gray-50 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-medium ${
                          learner.gender === 'Female' ? 'bg-pink-500' : 'bg-blue-500'
                        }`}>
                          {learner.firstname[0]}{learner.lastname[0]}
                        </div>
                        <span className="font-medium text-gray-800">{learner.firstname} {learner.lastname}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <FaEnvelope size={12} className="text-gray-400" />
                        <span>{learner.email}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <FaPhone size={12} className="text-gray-400" />
                        <span>{learner.contactNumber}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <FaVenusMars size={12} className={learner.gender === 'Female' ? 'text-pink-400' : 'text-blue-400'} />
                        <span className="text-sm text-gray-600">{learner.gender}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {new Date(learner.dob).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {new Date(learner.enrollmentDate).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        learner.status === 'ACTIVE' 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {learner.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4">
                      <button className="text-gray-400 hover:text-gray-600">
                        <FaEye size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Footer */}
        {filteredLearners.length > 0 && (
          <div className="mt-4 text-center text-xs text-gray-400">
            {filteredLearners.length} of {learners.length} learners
          </div>
        )}
      </div>
    </div>
  );
}
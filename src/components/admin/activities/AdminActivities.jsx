import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import {
  FaBan,
  FaCheckCircle,
  FaEdit,
  FaTrash,
  FaUser,
  FaUserPlus
} from 'react-icons/fa';
import {
  FiActivity, FiChevronLeft, FiChevronRight,
  FiDownload,
  FiSearch
} from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';

const AdminActivities = () => {
  const location = useLocation()
  const initialActivities = location?.state?.activities;
  const [activities, setActivities] = useState(initialActivities || [])

  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate()

  // Unified action styles - using only slate/gray + single blue accent
  const getActionStyles = (actionType) => {
    const baseClasses = {
      iconBg: 'bg-slate-100',
      badge: 'bg-slate-100 text-slate-700 border border-slate-200'
    };

    switch (actionType?.toUpperCase()) {
      case 'ACTIVATED':
        return {
          ...baseClasses,
          icon: <FaCheckCircle className="text-blue-600" size={16} />,
          badgeText: 'Activated'
        };
      case 'DEACTIVATED':
        return {
          ...baseClasses,
          icon: <FaBan className="text-slate-500" size={16} />,
          badgeText: 'Deactivated'
        };
      case 'UPDATED':
        return {
          ...baseClasses,
          icon: <FaEdit className="text-blue-600" size={16} />,
          badgeText: 'Updated'
        };
      case 'CREATED':
        return {
          ...baseClasses,
          icon: <FaUserPlus className="text-blue-600" size={16} />,
          badgeText: 'Created'
        };
      case 'DELETED':
        return {
          ...baseClasses,
          icon: <FaTrash className="text-slate-500" size={16} />,
          badgeText: 'Deleted'
        };
      default:
        return {
          ...baseClasses,
          icon: <FaUser className="text-slate-400" size={16} />,
          badgeText: actionType || 'Unknown'
        };
    }
  };

  // Format relative time
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  // Format full date
  const formatFullDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter and search activities
  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${activity.firstname} ${activity.lastname}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = filterAction === 'ALL' || activity.actionType === filterAction;
    return matchesSearch && matchesAction;
  });

  // Pagination
  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const paginatedActivities = filteredActivities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Statistics
  const stats = {
    total: activities.length,
    activated: activities.filter(a => a.actionType === 'ACTIVATED').length,
    deactivated: activities.filter(a => a.actionType === 'DEACTIVATED').length,
    updated: activities.filter(a => a.actionType === 'UPDATED').length
  };

  return (
    <div className="h-screen overflow-y-auto bg-slate-50 flex-1">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-2">
          <div className="flex flex-col gap-2 justify-between">
            <div>
              <Button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2  border-slate-200 text-slate-600"
                variant="outline-secondary"
              >
                <ArrowLeft size={18} />
                <span className="text-sm font-medium">Back</span>
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-xl font-semibold text-slate-900">Activity Log</h1>
                <p className="text-sm text-slate-500">Track all user activities and system events</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats Cards - Clean minimal style */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Activities</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</p>
              </div>
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <FiActivity className="text-slate-600" size={20} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Activations</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stats.activated}</p>
              </div>
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <FaCheckCircle className="text-blue-600" size={20} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Deactivations</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stats.deactivated}</p>
              </div>
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <FaBan className="text-slate-500" size={20} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Updates</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stats.updated}</p>
              </div>
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <FaEdit className="text-blue-600" size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Filters - Pill style */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Search activities or users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {['ALL', 'ACTIVATED', 'DEACTIVATED', 'UPDATED'].map((action) => (
                <button
                  key={action}
                  onClick={() => setFilterAction(action)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterAction === action
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                >
                  {action === 'ALL' ? 'All' : action.charAt(0) + action.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Activities List - Clean table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Action</th>
                  <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Description</th>
                  <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">User</th>
                  <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedActivities.map((activity) => {
                  const styles = getActionStyles(activity.actionType);
                  return (
                    <tr key={activity.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-medium ${styles.badge}`}>
                          {styles.icon}
                          {styles.badgeText}
                        </span>
                      </td>
                      <td className="p-4">
                        <p className="text-sm text-slate-700 font-medium">{activity.description}</p>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-xs font-semibold text-slate-600">
                            {activity.firstname?.[0]}{activity.lastname?.[0]}
                          </div>
                          <span className="text-sm text-slate-700">
                            {activity.firstname} {activity.lastname}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="text-sm text-slate-700">{formatFullDate(activity.createdAt)}</span>
                          <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                            {formatRelativeTime(activity.createdAt)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination - Clean style */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-slate-50/50">
              <div className="text-sm text-slate-500">
                Showing <span className="font-medium text-slate-900">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="font-medium text-slate-900">{Math.min(currentPage * itemsPerPage, filteredActivities.length)}</span> of <span className="font-medium text-slate-900">{filteredActivities.length}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-slate-600"
                >
                  <FiChevronLeft size={18} />
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`min-w-[36px] px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${currentPage === page
                        ? 'bg-slate-900 text-white'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-slate-600"
                >
                  <FiChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Empty State */}
        {filteredActivities.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center mt-6">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiActivity className="text-slate-400" size={28} />
            </div>
            <h3 className="text-base font-semibold text-slate-900 mb-1">No activities found</h3>
            <p className="text-sm text-slate-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminActivities;

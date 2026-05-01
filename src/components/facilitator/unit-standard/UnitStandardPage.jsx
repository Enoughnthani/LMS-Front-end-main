import { useEffect, useState } from 'react';
import {
  FaPlus, FaEdit, FaTrash, FaSearch,
  FaCode, FaBook, FaClock, FaGraduationCap, FaTag, FaFileAlt,
  FaChartLine, FaCheckCircle, FaSpinner, FaEllipsisV,
  FaDatabase, FaStar, FaAward
} from 'react-icons/fa';
import { Button, Modal, Form, Badge, Alert, Dropdown } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiFetch } from '@/api/api';

export default function UnitStandardsPage() {
  const [unitStandards, setUnitStandards] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation()
  const { program } = location?.state || {}

  useEffect(() => {
    const getUnitStandards = async () => {
      const data = await apiFetch('/api/unit-standards/program/' + program?.id)
      setUnitStandards(data)
    }

    getUnitStandards()
  }, [])

  const getTypeBadge = (type) => {
    const styles = {
      Fundamental: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
      Core: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
      Elective: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' }
    };
    const style = styles[type] || styles.Core;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text} border ${style.border}`}>
        {type === 'Fundamental' && <FaStar size={10} />}
        {type === 'Core' && <FaAward size={10} />}
        {type === 'Elective' && <FaCode size={10} />}
        {type}
      </span>
    );
  };

  const getNQFBadge = (level) => {
    const levelNum = parseInt(level.split(' ')[2]);
    let color = '';
    if (levelNum <= 4) color = 'bg-amber-50 text-amber-700 border-amber-200';
    else if (levelNum <= 6) color = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    else color = 'bg-purple-50 text-purple-700 border-purple-200';

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${color} border`}>
        <FaGraduationCap size={10} className="mr-1" />
        {level}
      </span>
    );
  };

  const filteredStandards = unitStandards.filter(standard => {
    const matchesSearch = standard.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      standard.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'ALL' || standard.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: unitStandards.length,
    fundamental: unitStandards.filter(u => u.type === 'Fundamental').length,
    core: unitStandards.filter(u => u.type === 'Core').length,
    elective: unitStandards.filter(u => u.type === 'Elective').length,
    totalCredits: unitStandards.reduce((sum, u) => sum + (u.credits || 0), 0)
  };

  const handleDelete = () => {
    setUnitStandards(unitStandards.filter(item => item.id !== editingItem?.id));
    setShowDeleteModal(false);
    setEditingItem(null);
  };

  return (
    <div className="w-full overflow-y-auto h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                  <FaCode className="text-white text-lg" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Unit Standards
                </h1>
              </div>
              <p className="text-gray-500 ml-1">Manage learnership unit standards and outcomes</p>
            </div>
            <Button
              size='sm'
              onClick={() => navigate('new', { state: { program } })}
              className="hover:shadow-lg transition-all duration-300 flex items-center gap-2 rounded-xl px-5 py-2.5 border-0"
            >
              <FaPlus size={14} /> Add Unit Standard
            </Button>
          </div>
        </div>

        {/* Stats Cards - Modern Design */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="group bg-white rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-400 uppercase tracking-wide">Total Units</p>
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition">
                <FaDatabase className="text-gray-500 text-sm" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            <p className="text-xs text-gray-400 mt-1">unit standards</p>
          </div>

          <div className="group bg-white rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-blue-600 uppercase tracking-wide">Fundamental</p>
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center group-hover:scale-110 transition">
                <FaStar className="text-blue-500 text-sm" />
              </div>
            </div>
            <p className="text-2xl font-bold text-blue-600">{stats.fundamental}</p>
            <div className="w-full bg-blue-100 rounded-full h-1 mt-2">
              <div className="bg-blue-500 rounded-full h-1 transition-all" style={{ width: stats.total ? `${(stats.fundamental / stats.total) * 100}%` : '0%' }} />
            </div>
          </div>

          <div className="group bg-white rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-green-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-green-600 uppercase tracking-wide">Core</p>
              <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center group-hover:scale-110 transition">
                <FaAward className="text-green-500 text-sm" />
              </div>
            </div>
            <p className="text-2xl font-bold text-green-600">{stats.core}</p>
            <div className="w-full bg-green-100 rounded-full h-1 mt-2">
              <div className="bg-green-500 rounded-full h-1 transition-all" style={{ width: stats.total ? `${(stats.core / stats.total) * 100}%` : '0%' }} />
            </div>
          </div>

          <div className="group bg-white rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-purple-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-purple-600 uppercase tracking-wide">Elective</p>
              <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center group-hover:scale-110 transition">
                <FaCode className="text-purple-500 text-sm" />
              </div>
            </div>
            <p className="text-2xl font-bold text-purple-600">{stats.elective}</p>
            <div className="w-full bg-purple-100 rounded-full h-1 mt-2">
              <div className="bg-purple-500 rounded-full h-1 transition-all" style={{ width: stats.total ? `${(stats.elective / stats.total) * 100}%` : '0%' }} />
            </div>
          </div>

          <div className="group bg-zinc-900 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-white/70 uppercase tracking-wide">Total Credits</p>
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition">
                <FaChartLine className="text-white text-sm" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{stats.totalCredits}</p>
          </div>
        </div>

        {/* Search and Filter - Modern */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search by code or title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              />
            </div>
            <div className="flex gap-2">
              {['ALL', 'Fundamental', 'Core', 'Elective'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filterType === type
                    ? 'bg-gray-800 text-white shadow-md'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                >
                  {type === 'ALL' ? 'All Types' : type}
                </button>
              ))}
            </div>
          </div>
        </div>


        {loading ? (
          <div className="flex items-center justify-center py-20">
            <FaSpinner className="text-gray-400 text-3xl animate-spin" />
          </div>
        ) : filteredStandards.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaFileAlt className="text-gray-400 text-3xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">No unit standards found</h3>
            <p className="text-gray-400 text-sm mb-4">Click "Add Unit Standard" to create one</p>
            <Button
              onClick={() => navigate('new', { state: { program } })}
              variant="primary"
              className="border-0 rounded-xl"
            >
              <FaPlus className="inline mr-2" size={12} /> Add Unit Standard
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">SAQA ID</th>
                    <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Credits</th>
                    <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">NQF Level</th>
                    <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredStandards.map((standard) => (
                    <tr key={standard.id} className="hover:bg-gray-50 transition group">
                      <td>
                        <span className="font-mono text-sm font-medium text-gray-800 bg-gray-100 px-2 py-1 rounded">
                          {standard?.unitStandardId}
                        </span>
                      </td>
                      <td>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{standard.title}</p>
                          {standard.description && (
                            <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{standard.description}</p>
                          )}
                        </div>
                      </td>
                      <td >
                        <div className="flex items-center gap-1">
                          <FaStar className="text-amber-400" size={12} />
                          <span className="text-sm font-medium text-gray-700">{standard.credits}</span>
                        </div>
                      </td>
                       <td >
                        {getNQFBadge(standard.nqfLevel)}
                      </td>
                      <td >
                        {getTypeBadge(standard.type)}
                      </td>
                      <td >
                        <Dropdown align="end">
                          <Dropdown.Toggle as="button" className="bg-blue-400 rounded text-white px-2 py-1 ">
                            Action
                          </Dropdown.Toggle>
                          <Dropdown.Menu className="shadow-lg border-0 rounded-xl">
                            <Dropdown.Item onClick={() => navigate(`${standard.id}/edit`, { state: { standard } })}>
                              <FaEdit className="inline mr-2 text-blue-500" size={12} /> Edit
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() => {
                                setEditingItem(standard);
                                setShowDeleteModal(true);
                              }}
                              className="text-red-600"
                            >
                              <FaTrash className="inline mr-2" size={12} /> Delete
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="flex items-center gap-2 text-red-600">
            <FaTrash /> Confirm Delete
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pb-4">
          <p>Are you sure you want to delete <strong className="text-gray-800">{editingItem?.code} - {editingItem?.title}</strong>?</p>
          <div className="bg-red-50 rounded-lg p-3 mt-3 border border-red-100">
            <p className="text-sm text-red-600 mb-0 flex items-center gap-2">
              <span className="text-lg">⚠️</span> This action cannot be undone.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="light" onClick={() => setShowDeleteModal(false)} className="rounded-lg px-4">
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} className="rounded-lg px-4">
            Delete Permanently
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
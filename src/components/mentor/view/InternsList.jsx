import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Badge } from 'react-bootstrap';
import { FaUserCircle, FaEnvelope, FaCalendarAlt, FaFileAlt, FaEye, FaSearch } from 'react-icons/fa';

export default function InternsList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [interns, setInterns] = useState([
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      enrolledDate: "2026-01-15",
      totalReports: 3,
      submittedReports: 2,
      pendingReports: 1,
      status: "active"
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob.smith@example.com",
      enrolledDate: "2026-01-20",
      totalReports: 3,
      submittedReports: 3,
      pendingReports: 0,
      status: "active"
    },
    {
      id: 3,
      name: "Carol Davis",
      email: "carol.davis@example.com",
      enrolledDate: "2026-02-01",
      totalReports: 2,
      submittedReports: 1,
      pendingReports: 1,
      status: "active"
    },
    {
      id: 4,
      name: "David Wilson",
      email: "david.wilson@example.com",
      enrolledDate: "2026-01-10",
      totalReports: 3,
      submittedReports: 1,
      pendingReports: 2,
      status: "inactive"
    }
  ]);

  const filteredInterns = interns.filter(intern =>
    intern.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    intern.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

 

  return (
    <div className="h-screen flex-1 bg-gray-50 p-5 overflow-y-auto">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-gray-800 mb-1">My Interns</h2>
          <p className="text-gray-500 text-sm">Manage and evaluate intern monthly reports</p>
        </div>

        {/* Search */}
        <div className="mb-4">
          <div className="relative max-w-md">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search interns by name or email..."
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Interns List */}
        <div className="space-y-3">
          {filteredInterns.map((intern) => (
            <Card key={intern.id} className="border-0 shadow-sm hover:shadow-md transition">
              <Card.Body className="p-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <FaUserCircle className="text-gray-400 text-2xl" />
                      <div>
                        <h5 className="font-semibold text-gray-800 mb-0 text-base">{intern.name}</h5>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <FaEnvelope size={10} /> {intern.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <FaCalendarAlt size={10} /> Enrolled: {intern.enrolledDate}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-4">
                    <Button
                      size="sm"
                      onClick={() =>navigate(`intern/${intern?.id}`,{state:{intern}})}
                      className="flex items-center gap-2 px-4"
                    >
                      <FaFileAlt size={14} /> Evaluate
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}

          {filteredInterns.length === 0 && (
            <div className="text-center py-8 bg-white rounded-lg shadow-sm">
              <FaUserCircle className="text-gray-300 text-5xl mx-auto mb-3" />
              <p className="text-gray-500">No interns found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
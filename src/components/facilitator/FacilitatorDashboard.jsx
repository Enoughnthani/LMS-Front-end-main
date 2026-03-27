import { Award, BookOpen, FileText, Users } from 'lucide-react';
import { useState } from 'react';
import { Dropdown, DropdownButton, DropdownItem } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';


export const FacilitatorDashboard = () => {
  const [activeTab, setActiveTab] = useState('Courses');
  const navigate = useNavigate()

  const tabs = [
    { key: 'Courses', label: 'Courses', icon: Users },
    { key: 'Formatives', label: 'Formatives', icon: FileText },
    { key: 'Summatives', label: 'Summatives', icon: FileText },
    { key: 'Grading', label: 'Grading', icon: Award },
  ]

  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedUS, setSelectedUS] = useState(null);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  // Dummy courses
  const courses = [
    { id: 1, title: "React Basics" },
    { id: 2, title: "Node.js Backend" },
  ];

  const assessments = [
    { id: 1, type: "Formative", title: "Module 1 Quiz", unitStandard: "US101" },
    { id: 2, type: "Summative", title: "Final Project", unitStandard: "US102" },
  ];


  return (
    <div className="min-h-screen">
      <header className="text-white border-b border-red-600 ">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <BookOpen className="w-8 h-8 text-red-600" />
              <h1 className="text-xl text-red-600 font-bold">Facilitator Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Dropdown align="end">
                <Dropdown.Toggle
                  id="dropdown-profile"
                  className="!bg-slate-600 border-0 text-white p-2 !rounded-[50%]"
                  style={{ width: '40px', height: '40px' }}
                >
                  SL
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item href="#/profile">Profile</Dropdown.Item>
                  <Dropdown.Item onClick={() => setShow(true)}>Settings</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={() => navigate('/')}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        <DropdownButton className='md:hidden block' title={activeTab} variant='danger'>
          {tabs.map((tab, key) => (
            <DropdownItem
              key={key}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </DropdownItem>
          ))}
        </DropdownButton>

        <div className="hidden md:flex space-x-1 mb-8 bg-white p-2 rounded-lg ">
          {tabs?.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors flex-1 justify-center ${activeTab === key ? 'bg-red-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm">{label}</span>
            </button>
          ))}
        </div>

        {activeTab === 'Courses' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-black">My Courses</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, key) => (
                <div
                  key={key}
                  className="bg-white shadow-md rounded-xl overflow-hidden hover: transition"
                >
                  {/* Course image */}
                  <div className="h-32 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">Course Image</span>
                  </div>

                  {/* Course content */}
                  <div className="p-4 space-y-3">
                    <h3 className="text-lg font-semibold text-black">
                      Dummy Course {key + 1}
                    </h3>
                    <p className="text-sm text-gray-600">
                      This is a short description of the course to show layout.
                    </p>

                    {/* Progress bar */}
                    <div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-red-600 h-2 rounded-full"
                          style={{ width: `${(key + 1) * 15}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Progress: {(key + 1) * 15}%
                      </p>
                    </div>

                    <button className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition text-sm">
                      View Course
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}


        {activeTab === 'Formatives' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-black">Formative Assessments</h2>

              <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                + Create Formative
              </button>
            </div>

            {/* If there are no formatives */}
            {false && (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No formative assessments created yet.</p>
              </div>
            )}

            {/* Dummy formatives */}
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, key) => (
                <div
                  key={key}
                  className="bg-white rounded-xl shadow-md p-5 border border-gray-200 hover: transition"
                >
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-black">
                        Formative Assessment {key + 1}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Course: <span className="font-medium text-black">Course {key + 1}</span>
                      </p>
                      <p className="text-gray-600 text-sm">
                        Module: <span className="font-medium">Module {key + 1}</span>
                      </p>
                      <p className="text-gray-600 text-sm">
                        Total Marks: <span className="font-medium">20</span>
                      </p>

                      {/* Status */}
                      <span
                        className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${key % 2 === 0
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                          }`}
                      >
                        {key % 2 === 0 ? 'Active' : 'Draft'}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col space-y-2">
                      <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                        View Submissions
                      </button>
                      <button className="px-3 py-1 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700">
                        Edit
                      </button>
                      <button className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">
                        Delete
                      </button>
                      <button className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
                        Activate
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}


        {activeTab === "Summatives" && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-black">Summative Assessments</h2>

              <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                + Create Summative
              </button>
            </div>

            {/* No Summatives Yet */}
            {false && (
              <div className="text-center py-12">
                <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">You haven’t created any summative assessments yet.</p>
              </div>
            )}

            {/* Dummy Summatives */}
            <div className="space-y-5">
              {Array.from({ length: 4 }).map((_, key) => (
                <div
                  key={key}
                  className="bg-white border border-gray-200 rounded-xl  hover:shadow-md transition p-5"
                >
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-black">
                        Summative Assessment {key + 1}
                      </h3>

                      {/* Course and Module */}
                      <p className="text-sm text-gray-600">
                        Course: <span className="font-medium text-black">Backend Development</span>
                      </p>
                      <p className="text-sm text-gray-600">
                        Module: <span className="font-medium">Module {key + 1}</span>
                      </p>

                      {/* Weighting */}
                      <p className="text-sm text-gray-700 mt-1">
                        Weighting: <span className="font-bold text-red-600">{10 * (key + 1)}%</span>
                      </p>

                      {/* Status Badge */}
                      <span
                        className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${key % 3 === 0
                          ? "bg-green-100 text-green-700"   // Active
                          : key % 3 === 1
                            ? "bg-yellow-100 text-yellow-700" // Draft
                            : "bg-gray-200 text-gray-700"     // Closed
                          }`}
                      >
                        {key % 3 === 0
                          ? "Active"
                          : key % 3 === 1
                            ? "Draft"
                            : "Closed"}
                      </span>
                    </div>

                    {/* Submissions Summary */}
                    <div className="text-right">
                      <p className="text-sm text-gray-700">
                        Submissions: <span className="font-bold">{5 + key}</span>
                      </p>
                      <p className="text-sm text-gray-700">
                        Total Marks: <span className="font-bold">100</span>
                      </p>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 text-sm text-gray-700">
                    <p>
                      <span className="font-medium text-black">Open Date:</span>
                      <br /> {new Date().toLocaleDateString()}
                    </p>
                    <p>
                      <span className="font-medium text-black">Due Date:</span>
                      <br /> {new Date(Date.now() + 86400000 * 7).toLocaleDateString()}
                    </p>
                    <p>
                      <span className="font-medium text-black">Close Date:</span>
                      <br /> {new Date(Date.now() + 86400000 * 8).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Facilitator Actions */}
                  <div className="mt-5 flex flex-wrap gap-2">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                      View Submissions
                    </button>
                    <button className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700">
                      Edit
                    </button>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">
                      Delete
                    </button>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
                      {key % 3 === 0 ? "Deactivate" : "Activate"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "Grading" && (
          <div className="space-y-6">

            <h2 className="text-2xl font-bold text-black">Grading Center</h2>

            {/* STEP 1 — Select Course */}
            <div className="bg-white p-4 rounded-lg  border space-y-3">
              <label className="font-medium text-gray-700">Select Course / Qualification</label>

              <select
                className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-red-600"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                <option value="">-- Choose Course --</option>
                {["IT Systems Development (NQF5)", "Business Admin (NQF4)", "Coding Learnership"].map(
                  (course, idx) => (
                    <option key={idx} value={course}>{course}</option>
                  )
                )}
              </select>
            </div>

            {/* STOP IF COURSE NOT SELECTED */}
            {!selectedCourse && (
              <div className="text-center py-10">
                <p className="text-gray-600">Select a course to continue.</p>
              </div>
            )}

            {/* STEP 2 — Select Unit Standard */}
            {selectedCourse && (
              <div className="bg-white p-4 rounded-lg  border space-y-3">
                <label className="font-medium text-gray-700">Select Unit Standard</label>

                <select
                  className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-red-600"
                  value={selectedUS}
                  onChange={(e) => setSelectedUS(e.target.value)}
                >
                  <option value="">-- Choose Unit Standard --</option>

                  {[
                    "US 115373 – Basic Computer Concepts",
                    "US 115361 – Create a Website Using HTML",
                    "US 114310 – Apply Workplace Communication"
                  ].map((us, i) => (
                    <option key={i} value={us}>
                      {us}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* STOP IF US NOT SELECTED */}
            {selectedCourse && !selectedUS && (
              <div className="text-center py-10">
                <p className="text-gray-600">Select a Unit Standard to continue.</p>
              </div>
            )}

            {/* STEP 3 — Select Assessment Type (Formative / Summative) */}
            {selectedCourse && selectedUS && (
              <div className="bg-white p-4 rounded-lg  border space-y-3">
                <label className="font-medium text-gray-700">Select Assessment Type</label>

                <select
                  className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-red-600"
                  value={selectedAssessment}
                  onChange={(e) => setSelectedAssessment(e.target.value)}
                >
                  <option value="">-- Choose Assessment --</option>
                  <option value="Formative">Formative Assessment</option>
                  <option value="Summative">Summative Assessment</option>
                </select>
              </div>
            )}

            {/* STOP IF ASSESSMENT NOT SELECTED */}
            {selectedUS && !selectedAssessment && (
              <div className="text-center py-10">
                <p className="text-gray-600">Select the assessment to start grading.</p>
              </div>
            )}

            {/* STEP 4 — Show Submissions to Grade */}
            {selectedAssessment && (
              <div className="space-y-5">

                <div className="bg-gray-50 border rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-black">{selectedAssessment} — {selectedUS}</h3>
                  <p className="text-sm text-gray-700">Course: {selectedCourse}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {Array.from({ length: 10 }).map((_, key) => (
                    <div
                      key={key}
                      className="bg-white  border p-5 rounded-xl hover:shadow-md transition"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold text-black">Student {key + 1}</h4>

                        <span
                          className={`px-3 py-1 text-xs font-bold rounded-full ${key % 2 === 0
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                            }`}
                        >
                          {key % 2 === 0 ? "Graded" : "Pending"}
                        </span>
                      </div>

                      <p className="text-sm text-gray-700">Submitted: {new Date().toLocaleDateString()}</p>

                      {key % 2 === 0 && (
                        <p className="text-sm text-gray-700 mt-1">
                          Mark: <span className="font-bold">{65 + key}</span>/100
                        </p>
                      )}

                      <div className="mt-4 flex gap-2">
                        <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700">
                          View Submission
                        </button>
                        <button className="flex-1 bg-purple-600 text-white py-2 rounded-lg text-sm hover:bg-purple-700">
                          {key % 2 === 0 ? "Edit Grade" : "Grade"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

    </div >
  );
};
// components/AdminDashboardOverview.jsx
import { Badge, Button, Card, Placeholder, ProgressBar } from "react-bootstrap";
import {
  FaBook,
  FaBullhorn,
  FaCalendarAlt,
  FaCertificate,
  FaChalkboardTeacher,
  FaCheckCircle,
  FaUserPlus,
  FaUsers
} from "react-icons/fa";
import { FiClock, FiTarget, FiTrendingUp } from "react-icons/fi";
import { GiAchievement } from "react-icons/gi";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminDashboardOverview({ 
  users, 
  visible, 
  user, 
  handleMenuItemClick,
  setStep,
  setShowModal 
}) {
  const activities = [
    {
      icon: <FaUserPlus className="text-red-500" />,
      text: "New intern account created",
      time: "2 mins ago",
      user: "John Doe",
      category: "User"
    },
    {
      icon: <FaChalkboardTeacher className="text-amber-500" />,
      text: "Mentor assigned to 'React Basics'",
      time: "15 mins ago",
      user: "Sarah Chen",
      category: "Assignment"
    },
    {
      icon: <FaBook className="text-red-500" />,
      text: 'Course "Advanced Java" published',
      time: "1 hour ago",
      user: "System",
      category: "Course"
    },
    {
      icon: <FaCheckCircle className="text-emerald-500" />,
      text: 'Intern completed final project assessment',
      time: "2 hours ago",
      user: "Alex Johnson",
      category: "Completion"
    },
    {
      icon: <FaCertificate className="text-red-500" />,
      text: "Internship certification batch generated",
      time: "3 hours ago",
      user: "Maria Garcia",
      category: "Certification"
    },
  ];

  const upcomingEvents = [
    { title: "React Bootcamp Workshop", date: "Tomorrow, 10:00 AM", type: "Workshop", priority: "high" },
    { title: "Internship Kickoff", date: "Mar 25, 2:00 PM", type: "Orientation", priority: "medium" },
    { title: "Mentor Matching Session", date: "Mar 28, 11:00 AM", type: "Matching", priority: "high" },
    { title: "Progress Review", date: "Apr 1, 3:00 PM", type: "Review", priority: "medium" },
  ];

  return (
    <main className="flex-1 p-6 overflow-y-auto h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            Dashboard
          </h1>
          <p className="text-gray-600">Track intern progress and learnership completion</p>
        </div>
        <div className="flex items-center gap-4">
          {visible ? (
            <>
              <button
                className="w-[170px] m-0 flex items-center bg-white px-2 rounded-lg border border-gray-200 ">
                <Placeholder animation="wave" as="div">
                  <Placeholder className="m rounded-[50%] w-[35px] h-[35px]" xs={6} />
                </Placeholder>

                <div className="flex-1">
                  <Placeholder xs={9} size="sm" />
                  <Placeholder xs={4} size="sm" />
                </div>
              </button>
            </>)
            : (
              <></>
            )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: "Total Users", value: users?.length || 0, icon: <FaUsers className="text-xl" />, color: "from-red-500 to-red-600", change: "+8%", trend: "up" },
          { title: "Total Programs", value: "84", icon: <FaBook className="text-xl" />, color: "from-red-400 to-red-500", change: "+12%", trend: "up" },
          { title: "Active Learnerships", value: "18", icon: <FaChalkboardTeacher className="text-xl" />, color: "from-red-400 to-red-500", change: "+3", trend: "up" },
          { title: "Active Internships", value: "24", icon: <FaBook className="text-xl" />, color: "from-red-600 to-red-700", change: "4 new", trend: "up" },
        ].map((stat, index) => (
          <Card
            key={index}
            className=" hover:shadow-md transition-shadow overflow-hidden border-b-4 border-slate-500 h-full transition-transform duration-300 ease-in-out hover:-translate-y-2 cursor-pointer"
          >
            <Card.Body className="p-5 flex flex-col">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-2">
                    {stat.title}
                  </p>

                  <h2 className="text-3xl font-bold text-gray-800">
                    {stat.value}
                  </h2>

                  <span
                    className={`text-sm ${stat.trend === "up" ? "text-red-600" : "text-green-600"
                      } font-medium flex items-center gap-1`}
                  >
                    <FiTrendingUp />
                    {stat.change}
                  </span>
                </div>

                <div
                  className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center text-white `}
                >
                  {stat.icon}
                </div>
              </div>

              <div className="mt-auto">
                <ProgressBar
                  now={75 + index * 5}
                  variant="danger"
                  className="rounded"
                />
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Activity */}
          <Card className="border-0 h-full  border-t-4 border-red-500">
            <Card.Header className="bg-white border-0 py-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <h5 className="font-bold text-gray-800">Recent Activity</h5>
                <Badge bg="danger" pill className="px-2">5 New</Badge>
              </div>
              <Button variant="link" size="sm" className="text-red-600 p-0 font-medium">
                View All →
              </Button>
            </Card.Header>
            <Card.Body className="pt-0">
              <div className="space-y-4">
                {activities.map((act, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-4 hover:bg-red-50/30 rounded-lg transition-colors border-l-4 border-red-100 hover:border-red-300">
                    <div className={`w-10 h-10 ${act.category === 'Certification' ? 'bg-red-100' : 'bg-gray-50'} rounded-lg flex items-center justify-center`}>
                      {act.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{act.text}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <Badge bg="light" text="dark" className="border border-gray-200 text-xs">{act.category}</Badge>
                        <span className="text-sm text-gray-500">{act.user}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500 flex items-center gap-1"><FiClock />{act.time}</span>
                      </div>
                    </div>
                    {act.category === 'Certification' && <GiAchievement className="text-2xl text-red-500" />}
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="border-0  border-t-4 border-red-500">
            <Card.Header className="bg-white border-0 py-4 flex items-center gap-2">
              <FiTarget className="text-red-500" />
              <h5 className="font-bold text-gray-800">Quick Actions</h5>
            </Card.Header>
            <Card.Body className="pt-0 space-y-3">
              {[
                { icon: <FaUserPlus />, label: "Create User", variant: "outline-danger", event: () => { setStep(1); setShowModal(true) } },
                { icon: <FaBook />, label: "Create Program", variant: "outline-danger", event: () => { setStep(2); setShowModal(true) } },
                { icon: <FaBullhorn />, label: "Send Announcement", variant: "outline-danger" },
              ].map((action, idx) => (
                <Button 
                  onClick={action.event} 
                  key={idx} 
                  variant={action.variant} 
                  className="w-full d-flex align-items-center gap-3 p-3 text-left border text-slate-700 hover:!text-slate-50 hover: transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                    <span className="text-red-600">{action.icon}</span>
                  </div>
                  <span className="font-medium">{action.label}</span>
                </Button>
              ))}
            </Card.Body>
          </Card>

          {/* Upcoming Events */}
          <Card className="border-0  border-t-4 border-amber-500">
            <Card.Header className="bg-white border-0 py-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-red-500" />
                <h5 className="font-bold text-gray-800">Upcoming Events</h5>
              </div>
              <Badge bg="light" text="dark" className="border border-gray-200">{upcomingEvents.length} Events</Badge>
            </Card.Header>
            <Card.Body className="pt-0 space-y-4">
              {upcomingEvents.map((event, idx) => (
                <div key={idx} className={`p-3 border rounded-lg transition-colors ${event.priority === 'high' ? 'border-red-200 bg-red-50/50 hover:bg-red-50' : 'border-amber-100 bg-amber-50/30 hover:bg-amber-50'}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-800">{event.title}</p>
                      <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                        <FiClock className={event.priority === 'high' ? 'text-red-500' : 'text-amber-500'} />
                        {event.date}
                      </p>
                    </div>
                    <Badge bg={event.priority === 'high' ? "danger" : "warning"}>{event.type}</Badge>
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>
        </div>
      </div>
    </main>
  );
}
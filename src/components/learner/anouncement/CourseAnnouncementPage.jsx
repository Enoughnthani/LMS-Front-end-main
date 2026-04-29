import { FaBullhorn, FaCalendarAlt, FaUserCircle, FaRegClock, FaEllipsisH } from 'react-icons/fa';

export default function CourseAnnouncementPage() {
  const announcements = [
    {
      id: 1,
      title: "Midterm Exam Schedule Update",
      message: "The midterm exam has been rescheduled to next Friday, March 15th. Please check the assessment section for more details.",
      author: "Prof. Sarah Johnson",
      date: "March 1, 2026",
      time: "10:30 AM",
      priority: "high"
    },
    {
      id: 2,
      title: "New Course Materials Available",
      message: "Additional reading materials for Module 4 have been uploaded to the Content section. Make sure to review them before next week's lecture.",
      author: "Prof. Sarah Johnson",
      date: "February 28, 2026",
      time: "2:15 PM",
      priority: "medium"
    },
    {
      id: 3,
      title: "Guest Lecture This Week",
      message: "We have a special guest lecture on Thursday at 3 PM. Attendance is highly encouraged. The Zoom link has been sent to your emails.",
      author: "Course Admin",
      date: "February 25, 2026",
      time: "9:00 AM",
      priority: "medium"
    },
    {
      id: 4,
      title: "Platform Maintenance",
      message: "The learning platform will be undergoing maintenance on Sunday from 2 AM to 4 AM. Please plan your study time accordingly.",
      author: "System Admin",
      date: "February 24, 2026",
      time: "11:45 AM",
      priority: "low"
    },
  ];

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="w-full p-6 bg-gray-50 h-screen overflow-y-auto">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <FaBullhorn className="text-orange-600 text-2xl" />
              <h1 className="text-2xl font-bold text-gray-800">Announcements</h1>
            </div>
          </div>
          <p className="text-gray-500 text-sm mt-1">Course: Advanced React Development</p>
          <p className="text-gray-400 text-xs mt-1">{announcements.length} announcements</p>
        </div>

        {/* Announcements List */}
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="bg-white rounded-lg shadow hover:shadow-md transition">
              <div className="p-5">
                {/* Priority Badge & Menu */}
                <div className="flex justify-between items-start mb-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(announcement.priority)}`}>
                    {announcement.priority.toUpperCase()} PRIORITY
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-bold text-gray-800 text-lg mb-2">
                  {announcement.title}
                </h3>

                {/* Message */}
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {announcement.message}
                </p>

                {/* Footer with Author & Date */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <FaUserCircle className="text-gray-400" />
                    <span>{announcement.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-gray-400" />
                    <span>{announcement.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaRegClock className="text-gray-400" />
                    <span>{announcement.time}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State (if no announcements) */}
        {announcements.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <FaBullhorn className="text-gray-300 text-5xl mx-auto mb-4" />
            <p className="text-gray-500">No announcements yet</p>
            <p className="text-gray-400 text-sm mt-1">Check back later for updates</p>
          </div>
        )}
      </div>
    </div>
  );
}
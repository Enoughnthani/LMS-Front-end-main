import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { Badge, ProgressBar } from 'react-bootstrap';
import {
  FaBell,
  FaBook,
  FaChartLine,
  FaClipboardList,
  FaFileAlt,
  FaStar,
  FaUsers,
  FaRocket,
  FaCheckCircle,
  FaClock,
  FaEye
} from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';

export default function FacilitatorProgramOverview() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { program } = location?.state || {};

  // Mock data - replace with API calls
  const [stats, setStats] = useState({
    totalLearners: 24,
    activeLearners: 20,
    contentViews: 342,
    avgCompletionRate: 68,
    totalContent: 12,
    publishedContent: 9,
    draftContent: 3,
    averageEngagement: 78
  });

  const [recentActivities, setRecentActivities] = useState([
    { id: 1, action: "John Doe completed Module 3", time: "2 hours ago", type: "completion" },
    { id: 2, action: "New content added: React Hooks Deep Dive", time: "5 hours ago", type: "content" },
    { id: 3, action: "Sarah Smith started Module 4", time: "1 day ago", type: "progress" },
    { id: 4, action: "Module 2 video lecture viewed 45 times", time: "2 days ago", type: "engagement" },
  ]);


  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const getProgramName = () => {
    return program?.name || "";
  };

  const getProgramType = () => {
    return program?.category === "LEARNERSHIP" ? "Learnership" : "Short Course";
  };

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="max-w-7xl mx-auto p-8">

        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">📚</span>
                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  {getGreeting()}, {user?.firstname || 'Facilitator'}!
                </span>
                <span>
                  <Badge bg='secondary'>{getProgramType()}</Badge>
                </span>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                {getProgramName()}
              </h1>
              <p className="text-slate-500 mt-1">Monitor content delivery and learner engagement</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
          <div className="group bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <FaUsers className="text-blue-500 text-lg" />
              </div>
              <span className="text-2xl font-bold text-slate-800">{stats.totalLearners}</span>
            </div>
            <p className="text-slate-600 font-medium">Total Learners</p>
            <p className="text-xs text-slate-400 mt-1">{stats.activeLearners} active this week</p>
          </div>

          <div className="group bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <FaBook className="text-emerald-500 text-lg" />
              </div>
              <span className="text-2xl font-bold text-slate-800">{stats.publishedContent}/{stats.totalContent}</span>
            </div>
            <p className="text-slate-600 font-medium">Content Published</p>
            <ProgressBar
              now={(stats.publishedContent / stats.totalContent) * 100}
              className="h-1.5 mt-2 rounded-full"
              variant="success"
            />
          </div>

          <div className="group bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <FaEye className="text-amber-500 text-lg" />
              </div>
              <span className="text-2xl font-bold text-slate-800">{stats.contentViews}</span>
            </div>
            <p className="text-slate-600 font-medium">Content Views</p>
            <p className="text-xs text-slate-400 mt-1">total interactions</p>
          </div>

          <div className="group bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <FaChartLine className="text-purple-500 text-lg" />
              </div>
              <span className="text-2xl font-bold text-slate-800">{stats.averageEngagement}%</span>
            </div>
            <p className="text-slate-600 font-medium">Avg. Engagement</p>
            <ProgressBar
              now={stats.averageEngagement}
              className="h-1.5 mt-2 rounded-full"
              variant="info"
            />
          </div>
        </div>

        {/* Secondary Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-4 shadow-lg">
            <p className="text-xs text-white/60 uppercase tracking-wide">Active Learners</p>
            <p className="text-2xl font-bold text-white mt-1">{stats.activeLearners}</p>
            <p className="text-xs text-white/40 mt-1">of {stats.totalLearners} total</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-4 shadow-lg">
            <p className="text-xs text-white/60 uppercase tracking-wide">Avg. Completion Rate</p>
            <p className="text-2xl font-bold text-white mt-1">{stats.avgCompletionRate}%</p>
            <ProgressBar
              now={stats.avgCompletionRate}
              className="h-1 mt-2 rounded-full"
              variant="light"
            />
          </div>
          <div className="bg-gradient-to-br from-amber-600 to-orange-600 rounded-2xl p-4 shadow-lg">
            <p className="text-xs text-white/60 uppercase tracking-wide">Draft Content</p>
            <p className="text-2xl font-bold text-white mt-1">{stats.draftContent}</p>
            <p className="text-xs text-white/40 mt-1">ready to publish</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {[
            { icon: <FaBook />, label: "Manage Content", color: "emerald", path: "content", description: "Upload & organize learning materials" },
            { icon: <FaUsers />, label: "View Learners", color: "blue", path: "learners", description: "Track learner progress" },
            { icon: <FaClipboardList />, label: "Assessments", color: "amber", path: "assessments", description: "View learner submissions" },
          ].map((action, idx) => (
            <button
              key={idx}
              onClick={() => navigate(action.path)}
              className="group bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-100 text-left"
            >
              <div className={`w-10 h-10 bg-${action.color}-50 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <div className={`text-${action.color}-500 text-lg`}>{action.icon}</div>
              </div>
              <p className="text-slate-800 font-semibold">{action.label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{action.description}</p>
            </button>
          ))}
        </div>


        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800">Recent Activity</h3>
            <p className="text-xs text-slate-400 mt-0.5">Latest updates and engagement</p>
          </div>
          <div className="divide-y divide-slate-50">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="p-2 flex items-start gap-3 hover:bg-slate-50/50 transition">
                <div className={`w-2 h-2 mt-2 rounded-full ${activity.type === 'completion' ? 'bg-emerald-500' :
                  activity.type === 'content' ? 'bg-blue-500' : 'bg-amber-500'
                  }`}></div>
                <div className="flex-1">
                  <p className="text-sm text-slate-700">{activity.action}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 py-3 bg-slate-50 border-t border-slate-100">
            <button className="bg-transparent text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              View All Activity →
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
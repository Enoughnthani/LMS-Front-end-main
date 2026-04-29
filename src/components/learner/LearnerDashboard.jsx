import React, { useState } from 'react';
import LogoImage from '../common/LogoImage';
import { Badge, Button } from 'react-bootstrap';
import { Bell, LogOut, Search, Settings, User2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const LearnerDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const { user, setUser, logout } = useAuth()
  const navigate = useNavigate()

  // Mock enrolled modules data with images
  const initialModules = [
    {
      id: 1,
      name: "Introduction to Web Development",
      unitStandard: "115363",
      image: "https://images.unsplash.com/photo-1593720219276-0b1eacd0aef4?w=400&h=240&fit=crop",
      description: "Learn the fundamentals of HTML, CSS, and JavaScript to build modern websites."
    },
    {
      id: 2,
      name: "React Fundamentals",
      unitStandard: "115364",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=240&fit=crop",
      description: "Master React hooks, components, state management, and modern frontend development."
    },
    {
      id: 3,
      name: "JavaScript Deep Dive",
      unitStandard: "115365",
      image: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400&h=240&fit=crop",
      description: "Advanced JavaScript concepts including closures, promises, and async patterns."
    },
    {
      id: 4,
      name: "Tailwind CSS Mastery",
      unitStandard: "115366",
      image: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=400&h=240&fit=crop",
      description: "Build beautiful responsive interfaces quickly with utility-first CSS."
    },
    {
      id: 5,
      name: "Backend with Node.js",
      unitStandard: "115367",
      image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=240&fit=crop",
      description: "Create REST APIs, handle authentication, and work with databases using Node.js."
    },
    {
      id: 6,
      name: "Database Design",
      unitStandard: "115368",
      image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=240&fit=crop",
      description: "Learn SQL, database normalization, and data modeling best practices."
    }
  ];

  const [modules, setModules] = useState(initialModules);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-semibold text-slate-700">Logged Out</h2>
          <p className="text-slate-500 mt-2">Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">

      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="mx-auto">
          <div className="flex mx-4 justify-between items-center h-16">
            <div className="flex items-center  gap-3">
              <LogoImage />
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              {/* Search Bar */}
              <div className="hidden md:flex items-center bg-slate-100 rounded-lg px-3 py-2 border border-slate-200 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
                <Search className="w-4 h-4 text-slate-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search programs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm w-48 placeholder:text-slate-400 text-slate-700"
                />
              </div>


              <button className="relative p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <Badge
                  pill
                  bg="primary"
                  className="absolute top-1 right-1 text-[10px] px-1.5 py-0.5 min-w-[18px]"
                >
                  0
                </Badge>
              </button>

              <div>
                <div
                  onClick={() => navigate('profile')}
                  className="flex items-center justify-center border relative rounded-pill p-1 cursor-pointer">
                  <User2 />
                  <Settings size={13} className="absolute bottom-0 -right-1" />
                </div>
              </div>


              <Button
                variant="outline-danger"
                onClick={logout}
                className="flex items-center gap-2 rounded-lg px-3 py-2 border-slate-300 text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all font-medium text-sm"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div>

          <div className='bg-white mb-4 p-3 rounded  font-bold text-muted'>
            <p className='m-0'>Welcome {user?.firstname} {user?.lastname}</p>
          </div>

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800">My Courses</h2>
            <button className="bg-transparent text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors">View All →</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {modules.map((module) => (
              <div
                onClick={()=>navigate(`course-view/${module?.id}`)}
                key={module.id}
                className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden hover:-translate-y-1"
              >
                
                <div className="relative h-48 overflow-hidden bg-slate-200">
                  <img
                    src={module.image}
                    alt={module.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-700 shadow-sm">
                    {module.unitStandard}
                  </div>
                </div>


                <div className="p-5">
                  <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-1">{module.name}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">{module.description}</p>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Self-paced</span>
                    </div>
                    <div className="text-xs font-medium text-slate-400 group-hover:text-slate-600 transition-colors">
                      Click to start →
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {modules.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <p className="text-slate-500">You are not enrolled in any learnerships yet.</p>
              <button className="mt-3 text-sm font-medium text-slate-600 hover:text-slate-800 underline">Browse Courses</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
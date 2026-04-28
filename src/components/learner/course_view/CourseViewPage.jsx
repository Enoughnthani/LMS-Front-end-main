import React, { useState } from 'react';

export const CourseViewPage = () => {
    const [activeSection, setActiveSection] = useState('content');

    const navItems = [
        {
            id: 'home', name: 'My Home', icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            )
        },
        {
            id: 'content', name: 'Content', icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            )
        },
        {
            id: 'assignments', name: 'Assignments', icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
            )
        },
        {
            id: 'discussions', name: 'Discussions', icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
            )
        }
    ];

 

    // Render main content based on active section
    const renderMainContent = () => {
        switch (activeSection) {
            case 'content':
                return (
                    <div className="bg-white rounded-lg border border-slate-200 p-6">
                        <div className="text-center py-12">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-slate-700 mb-2">Visual Table of Contents Widget</h3>
                            <p className="text-slate-500">No Content Available</p>
                        </div>
                    </div>
                );
            case 'assignments':
                return (
                    <div className="bg-white rounded-lg border border-slate-200 p-6">
                        <div className="text-center py-12">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-slate-700 mb-2">No Assignments Yet</h3>
                            <p className="text-slate-500">Check back later for learnership tasks and activities.</p>
                        </div>
                    </div>
                );
            case 'discussions':
                return (
                    <div className="bg-white rounded-lg border border-slate-200 p-6">
                        <div className="text-center py-12">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-slate-700 mb-2">No Discussions Yet</h3>
                            <p className="text-slate-500">Start a conversation with your peers and instructors.</p>
                        </div>
                    </div>
                );
            case 'quizzes':
                return (
                    <div className="bg-white rounded-lg border border-slate-200 p-6">
                        <div className="text-center py-12">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-slate-700 mb-2">No Quizzes Available</h3>
                            <p className="text-slate-500">This learnership program focuses on practical work-integrated learning.</p>
                        </div>
                    </div>
                );
            case 'classlist':
                return (
                    <div className="bg-white rounded-lg border border-slate-200 p-6">
                        <div className="mb-4">
                            <h3 className="text-lg font-medium text-slate-800">Class Members</h3>
                            <p className="text-sm text-slate-500">12 participants in this learnership</p>
                        </div>
                        <div className="space-y-3">
                            {[
                                { name: 'John Doe', role: 'Instructor', initials: 'JD' },
                                { name: 'Maria Smith', role: 'Facilitator', initials: 'MS' },
                                { name: 'Alex Johnson', role: 'Learner', initials: 'AJ', current: true },
                                { name: 'Sarah Lee', role: 'Learner', initials: 'SL' },
                                { name: 'Michael Brown', role: 'Learner', initials: 'MB' }
                            ].map((member, idx) => (
                                <div key={idx} className={`flex items-center gap-3 p-3 rounded-lg ${member.current ? 'bg-slate-50 border border-slate-200' : 'hover:bg-slate-50'}`}>
                                    <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                                        <span className="text-slate-600 font-medium text-sm">{member.initials}</span>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-slate-800">{member.name}</h4>
                                        <p className="text-xs text-slate-400">{member.role}</p>
                                    </div>
                                    {member.current && <span className="text-xs text-slate-400">You</span>}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'grades':
                return (
                    <div className="bg-white rounded-lg border border-slate-200 p-6">
                        <div className="text-center py-12">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-slate-700 mb-2">Grades Not Available</h3>
                            <p className="text-slate-500">Your progress will be updated as you complete learnership activities.</p>
                        </div>
                    </div>
                );
            case 'progress':
                return (
                    <div className="bg-white rounded-lg border border-slate-200 p-6">
                        <div className="text-center py-12">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-slate-700 mb-2">Class Progress</h3>
                            <p className="text-slate-500">Track your learnership journey here as you complete modules.</p>
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="bg-white rounded-lg border border-slate-200 p-6">
                        <div className="text-center py-12">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-slate-700 mb-2">Welcome to Your Learnership</h3>
                            <p className="text-slate-500">Use the sidebar to navigate through your course content and resources.</p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Skip to main content link */}
            <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:p-3 focus:rounded-lg focus:shadow-lg">
                Skip to main content
            </a>

            {/* Course Title Bar */}
            <div className="bg-white border-b border-slate-200 py-4 px-4 sm:px-6 lg:px-8">
                <div className="max-w-full">
                    <h1 className="text-xl font-semibold text-slate-800">WORK-INTEGRATED LEARNING (2026/1)</h1>
                </div>
            </div>

            {/* Main Layout with Sidebar */}
            <div className="flex flex-col lg:flex-row">
                {/* Sidebar Navigation */}
                <aside className="lg:w-64 bg-white border-r border-slate-200 min-h-screen">
                    <nav className="py-4">
                        {/* Course Home */}
                        <div className="px-3 mb-2">
                            <button
                                onClick={() => setActiveSection('home')}
                                className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeSection === 'home'
                                    ? 'bg-slate-100 text-slate-900'
                                    : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                Course Home
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-slate-100 my-3"></div>

                        {/* Main Navigation Items */}
                        <div className="px-3 space-y-1">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveSection(item.id)}
                                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeSection === item.id
                                        ? 'bg-slate-100 text-slate-900'
                                        : 'text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    {item.icon}
                                    {item.name}
                                </button>
                            ))}
                        </div>

                        {/* Divider for Course Tools */}
                        <div className="border-t border-slate-100 my-3">
                            <div className="px-3 pt-3">
                                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Course Tools</h3>
                            </div>
                        </div>

                        {/* More Tools */}
                        <div className="px-3 space-y-1">
                            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-md transition-colors">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                </svg>
                                More
                            </button>
                        </div>
                    </nav>
                </aside>

                {/* Main Content Area */}
                <main id="main-content" className="flex-1 p-6 lg:p-8">
                    <div className="max-w-5xl mx-auto">
                        {/* Course Title Section */}
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-slate-800">WORK-INTEGRATED LEARNING (2026/1)</h2>
                        </div>


                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left Column - Main Content */}
                            <div className="lg:col-span-3 space-y-6">
                                {/* Visual Table of Contents Widget */}
                                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                                    <div className="border-b border-slate-200 px-4 py-3 bg-slate-50">
                                        <h3 className="font-medium text-slate-700">Visual Table of Contents Widget</h3>
                                    </div>
                                    <div className="p-6">
                                        {renderMainContent()}
                                    </div>
                                </div>

                                {/* Updates Section */}
                                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                                    <div className="border-b border-slate-200 px-4 py-3 bg-slate-50">
                                        <h3 className="font-medium text-slate-700">Updates</h3>
                                    </div>
                                    <div className="p-6">
                                        <div className="text-center py-8">
                                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                </svg>
                                            </div>
                                            <h3 className="font-medium text-slate-700 mb-1">Activity Feed</h3>
                                            <h4 className="text-sm font-medium text-slate-500 mb-2">Latest Posts</h4>
                                            <p className="text-sm text-slate-400">There's nothing here just yet.</p>
                                            <p className="text-xs text-slate-400 mt-2">This is where you'll find assignments, announcements, lessons and other resources. Check back soon!</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {/* Announcements Widget */}
                                    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                                        <div className="border-b border-slate-200 px-4 py-3 bg-slate-50">
                                            <h3 className="font-medium text-slate-700">Announcements</h3>
                                        </div>
                                        <div className="p-6 text-center py-8">
                                            <svg className="w-12 h-12 text-slate-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6m0 6a3 3 0 110-6m0 6v6m-6-6H9m9 0h-3" />
                                            </svg>
                                            <p className="text-sm text-slate-500">There are no announcements to display.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};
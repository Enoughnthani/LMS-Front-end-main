// AdminDashboard.jsx
import { apiFetch } from "@/api/api";
import { useAuth } from "@/contexts/AuthContext";
import { GETUSERS } from "@/utils/apiEndpoint";
import { Home, LogOut, Megaphone, Podcast, Radio, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import {
    FaBell,
    FaBook,
    FaChartLine,
    FaClipboardList,
    FaCog,
    FaComments,
    FaDatabase,
    FaHistory,
    FaHornbill,
    FaQuestionCircle,
    FaShieldAlt,
    FaUserPlus,
    FaUsers
} from "react-icons/fa";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTopLoader } from "@/contexts/TopLoaderContext";
import LogoImage from "@/components/common/LogoImage";

export const CourseViewPage = () => {
    const [step, setStep] = useState(0);
    const [response, setResponse] = useState(null);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { start, complete, visible } = useTopLoader();
    const [users, setUsers] = useState(null);
    const location = useLocation()

    async function getUsers() {
        try {
            let result = await apiFetch(GETUSERS);
            setUsers(result);
        } catch (error) {
            setResponse({ success: false, message: "An error has accoured while fetching data" });
        } finally {
            complete();
        }
    }

    useEffect(() => {
        start();
        getUsers();
    }, []);


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

            <Outlet />
        </div>
    );
}
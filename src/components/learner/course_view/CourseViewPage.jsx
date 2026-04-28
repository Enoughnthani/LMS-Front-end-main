// AdminDashboard.jsx
import { apiFetch } from "@/api/api";
import { useAuth } from "@/contexts/AuthContext";
import { GETUSERS } from "@/utils/apiEndpoint";
import { BookOpen, ClipboardCheck, Home, LogOut, MessageSquare, Notebook } from "lucide-react";
import { useEffect, useState } from "react";
import {
    FaBell,
    FaChartLine,
    FaCog,
    FaQuestionCircle,
    FaUsers
} from "react-icons/fa";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTopLoader } from "@/contexts/TopLoaderContext";
import LogoImage from "@/components/common/LogoImage";

export default function CourseViewPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation()



    return (
        <div className="min-h-screen flex text-gray-800">

            <aside className="hidden md:block min-w-[16rem] bg-white shadow-md border !border-gray-200 py-6 px-1.5 ">
                <div className="flex items-center gap-2 mb-6 px-3">
                    <LogoImage />
                </div>

                <ul className="p-1">
                    {[
                        { icon: <Home />, label: "Home", path: -1 },
                        { icon: <BookOpen />, label: "Content", path: 'content' },
                        { icon: <ClipboardCheck />, label: "Assessment", path: 'assessment' },
                        { icon: <MessageSquare />, label: "Discussion", path: 'discussion' },
                    ].map((item, idx) => {
                        const isLogout = item.label === "Logout";
                        
                        const isActive = item.path === -1
                            ? location.pathname === '/'
                            : location.pathname === item.path;

                        return (
                            <li
                                onClick={() => {
                                    if (isLogout) {
                                        item.event();
                                    } else {
                                        navigate(item.path === -1 ? '/' : item.path);
                                    }
                                }}
                                key={idx}
                                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${isLogout
                                        ? "text-red-600 hover:bg-red-50 hover:text-red-700 mt-0 border-t border-gray-200"
                                        : isActive
                                            ? "bg-gradient-to-r from-green-50 to-green-50/50 text-green-800 border-l-4 border-green-800 font-semibold"
                                            : "text-gray-600 hover:bg-green-50/30 hover:text-green-800"
                                    }`}
                            >
                                <span className="text-lg">{item.icon}</span>
                                <span className="font-medium">{item.label}</span>
                            </li>
                        );
                    })}
                </ul>
            </aside>

            <Outlet />
        </div>
    );
}
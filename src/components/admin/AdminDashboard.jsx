// AdminDashboard.jsx
import { apiFetch } from "@/api/api";
import { useAuth } from "@/contexts/AuthContext";
import { GETUSERS } from "@/utils/apiEndpoint";
import { LogOut, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import {
  FaBell,
  FaBook,
  FaChartLine,
  FaCog,
  FaDatabase,
  FaHistory,
  FaQuestionCircle,
  FaShieldAlt,
  FaUserPlus,
  FaUsers
} from "react-icons/fa";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTopLoader } from "../../contexts/TopLoaderContext";

export default function AdminDashboard() {
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
    <div className="min-h-screen flex text-gray-800">

      <aside className="hidden md:block min-w-[16rem] bg-white shadow-md border !border-gray-200 py-6 px-1.5 ">
        <div className="flex mx-2 items-center gap-3">
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
              B & T LMS
            </h2>
            <p className="text-xs text-gray-500">Learnerships & Internships</p>
          </div>
        </div>

        <ul>
          {[
            { icon: <FaChartLine />, label: "Dashboard", alert: true, path: '/user/admin' },
            { icon: <FaUsers />, label: "Users", alert: false, path: '/user/admin/users' },
            { icon: <FaCog />, label: "Settings", alert: false, path: '/user/admin/settings' },
            { icon: <FaBell />, label: "Notifications", alert: false, path: '/user/admin/notifications' },
            { icon: <FaQuestionCircle />, label: "Help", alert: false, path: '/user/admin/help' },
          ].map((item, idx) => (
            <li
              onClick={() => navigate(item.path)}
              key={idx}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${location.pathname === item.path
                ? "bg-gradient-to-r from-red-50 to-red-50/50 text-red-600 border-l-4 border-red-600 font-semibold"
                : "text-gray-600 hover:bg-red-50/30 hover:text-red-600"
                }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
              {item.alert && <div className="ml-auto w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>}
            </li>
          ))}
        </ul>

        <Button
          onClick={logout}
          variant="outline-danger"
          className="flex items-center justify-center mt-4 w-full gap-2 
             border-red-300 hover:border-red-600 
             text-red-600 hover:text-white 
             hover:bg-gradient-to-r hover:from-red-600 hover:to-red-700
             transition-all duration-300 
             py-2.5 rounded-lg font-medium
              hover:shadow-md"
        >
          <LogOut className="group-hover:scale-110 transition-transform" />
          Logout
        </Button>
      </aside>

      <Outlet />
    </div>
  );
}
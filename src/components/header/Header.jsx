import { Link, useLocation } from "react-router-dom";
import logo from "@/resources/logo.png";

export default function Header() {

    const location = useLocation()

    return (
        <header  className="fixed top-0 left-0 right-0 bg-slate-50/5  z-50 w-full">
            <div className="flex justify-between items-center py-1 px-2 md:px-4">

                <Link to="/" className="no-underline">
                    <div className="flex flex-col cursor-pointer rounded px-1 bg-white/70 items-start ">
                        <img
                            src={logo}
                            alt="Logo image"

                            className="rounded w-auto object-contain"
                        />
                        <p className="text-xs md:text-sm text-gray-600 font-medium m-0 text-muted">
                            Learning Management System
                        </p>
                    </div>
                </Link>
                {/* Auth Buttons */}
                <div className="flex items-center gap-3">
                    {/* Home Button - New */}
                    <Link to="/">
                        <button className="px-4 py-1.5 md:px-5 md:py-2 text-sm md:text-base font-medium text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-100 hover:border-gray-400 transition-all flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            <span>Home</span>
                        </button>
                    </Link>

                    <Link to="/login">
                        <button className="px-4 py-1.5 md:px-5 md:py-2 text-sm md:text-base font-medium text-red-600 border-2 border-red-600 rounded-lg hover:bg-red-50 hover:scale-105 transition-all duration-300 shadow-sm hover:shadow-md">
                            Login
                        </button>
                    </Link>

                    <Link to="/register">
                        <button className="px-4 py-1.5 md:px-5 md:py-2 text-sm md:text-base font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 hover:scale-105 transition-all duration-300 shadow-sm hover:shadow-md">
                            Register
                        </button>
                    </Link>
                </div>
            </div>
        </header>
    );
}
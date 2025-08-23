import React, { useState, useRef, useEffect } from "react";
import { Link, usePage, useForm } from "@inertiajs/react";
import {
  BarChart3,
  LogIn,
  UserPlus,
  LogOut,
  ChevronDown,
  User,
  Globe,
} from "lucide-react";

const Header = () => {
  const { props } = usePage();
  const user = props.user;
  const { delete: destroy } = useForm();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    destroy("/users/log_out");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center space-x-3">
            <img src="/images/logo.svg" alt="" className="h-16 w-auto" />
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-blue-600"></span>
              <span className="text-2xl font-light text-gray-700">
                데이터 분석 시스템
              </span>
            </div>
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <User size={18} className="text-white" />
                  </div>
                  <ChevronDown
                    size={16}
                    className={`transform transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                      <p className="text-sm text-gray-600">환영합니다</p>
                    </div>
                    <Link
                      href="/users/profile"
                      className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User size={18} />
                      <span>프로필 관리</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors border-t border-gray-200"
                    >
                      <LogOut size={18} />
                      <span>로그아웃</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/register"
                  className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors duration-200 font-medium"
                >
                  <UserPlus size={18} />
                  <span>회원가입</span>
                </Link>
                <Link
                  href="/login"
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                >
                  <LogIn size={18} />
                  <span>로그인</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

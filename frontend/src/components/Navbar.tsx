import React from 'react';
import { Link } from 'react-router-dom';

export function Navbar() {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 h-16 flex items-center justify-between">
      <div className="text-white font-semibold text-xl">Deep Research</div>
      <nav className="flex items-center space-x-6">
        <Link to="/" className="text-white hover:text-blue-100 transition-colors">
          首页
        </Link>
        <Link to="/login" className="text-white hover:text-blue-100 transition-colors">
          注册/登录
        </Link>
        <Link to="/preferences" className="text-white hover:text-blue-100 transition-colors">
          偏好设置
        </Link>
        <Link to="/user-center" className="text-white hover:text-blue-100 transition-colors">
          用户中心
        </Link>
      </nav>
    </header>
  );
}
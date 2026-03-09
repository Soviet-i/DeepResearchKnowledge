import React, { useContext, useMemo } from 'react';
import { Navbar } from '../components/Navbar';
import { AuthContext } from '../contexts/authContext';
import { Link, Navigate, useNavigate } from 'react-router-dom';

export default function UserCenterPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useContext(AuthContext);

  const loginStorage = useMemo(() => {
    if (localStorage.getItem('authToken')) return '本地持久登录';
    if (sessionStorage.getItem('authToken')) return '会话登录';
    return '未知';
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">用户中心</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
              <div className="text-sm text-gray-500">邮箱</div>
              <div className="text-gray-900 font-medium mt-1">{user?.email || '-'}</div>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
              <div className="text-sm text-gray-500">用户名</div>
              <div className="text-gray-900 font-medium mt-1">{user?.name || '未设置'}</div>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
              <div className="text-sm text-gray-500">角色</div>
              <div className="text-gray-900 font-medium mt-1">{user?.role || 'user'}</div>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
              <div className="text-sm text-gray-500">登录状态</div>
              <div className="text-green-700 font-medium mt-1">{loginStorage}</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/preferences"
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              偏好设置
            </Link>
            <Link
              to="/search?query=人工智能"
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              去搜索文献
            </Link>
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              退出登录
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

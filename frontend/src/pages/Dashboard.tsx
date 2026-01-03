import React from 'react';
import { FiUser, FiShield, FiUsers, FiZap, FiCheck } from 'react-icons/fi';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const features = [
    'JWT Authentication with stateless sessions',
    'Role-Based Access Control (RBAC)',
    'Secure password hashing with BCrypt',
    'Input validation and error handling',
    'Protected routes and API endpoints',
    'Docker-ready development environment',
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.username}! 👋
          </h1>
          <p className="text-blue-100">
            You're successfully authenticated with our production-ready auth system.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiUser className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Your Profile</h3>
            <p className="text-sm text-gray-600 mb-3">
              View and manage your account information
            </p>
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <span className="text-xs text-gray-500">Status</span>
              <span className="text-xs font-semibold text-green-600">Active</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FiShield className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Security</h3>
            <p className="text-sm text-gray-600 mb-3">
              Your account is protected with JWT authentication
            </p>
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <span className="text-xs text-gray-500">Auth Type</span>
              <span className="text-xs font-semibold text-purple-600">JWT Bearer</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-pink-100 rounded-lg">
                <FiUsers className="w-6 h-6 text-pink-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Roles</h3>
            <p className="text-sm text-gray-600 mb-3">
              Your account has role-based access control
            </p>
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <span className="text-xs text-gray-500">Roles</span>
              <span className="text-xs font-semibold text-pink-600">
                {user?.roles.map(role => role.replace('ROLE_', '')).join(', ')}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <FiZap className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Quick Start</h3>
            <p className="text-sm text-gray-600 mb-3">
              Built with Spring Boot 3 & React 18
            </p>
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <span className="text-xs text-gray-500">Tech Stack</span>
              <span className="text-xs font-semibold text-green-600">Modern & Secure</span>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What's Included</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="p-1 bg-green-100 rounded-full">
                    <FiCheck className="w-4 h-4 text-green-600" />
                  </div>
                </div>
                <p className="text-gray-700">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
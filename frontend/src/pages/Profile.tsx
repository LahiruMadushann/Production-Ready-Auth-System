import React from 'react';
import { FiMail, FiUser, FiCalendar, FiShield } from 'react-icons/fi';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';

const Profile: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  const getInitials = () => {
    return user.username.substring(0, 2).toUpperCase();
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-32"></div>
          <div className="px-8 pb-8">
            <div className="flex items-end -mt-16 mb-6">
              <div className="w-32 h-32 bg-white rounded-2xl shadow-xl flex items-center justify-center border-4 border-white">
                <span className="text-4xl font-bold text-blue-600">{getInitials()}</span>
              </div>
              <div className="ml-6 mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{user.username}</h2>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>

            {/* Account Information */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiUser className="mr-2" />
                  Account Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center text-gray-500 text-sm mb-1">
                      <FiUser className="mr-2 w-4 h-4" />
                      Username
                    </div>
                    <p className="text-gray-900 font-medium">{user.username}</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center text-gray-500 text-sm mb-1">
                      <FiMail className="mr-2 w-4 h-4" />
                      Email
                    </div>
                    <p className="text-gray-900 font-medium">{user.email}</p>
                  </div>
                </div>
              </div>

              {/* Roles & Permissions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiShield className="mr-2" />
                  Roles & Permissions
                </h3>
                <div className="flex flex-wrap gap-2">
                  {user.roles.map((role, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      <FiShield className="mr-2 w-4 h-4" />
                      {role.replace('ROLE_', '')}
                    </span>
                  ))}
                </div>
              </div>

              {/* Account Status */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiCalendar className="mr-2" />
                  Account Status
                </h3>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-800">
                        Your account is active and in good standing
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <FiShield className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-blue-900">Security Information</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>Your account is protected with industry-standard security measures:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>JWT token-based authentication</li>
                  <li>Encrypted password storage with BCrypt</li>
                  <li>Role-based access control</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
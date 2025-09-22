
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Dashboard = () => {
  const { user, userRoles } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-32">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
          
          <div className="bg-glass p-6 rounded-xl mb-8">
            <h2 className="text-xl font-semibold mb-4">Welcome, {user?.user_metadata?.full_name || 'User'}</h2>
            <p className="text-gray-300">
              Your account has been successfully set up with Violet the Curious.
            </p>
            <div className="mt-4">
              <h3 className="font-medium text-violet-300">Your roles:</h3>
              <ul className="mt-2">
                {userRoles.length > 0 ? (
                  userRoles.map((role, index) => (
                    <li key={index} className="inline-block bg-violet-800 text-white px-3 py-1 rounded-full text-sm mr-2 mb-2">
                      {role}
                    </li>
                  ))
                ) : (
                  <li className="inline-block bg-gray-800 text-white px-3 py-1 rounded-full text-sm">
                    No roles assigned
                  </li>
                )}
              </ul>
            </div>
          </div>
          
          <div className="bg-glass p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Dashboard Coming Soon</h2>
            <p className="text-gray-300">
              The full dashboard experience is under development and will be available soon. In the meantime,
              you can use the review request form on the homepage to start collecting customer feedback.
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;

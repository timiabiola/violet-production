import React from 'react';
import SessionForm from '@/components/SessionForm';
import AuthNavbar from '@/components/AuthNavbar';
import Footer from '@/components/Footer';

const ReviewForm = () => {
  return (
    <div className="min-h-screen bg-black">
      <AuthNavbar />
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)] p-4">
        <SessionForm />
      </div>
      <Footer />
    </div>
  );
};

export default ReviewForm;
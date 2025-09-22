
import React, { useState, useEffect } from 'react';
import ParticleBackground from './ParticleBackground';
import SessionForm from './SessionForm';

const ChatApp: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen w-full p-4 md:p-8">
      <ParticleBackground count={40} />
      
      <div className="flex-1 flex items-center justify-center z-10">
        <SessionForm />
      </div>
    </div>
  );
};

export default ChatApp;

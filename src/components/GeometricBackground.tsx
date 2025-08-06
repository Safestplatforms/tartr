
import React from 'react';

const GeometricBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Subtle ambient glow only */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute w-96 h-96 bg-primary/30 rounded-full blur-3xl top-20 left-20 animate-pulse"
          style={{ animationDuration: '8s' }}
        />
        <div 
          className="absolute w-80 h-80 bg-primary/20 rounded-full blur-3xl bottom-32 right-32 animate-pulse"
          style={{ animationDuration: '12s', animationDelay: '4s' }}
        />
      </div>
    </div>
  );
};

export default GeometricBackground;

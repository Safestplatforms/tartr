
import React from 'react';

const GeometricBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* 3D Grid Effect */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent"
          style={{
            backgroundImage: `
              linear-gradient(90deg, hsl(var(--primary) / 0.1) 1px, transparent 1px),
              linear-gradient(0deg, hsl(var(--primary) / 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            transform: 'perspective(1000px) rotateX(60deg) scale(1.5)',
            transformOrigin: 'center bottom'
          }}
        />
      </div>
      
      {/* Flowing Light Beams */}
      <div className="absolute inset-0 opacity-30">
        <div 
          className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent top-1/4 animate-[slide-in-right_4s_ease-in-out_infinite]"
          style={{ animationDelay: '0s' }}
        />
        <div 
          className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-primary/60 to-transparent top-1/2 animate-[slide-in-right_5s_ease-in-out_infinite]"
          style={{ animationDelay: '1.5s' }}
        />
        <div 
          className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-primary/40 to-transparent top-3/4 animate-[slide-in-right_6s_ease-in-out_infinite]"
          style={{ animationDelay: '3s' }}
        />
      </div>
      
      {/* Vertical Light Columns */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="absolute h-full w-0.5 bg-gradient-to-b from-transparent via-primary/60 to-transparent left-1/4 animate-[fade-in_3s_ease-in-out_infinite_alternate]"
          style={{ animationDelay: '0s' }}
        />
        <div 
          className="absolute h-full w-0.5 bg-gradient-to-b from-transparent via-primary/40 to-transparent left-1/2 animate-[fade-in_4s_ease-in-out_infinite_alternate]"
          style={{ animationDelay: '1s' }}
        />
        <div 
          className="absolute h-full w-0.5 bg-gradient-to-b from-transparent via-primary/50 to-transparent left-3/4 animate-[fade-in_3.5s_ease-in-out_infinite_alternate]"
          style={{ animationDelay: '2s' }}
        />
      </div>
      
      {/* Ambient Glow Effect */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute w-96 h-96 bg-primary/20 rounded-full blur-3xl top-10 left-10 animate-pulse"
          style={{ animationDuration: '4s' }}
        />
        <div 
          className="absolute w-80 h-80 bg-primary/15 rounded-full blur-3xl bottom-20 right-20 animate-pulse"
          style={{ animationDuration: '6s', animationDelay: '2s' }}
        />
      </div>
    </div>
  );
};

export default GeometricBackground;

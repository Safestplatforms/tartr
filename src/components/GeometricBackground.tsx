
import React from 'react';

const GeometricBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1200 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Animated grid pattern */}
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path
              d="M 60 0 L 0 0 0 60"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="0.5"
              opacity="0.2"
            />
          </pattern>
          
          {/* Gradient for flowing lines */}
          <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0" />
            <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Animated flowing lines */}
        <g className="animate-pulse">
          {/* Horizontal flowing lines */}
          <line 
            x1="0" y1="200" x2="1200" y2="200" 
            stroke="url(#flowGradient)" 
            strokeWidth="1"
            className="animate-[slide-in-right_3s_ease-in-out_infinite]"
          />
          <line 
            x1="0" y1="400" x2="1200" y2="400" 
            stroke="url(#flowGradient)" 
            strokeWidth="1"
            className="animate-[slide-in-right_4s_ease-in-out_infinite]"
            style={{ animationDelay: '1s' }}
          />
          <line 
            x1="0" y1="600" x2="1200" y2="600" 
            stroke="url(#flowGradient)" 
            strokeWidth="1"
            className="animate-[slide-in-right_5s_ease-in-out_infinite]"
            style={{ animationDelay: '2s' }}
          />
          
          {/* Vertical flowing lines */}
          <line 
            x1="300" y1="0" x2="300" y2="800" 
            stroke="url(#flowGradient)" 
            strokeWidth="1"
            className="animate-[fade-in_2s_ease-in-out_infinite_alternate]"
          />
          <line 
            x1="600" y1="0" x2="600" y2="800" 
            stroke="url(#flowGradient)" 
            strokeWidth="1"
            className="animate-[fade-in_3s_ease-in-out_infinite_alternate]"
            style={{ animationDelay: '0.5s' }}
          />
          <line 
            x1="900" y1="0" x2="900" y2="800" 
            stroke="url(#flowGradient)" 
            strokeWidth="1"
            className="animate-[fade-in_2.5s_ease-in-out_infinite_alternate]"
            style={{ animationDelay: '1s' }}
          />
        </g>
        
        {/* Pulsing dots at intersections */}
        <g className="animate-pulse">
          <circle cx="300" cy="200" r="3" fill="hsl(var(--primary))" opacity="0.4" />
          <circle cx="600" cy="400" r="3" fill="hsl(var(--primary))" opacity="0.4" />
          <circle cx="900" cy="600" r="3" fill="hsl(var(--primary))" opacity="0.4" />
          <circle cx="600" cy="200" r="2" fill="hsl(var(--primary))" opacity="0.3" />
          <circle cx="300" cy="400" r="2" fill="hsl(var(--primary))" opacity="0.3" />
          <circle cx="900" cy="400" r="2" fill="hsl(var(--primary))" opacity="0.3" />
        </g>
      </svg>
    </div>
  );
};

export default GeometricBackground;

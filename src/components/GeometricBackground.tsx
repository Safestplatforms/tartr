
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
        {/* Grid pattern */}
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path
              d="M 60 0 L 0 0 0 60"
              fill="none"
              stroke="hsl(var(--foreground))"
              strokeWidth="0.5"
              opacity="0.1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Geometric shapes */}
        <g opacity="0.08">
          {/* Large triangle */}
          <path
            d="M200,100 L400,300 L100,350 Z"
            fill="none"
            stroke="hsl(var(--foreground))"
            strokeWidth="1"
          />
          
          {/* Circle */}
          <circle
            cx="800"
            cy="150"
            r="80"
            fill="none"
            stroke="hsl(var(--foreground))"
            strokeWidth="1"
          />
          
          {/* Hexagon */}
          <path
            d="M1000,200 L1040,230 L1040,290 L1000,320 L960,290 L960,230 Z"
            fill="none"
            stroke="hsl(var(--foreground))"
            strokeWidth="1"
          />
          
          {/* Rectangle */}
          <rect
            x="150"
            y="500"
            width="120"
            height="80"
            fill="none"
            stroke="hsl(var(--foreground))"
            strokeWidth="1"
          />
          
          {/* Diamond */}
          <path
            d="M600,450 L650,500 L600,550 L550,500 Z"
            fill="none"
            stroke="hsl(var(--foreground))"
            strokeWidth="1"
          />
          
          {/* Connecting lines */}
          <path
            d="M300,200 L600,180 M800,230 L950,250 M400,400 L550,500"
            stroke="hsl(var(--foreground))"
            strokeWidth="0.5"
          />
        </g>
        
        {/* Floating dots */}
        <g opacity="0.15">
          <circle cx="120" cy="80" r="2" fill="hsl(var(--foreground))" />
          <circle cx="450" cy="120" r="1.5" fill="hsl(var(--foreground))" />
          <circle cx="750" cy="80" r="2" fill="hsl(var(--foreground))" />
          <circle cx="950" cy="400" r="1.5" fill="hsl(var(--foreground))" />
          <circle cx="300" cy="600" r="2" fill="hsl(var(--foreground))" />
          <circle cx="1100" cy="500" r="1.5" fill="hsl(var(--foreground))" />
        </g>
      </svg>
    </div>
  );
};

export default GeometricBackground;

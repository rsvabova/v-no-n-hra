import React from 'react';

// Generates simple snowflakes
const Snow: React.FC = () => {
  const snowflakes = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    animationDuration: `${Math.random() * 3 + 5}s`,
    opacity: Math.random(),
    size: Math.random() * 4 + 2,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute bg-white rounded-full animate-pulse"
          style={{
            left: flake.left,
            top: '-10px',
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            opacity: flake.opacity,
            animation: `float ${flake.animationDuration} infinite linear`,
          }}
        />
      ))}
      <style>{`
        @keyframes float {
          0% { transform: translateY(-10px) translateX(0px); }
          50% { transform: translateY(50vh) translateX(20px); }
          100% { transform: translateY(105vh) translateX(-20px); }
        }
      `}</style>
    </div>
  );
};

export default Snow;
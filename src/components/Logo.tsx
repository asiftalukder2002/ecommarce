import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, className = '' }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-lg tracking-wider',
    md: 'text-xl tracking-tight',
    lg: 'text-3xl tracking-tight',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Shopping Bag Icon with dual tone and elegant 'L' loop */}
      <svg
        viewBox="0 0 100 100"
        className={`${iconSizes[size]} shrink-0 drop-shadow-sm`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Handle */}
        <path
          d="M34 38V26C34 17.1634 41.1634 10 50 10C58.8366 10 66 17.1634 66 26V38"
          stroke="#475569"
          strokeWidth="8"
          strokeLinecap="round"
        />
        {/* Bag Left Body (Slate Grey) */}
        <path
          d="M14 38H50V90H22C17.5817 90 14 86.4183 14 82V38Z"
          fill="#475569"
        />
        {/* Bag Right Body (Vibrant Green) */}
        <path
          d="M50 38H86V82C86 86.4183 82.4183 90 78 90H50V38Z"
          fill="#10B981"
        />
        {/* Stylized White Script 'L' */}
        <path
          d="M52 42C46 42 43 47 43 54C43 66 61 50 63 60C64 67 48 78 30 76C20 74.8 14 68 20 59C24 53 38 60 48 68C53 72 65 74 72 73"
          stroke="white"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {showText && (
        <span className={`font-bold font-sans text-slate-700 dark:text-slate-200 ${textSizes[size]}`}>
          LUMA
        </span>
      )}
    </div>
  );
};

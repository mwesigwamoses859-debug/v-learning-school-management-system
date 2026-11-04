import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export default function VLearningLogo({ className = '', size = 120 }: LogoProps) {
  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      <img
        src="/v-learning-uganda-logo.jpg"
        alt="V-Learning Uganda — Making Learning Better"
        style={{ width: `${size}px`, height: 'auto', maxHeight: `${size}px` }}
        className="object-contain rounded-lg"
      />
    </div>
  );
}


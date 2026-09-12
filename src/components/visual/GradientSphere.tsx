import React from 'react';

interface GradientSphereProps {
  size?: string;
  className?: string;
}

export const GradientSphere: React.FC<GradientSphereProps> = ({
  size = '700px',
  className = '',
}) => {
  return (
    <div
      className={`rounded-full transition-transform duration-500 hover:scale-[1.02] ${className}`}
      style={{
        width: size,
        height: size,
        background: 'radial-gradient(circle at 40% 40%, #D4A843 0%, #E8A070 25%, #F79CFF 55%, #E8CCFF 80%, #B8C8FF 100%)',
        boxShadow: '0 0 80px rgba(212, 168, 67, 0.25), 0 0 140px rgba(247, 156, 255, 0.15)',
      }}
    />
  );
};

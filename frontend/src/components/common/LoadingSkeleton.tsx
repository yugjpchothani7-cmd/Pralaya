import React from 'react';

interface LoadingSkeletonProps {
  height?: string | number;
  width?: string | number;
  borderRadius?: string;
  style?: React.CSSProperties;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  height = '20px',
  width = '100%',
  borderRadius = '6px',
  style = {}
}) => {
  return (
    <div
      className="animate-shimmer"
      style={{
        height,
        width,
        borderRadius,
        background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.04) 25%, rgba(255, 255, 255, 0.09) 50%, rgba(255, 255, 255, 0.04) 75%)',
        backgroundSize: '200% 100%',
        ...style
      }}
    />
  );
};

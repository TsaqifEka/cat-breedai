import React, { useEffect, useState } from 'react';

const ConfidenceRing = ({ percentage, color = '#34d399', size = 120, strokeWidth = 10 }) => {
  const [offset, setOffset] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  useEffect(() => {
    // Animate the strokeDashoffset
    const progressOffset = circumference - (percentage / 100) * circumference;
    setTimeout(() => {
      setOffset(progressOffset);
    }, 100); // slight delay to ensure transition triggers
  }, [percentage, circumference]);

  return (
    <div style={{ width: size, height: size, position: 'relative', margin: '0 auto' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          stroke="var(--color-surface-hover)"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset === 0 ? circumference : offset}
          style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
          r={radius}
          cx={size / 2}
          cy={size / 2}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: 'var(--color-text)'
        }}
      >
        {percentage}%
      </div>
    </div>
  );
};

export default ConfidenceRing;

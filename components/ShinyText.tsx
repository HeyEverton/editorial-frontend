import React from 'react';
import './ShinyText.css';

export interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  delay?: number;
  className?: string;
  color?: string;
  shineColor?: string;
  spread?: number;
  direction?: 'left' | 'right';
  yoyo?: boolean;
  pauseOnHover?: boolean;
  style?: React.CSSProperties;
}

const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  disabled = false,
  speed = 2,
  delay = 0,
  className = '',
  color = '#b5b5b5',
  shineColor = '#ffffff',
  spread = 120,
  direction = 'left',
  yoyo = false,
  pauseOnHover = false,
  style = {},
}) => {
  const gradientDirection = direction === 'right' ? '270deg' : '90deg';

  return (
    <span
      className={`shiny-text ${disabled ? 'disabled' : ''} ${className}`}
      style={{
        backgroundImage: `linear-gradient(${gradientDirection}, ${color} 0%, ${color} calc(50% - ${spread / 2}px), ${shineColor} 50%, ${color} calc(50% + ${spread / 2}px), ${color} 100%)`,
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        animationDuration: `${speed}s`,
        animationDelay: `${delay}s`,
        animationDirection: yoyo ? 'alternate' : 'normal',
        animationPlayState: pauseOnHover ? 'paused' : 'running',
        ...style,
      }}
    >
      {text}
    </span>
  );
};

export default ShinyText;

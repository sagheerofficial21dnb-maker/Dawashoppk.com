import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
  isIconOnly?: boolean;
  variant?: 'light' | 'dark';
}

/**
 * Colorful, modern 'DS' emblem component
 * Features an energetic tech-wellness gradient with a bold, crisp DS monogram
 */
export const ModernDsBadge: React.FC<{ sizeClass?: string; className?: string }> = ({
  sizeClass = 'w-9 h-9',
  className = '',
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center flex-shrink-0 rounded-xl overflow-hidden shadow-md group-hover:scale-105 transition-transform duration-200 ${sizeClass} ${className}`}
      title="DawaShop PK - DS Emblem"
    >
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="dsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00C6FF" />
            <stop offset="35%" stopColor="#0072FF" />
            <stop offset="70%" stopColor="#7928CA" />
            <stop offset="100%" stopColor="#FF0080" />
          </linearGradient>
          <linearGradient id="dsAccentDot" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#EF4444" />
          </linearGradient>
          <filter id="dsShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* Gradient Background Squircle */}
        <rect width="48" height="48" rx="14" fill="url(#dsGradient)" />

        {/* Inner rim glow */}
        <rect
          x="1"
          y="1"
          width="46"
          height="46"
          rx="13"
          stroke="white"
          strokeOpacity="0.35"
          strokeWidth="1.5"
          fill="none"
        />

        {/* Modern 'DS' Monogram */}
        <text
          x="23"
          y="32"
          fontFamily="'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
          fontWeight="900"
          fontSize="21"
          letterSpacing="-0.8"
          textAnchor="middle"
          fill="#FFFFFF"
          filter="url(#dsShadow)"
        >
          DS
        </text>

        {/* Colorful Accent Sparkle Dot */}
        <circle cx="37" cy="12" r="3.5" fill="url(#dsAccentDot)" />
        <circle cx="37" cy="12" r="1.5" fill="#FFFFFF" />
      </svg>
    </div>
  );
};

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showSubtitle = false,
  className = '',
  isIconOnly = false,
  variant = 'dark',
}) => {
  const isLight = variant === 'light';

  const iconSizeClass =
    size === 'sm'
      ? 'w-7 h-7'
      : size === 'lg'
      ? 'w-11 h-11'
      : 'w-8 h-8 sm:w-9 sm:h-9';

  const textSizeClass =
    size === 'sm'
      ? 'text-base font-black'
      : size === 'lg'
      ? 'text-2xl font-black'
      : 'text-xl sm:text-2xl font-black';

  if (isIconOnly) {
    return <ModernDsBadge sizeClass={iconSizeClass} className={className} />;
  }

  return (
    <div className={`inline-flex items-center gap-2.5 group select-none ${className}`}>
      <ModernDsBadge sizeClass={iconSizeClass} />
      <div className="leading-none">
        <span
          className={`${textSizeClass} ${
            isLight ? 'text-white' : 'text-[#002B49]'
          } tracking-tight flex items-baseline gap-1`}
        >
          <span>
            Dawa<span className={isLight ? 'text-amber-400' : 'text-amber-500'}>Shop</span>
          </span>
          <span
            className={`text-[10px] sm:text-xs font-black uppercase px-1.5 py-0.5 rounded shadow-2xs ${
              isLight
                ? 'bg-blue-500 text-white'
                : 'bg-[#002B49] text-white'
            }`}
          >
            PK
          </span>
        </span>
        {showSubtitle && (
          <span
            className={`block text-[8px] sm:text-[9px] uppercase tracking-wider font-semibold mt-0.5 ${
              isLight ? 'text-slate-300' : 'text-slate-400'
            }`}
          >
            100% Genuine Care &amp; Timing
          </span>
        )}
      </div>
    </div>
  );
};

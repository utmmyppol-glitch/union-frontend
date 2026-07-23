import React from 'react';

interface SectionTitleProps {
  subtitle?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}

const alignStyles = {
  left: 'text-left',
  center: 'text-center mx-auto',
};

const SectionTitle: React.FC<SectionTitleProps> = ({
  subtitle,
  title,
  description,
  align = 'center',
  className = '',
}) => {
  return (
    <div className={`max-w-3xl ${alignStyles[align]} ${className}`}>
      {subtitle && (
        <span className="inline-block text-xs font-semibold uppercase tracking-[0.14em] text-[#6B6B70] mb-3">
          {subtitle}
        </span>
      )}

      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
        {title}
      </h2>

      {description && (
        <p className="mt-4 text-base sm:text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;
export type { SectionTitleProps };

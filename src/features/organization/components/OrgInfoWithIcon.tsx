import React, { ReactElement, useMemo } from 'react';
import { FiAlertCircle } from 'react-icons/fi';

interface OrgInfoWithIconProps {
  title?: string | ReactElement;
  value?: string | ReactElement;
  icon?: ReactElement;
  valueStyle?: string;
  titleStyle?: string;
  truncate?: boolean;
  loading?: boolean;
  error?: string | null;
  direction?: 'row' | 'column';
  align?: 'start' | 'center' | 'end';
  spacing?: 'none' | 'tight' | 'normal' | 'loose';
  className?: string;
  iconClassName?: string;
  containerClassName?: string;
  titleClassName?: string;
  valueClassName?: string;
  onClick?: () => void;
  'data-testid'?: string;
}

const spacingMap = {
  none: 'space-y-0',
  tight: 'space-y-1',
  normal: 'space-y-2',
  loose: 'space-y-3',
};

const OrgInfoWithIcon: React.FC<OrgInfoWithIconProps> = ({
  title,
  value,
  icon,
  valueStyle = '',
  titleStyle = '',
  truncate = false,
  loading = false,
  error = null,
  direction = 'row',
  align = 'start',
  spacing = 'normal',
  className = '',
  iconClassName = 'text-gray-500',
  containerClassName = '',
  titleClassName = 'font-medium text-sm text-gray-900',
  valueClassName = 'font-normal text-sm text-gray-600',
  onClick,
  'data-testid': testId,
}) => {
  const containerClasses = useMemo(() => {
    const baseClasses = [
      'flex',
      direction === 'row' ? 'items-center' : 'flex-col',
      `items-${align}`,
      spacingMap[spacing],
      onClick ? 'cursor-pointer hover:bg-gray-50 rounded-lg transition-colors' : '',
      className,
    ].filter(Boolean).join(' ');

    return baseClasses;
  }, [direction, align, spacing, className, onClick]);

  const contentClasses = useMemo(() => {
    const baseClasses = [
      'flex-1 min-w-0',
      direction === 'row' ? 'ml-2' : 'mt-1',
      containerClassName,
    ].filter(Boolean).join(' ');

    return baseClasses;
  }, [direction, containerClassName]);

  const titleClasses = useMemo(() => {
    const baseClasses = [
      'leading-tight',
      truncate ? 'truncate' : 'break-words',
      titleClassName,
      titleStyle,
    ].filter(Boolean).join(' ');

    return baseClasses;
  }, [truncate, titleClassName, titleStyle]);

  const valueClasses = useMemo(() => {
    const baseClasses = [
      'leading-normal',
      truncate ? 'truncate' : 'break-words',
      valueClassName,
      valueStyle,
    ].filter(Boolean).join(' ');

    return baseClasses;
  }, [truncate, valueClassName, valueStyle]);

  if (loading) {
    return (
      <div className={`${containerClasses} animate-pulse`} data-testid={testId}>
        {icon && (
          <div className={`h-5 w-5 rounded-full bg-gray-200 ${iconClassName}`} />
        )}
        <div className={contentClasses}>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-1" />
          {value && <div className="h-3 bg-gray-100 rounded w-1/2" />}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${containerClasses} text-red-600`} data-testid={`${testId}-error`}>
        <FiAlertCircle className="h-5 w-5 text-red-500" />
        <div className={contentClasses}>
          <span className="text-sm font-medium">Error loading content</span>
          {error && <span className="block text-xs text-red-500">{error}</span>}
        </div>
      </div>
    );
  }

  return (
    <div 
      className={containerClasses} 
      onClick={onClick}
      data-testid={testId}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      {icon && (
        <span className={`flex-shrink-0 ${iconClassName}`}>
          {React.cloneElement(icon, {
            'aria-hidden': 'true',
            className: 'h-5 w-5',
          })}
        </span>
      )}
      <div className={contentClasses}>
        {title && (
          <h3 
            className={titleClasses}
            title={typeof title === 'string' ? title : undefined}
          >
            {title}
          </h3>
        )}
        {value && (
          <div
            className={valueClasses}
            title={typeof value === 'string' ? value : undefined}
            data-testid={testId ? `${testId}-value` : undefined}
          >
            {value}
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(OrgInfoWithIcon);

import { ReactNode } from 'react';
import { getStatusColor } from '../../utils/format';

interface BadgeProps {
  status?: string;
  text?: string;
  className?: string;
  children?: ReactNode;
}

export const Badge = ({ status, text, className = '', children }: BadgeProps) => {
  const colorClass = status ? getStatusColor(status) : '';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass} ${className}`}>
      {children || text}
    </span>
  );
};

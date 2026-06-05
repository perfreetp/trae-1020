import { getStatusColor } from '../../utils/format';

interface BadgeProps {
  status: string;
  text: string;
  className?: string;
}

export const Badge = ({ status, text, className = '' }: BadgeProps) => {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)} ${className}`}>
      {text}
    </span>
  );
};

import { getStatusDotColor } from '../../utils/format';

interface StatusDotProps {
  status: string;
  className?: string;
  pulse?: boolean;
}

export const StatusDot = ({ status, className = '', pulse = false }: StatusDotProps) => {
  return (
    <span className={`relative flex h-2.5 w-2.5 ${className}`}>
      {pulse && (
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${getStatusDotColor(status)} opacity-75`}></span>
      )}
      <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${getStatusDotColor(status)}`}></span>
    </span>
  );
};

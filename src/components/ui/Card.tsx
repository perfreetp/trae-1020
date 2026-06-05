import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  extra?: ReactNode;
  onClick?: () => void;
}

export const Card = ({ children, className = '', title, extra, onClick }: CardProps) => {
  return (
    <div 
      className={`bg-white rounded-xl shadow-md overflow-hidden ${onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''} ${className}`}
      onClick={onClick}
    >
      {(title || extra) && (
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          {title && <h3 className="text-lg font-semibold text-gray-800">{title}</h3>}
          {extra}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
};

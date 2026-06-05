import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { getStatusDotColor, getStatusText } from '../../utils/format';
import { MapPin } from 'lucide-react';

const pondPositions: Record<string, { x: number; y: number }> = {
  'pond-1': { x: 25, y: 35 },
  'pond-2': { x: 55, y: 25 },
  'pond-3': { x: 75, y: 55 },
  'pond-4': { x: 45, y: 65 },
  'pond-5': { x: 20, y: 70 },
};

export const PondMap = () => {
  const { ponds, setSelectedPondId } = useStore();
  const navigate = useNavigate();

  const handlePondClick = (pondId: string) => {
    setSelectedPondId(pondId);
    navigate(`/pond?id=${pondId}`);
  };

  return (
    <div className="relative w-full h-80 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl overflow-hidden border border-gray-200">
      <div className="absolute inset-0 opacity-30">
        <svg className="w-full h-full">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94A3B8" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <line x1="25%" y1="35%" x2="55%" y2="25%" stroke="#94A3B8" strokeWidth="1" strokeDasharray="4" opacity="0.4" />
        <line x1="55%" y1="25%" x2="75%" y2="55%" stroke="#94A3B8" strokeWidth="1" strokeDasharray="4" opacity="0.4" />
        <line x1="75%" y1="55%" x2="45%" y2="65%" stroke="#94A3B8" strokeWidth="1" strokeDasharray="4" opacity="0.4" />
        <line x1="45%" y1="65%" x2="20%" y2="70%" stroke="#94A3B8" strokeWidth="1" strokeDasharray="4" opacity="0.4" />
        <line x1="20%" y1="70%" x2="25%" y2="35%" stroke="#94A3B8" strokeWidth="1" strokeDasharray="4" opacity="0.4" />
      </svg>

      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-2 rounded-lg shadow-sm">
        <p className="text-sm font-medium text-gray-700">塘口分布地图</p>
      </div>

      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-2 rounded-lg shadow-sm">
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-secondary-500"></span>
            <span className="text-gray-600">正常</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span className="text-gray-600">预警</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span className="text-gray-600">异常</span>
          </div>
        </div>
      </div>

      {ponds.map((pond) => {
        const pos = pondPositions[pond.id] || { x: 50, y: 50 };
        return (
          <button
            key={pond.id}
            onClick={() => handlePondClick(pond.id)}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 group z-10"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
          >
            <div className="relative">
              <div className={`absolute inset-0 rounded-full ${getStatusDotColor(pond.status)} animate-ping opacity-30`}></div>
              <div className={`relative w-12 h-12 rounded-full ${getStatusDotColor(pond.status)} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform cursor-pointer`}>
                <MapPin className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white px-3 py-1.5 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
              <p className="text-sm font-semibold text-gray-800">{pond.name}</p>
              <p className="text-xs text-gray-500">{pond.breed} · {pond.area}亩</p>
              <p className="text-xs font-medium mt-0.5" style={{ color: pond.status === 'normal' ? '#059669' : pond.status === 'warning' ? '#d97706' : '#dc2626' }}>
                {getStatusText(pond.status)}
              </p>
            </div>
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium text-gray-700 bg-white/80 px-2 py-0.5 rounded">
              {pond.name}
            </div>
          </button>
        );
      })}

      <div className="absolute bottom-4 left-4 flex items-center gap-4">
        <div className="bg-white/90 backdrop-blur px-3 py-2 rounded-lg shadow-sm">
          <p className="text-xs text-gray-500">共 <span className="font-semibold text-primary-600">{ponds.length}</span> 个塘口</p>
        </div>
        <div className="bg-white/90 backdrop-blur px-3 py-2 rounded-lg shadow-sm">
          <p className="text-xs text-gray-500">总面积 <span className="font-semibold text-primary-600">{ponds.reduce((sum, p) => sum + p.area, 0).toFixed(1)}</span> 亩</p>
        </div>
      </div>
    </div>
  );
};

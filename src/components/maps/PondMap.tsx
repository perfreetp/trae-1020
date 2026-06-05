import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { getStatusDotColor, getStatusText } from '../../utils/format';
import { MapPin } from 'lucide-react';

export const PondMap = () => {
  const { ponds } = useStore();
  const navigate = useNavigate();

  const getPondPosition = (pond: typeof ponds[0]) => {
    const baseX = 30.57;
    const baseY = 114.30;
    const scale = 10000;
    return {
      x: (pond.location.lng - baseY) * scale + 50,
      y: (baseX - pond.location.lat) * scale + 50
    };
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
        const pos = getPondPosition(pond);
        return (
          <button
            key={pond.id}
            onClick={() => navigate(`/pond?id=${pond.id}`)}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
          >
            <div className="relative">
              <div className={`absolute inset-0 rounded-full ${getStatusDotColor(pond.status)} animate-ping opacity-30`}></div>
              <div className={`relative w-10 h-10 rounded-full ${getStatusDotColor(pond.status)} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                <MapPin className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white px-3 py-1.5 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
              <p className="text-sm font-medium text-gray-800">{pond.name}</p>
              <p className="text-xs text-gray-500">{pond.breed} · {getStatusText(pond.status)}</p>
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

import { useEffect, useState } from 'react';

interface GaugeChartProps {
  value: number;
  min: number;
  max: number;
  label: string;
  unit: string;
  thresholds?: { warning: number; danger: number };
  size?: number;
}

export const GaugeChart = ({
  value,
  min,
  max,
  label,
  unit,
  thresholds,
  size = 160
}: GaugeChartProps) => {
  const [displayValue, setDisplayValue] = useState(min);

  useEffect(() => {
    const timer = setTimeout(() => setDisplayValue(value), 100);
    return () => clearTimeout(timer);
  }, [value]);

  const percentage = Math.min(Math.max((displayValue - min) / (max - min), 0), 1);
  const angle = percentage * 180 - 90;
  const radius = size / 2 - 20;
  const strokeWidth = 12;

  const getColor = () => {
    if (thresholds) {
      if (value >= thresholds.danger) return '#DC2626';
      if (value >= thresholds.warning) return '#D97706';
    }
    return '#059669';
  };

  const polarToCartesian = (angle: number) => {
    const radian = (angle * Math.PI) / 180;
    return {
      x: size / 2 + radius * Math.cos(radian),
      y: size / 2 + radius * Math.sin(radian)
    };
  };

  const describeArc = (startAngle: number, endAngle: number) => {
    const start = polarToCartesian(endAngle);
    const end = polarToCartesian(startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
  };

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size / 2 + 30} viewBox={`0 0 ${size} ${size / 2 + 30}`}>
        <path
          d={describeArc(-90, 90)}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        <path
          d={describeArc(-90, angle)}
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
        <text
          x={size / 2}
          y={size / 2 - 10}
          textAnchor="middle"
          className="text-2xl font-bold"
          fill="#1F2937"
        >
          {displayValue.toFixed(1)}
        </text>
        <text
          x={size / 2}
          y={size / 2 + 10}
          textAnchor="middle"
          className="text-xs"
          fill="#6B7280"
        >
          {unit}
        </text>
      </svg>
      <p className="text-sm font-medium text-gray-700 mt-2">{label}</p>
    </div>
  );
};

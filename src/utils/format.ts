import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export const formatDate = (date: string | Date, fmt: string = 'yyyy-MM-dd') => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, fmt, { locale: zhCN });
};

export const formatDateTime = (date: string | Date) => {
  return formatDate(date, 'yyyy-MM-dd HH:mm');
};

export const formatRelativeTime = (dateStr: string) => {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = now.getTime() - date.getTime();
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;
  return formatDate(dateStr);
};

export const formatNumber = (num: number, decimals: number = 2) => {
  return num.toFixed(decimals);
};

export const formatCurrency = (num: number) => {
  return `¥${num.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}`;
};

export const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    normal: 'text-secondary-600 bg-secondary-50',
    warning: 'text-amber-600 bg-amber-50',
    danger: 'text-red-600 bg-red-50',
    running: 'text-secondary-600 bg-secondary-50',
    stopped: 'text-gray-600 bg-gray-50',
    fault: 'text-red-600 bg-red-50',
    pending: 'text-amber-600 bg-amber-50',
    processing: 'text-blue-600 bg-blue-50',
    resolved: 'text-gray-600 bg-gray-50',
    active: 'text-red-600 bg-red-50',
    recovering: 'text-amber-600 bg-amber-50',
    shipped: 'text-blue-600 bg-blue-50',
    completed: 'text-secondary-600 bg-secondary-50',
    cancelled: 'text-gray-600 bg-gray-50'
  };
  return colors[status] || 'text-gray-600 bg-gray-50';
};

export const getStatusDotColor = (status: string) => {
  const colors: Record<string, string> = {
    normal: 'bg-secondary-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
    running: 'bg-secondary-500',
    stopped: 'bg-gray-400',
    fault: 'bg-red-500',
    pending: 'bg-amber-500',
    processing: 'bg-blue-500',
    resolved: 'bg-gray-400'
  };
  return colors[status] || 'bg-gray-400';
};

export const getAlertLevelColor = (level: string) => {
  const colors: Record<string, string> = {
    info: 'text-blue-600 bg-blue-50 border-blue-200',
    warning: 'text-amber-600 bg-amber-50 border-amber-200',
    danger: 'text-red-600 bg-red-50 border-red-200'
  };
  return colors[level] || 'text-gray-600 bg-gray-50 border-gray-200';
};

export const getDeviceTypeName = (type: string) => {
  const names: Record<string, string> = {
    aerator: '增氧机',
    feeder: '投饵机',
    sensor: '传感器'
  };
  return names[type] || type;
};

export const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    normal: '正常',
    warning: '预警',
    danger: '异常',
    running: '运行中',
    stopped: '已停止',
    fault: '故障',
    pending: '待处理',
    processing: '处理中',
    resolved: '已处理',
    active: '发病中',
    recovering: '恢复中',
    shipped: '已发货',
    completed: '已完成',
    cancelled: '已取消'
  };
  return texts[status] || status;
};

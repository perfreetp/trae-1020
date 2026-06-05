import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Droplets,
  Settings,
  ClipboardList,
  Package,
  BarChart3,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Fish,
  FileText
} from 'lucide-react';
import { useStore } from '../../store/useStore';

const menuItems = [
  { path: '/', icon: LayoutDashboard, label: '监控首页' },
  { path: '/pond', icon: Droplets, label: '塘口管理' },
  { path: '/device', icon: Settings, label: '设备控制' },
  { path: '/inspection', icon: ClipboardList, label: '巡检填报' },
  { path: '/inventory', icon: Package, label: '投入品管理' },
  { path: '/analysis', icon: BarChart3, label: '经营分析' },
  { path: '/alert', icon: AlertTriangle, label: '预警处理' },
  { path: '/logs', icon: FileText, label: '操作日志' }
];

export const Sidebar = () => {
  const { sidebarCollapsed, setSidebarCollapsed } = useStore();
  const location = useLocation();

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-primary-900 text-white transition-all duration-300 z-50 ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-primary-800">
        {!sidebarCollapsed && (
          <div className="flex items-center gap-2">
            <Fish className="w-8 h-8 text-primary-300" />
            <span className="font-bold text-lg">智慧养殖</span>
          </div>
        )}
        {sidebarCollapsed && <Fish className="w-8 h-8 text-primary-300 mx-auto" />}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-1.5 rounded-lg hover:bg-primary-800 transition-colors"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      <nav className="mt-6 px-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg mb-1 transition-all ${
                isActive
                  ? 'bg-primary-700 text-white shadow-lg'
                  : 'text-primary-200 hover:bg-primary-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && <span className="text-sm font-medium">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {!sidebarCollapsed && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-primary-800 rounded-lg p-4">
            <p className="text-xs text-primary-300 mb-2">系统状态</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-secondary-500 rounded-full animate-pulse"></span>
              <span className="text-sm text-white">设备在线中</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

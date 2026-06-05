import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { StatusDot } from '../../components/ui/StatusDot';
import { GaugeChart } from '../../components/charts/GaugeChart';
import { TrendChart } from '../../components/charts/TrendChart';
import { PondMap } from '../../components/maps/PondMap';
import { useStore } from '../../store/useStore';
import { formatRelativeTime, getStatusText, getDeviceTypeName, formatNumber } from '../../utils/format';
import { useNavigate } from 'react-router-dom';
import {
  Thermometer,
  Droplets,
  Wind,
  Activity,
  AlertTriangle,
  Power,
  PowerOff,
  ChevronRight,
  Fish,
  Clock
} from 'lucide-react';
import { generateWaterQualityHistory } from '../../data/mockData';

const Dashboard = () => {
  const { ponds, devices, alerts, toggleDevice, getPendingAlertsCount } = useStore();
  const navigate = useNavigate();
  const pendingAlerts = alerts.filter(a => a.status === 'pending');
  const runningDevices = devices.filter(d => d.status === 'running');
  const stoppedDevices = devices.filter(d => d.status === 'stopped');
  const faultDevices = devices.filter(d => d.status === 'fault');

  const avgWaterQuality = {
    temperature: ponds.reduce((sum, p) => sum + p.waterQuality.temperature, 0) / ponds.length,
    dissolvedOxygen: ponds.reduce((sum, p) => sum + p.waterQuality.dissolvedOxygen, 0) / ponds.length,
    ph: ponds.reduce((sum, p) => sum + p.waterQuality.ph, 0) / ponds.length,
    ammoniaNitrogen: ponds.reduce((sum, p) => sum + p.waterQuality.ammoniaNitrogen, 0) / ponds.length
  };

  const trendData = generateWaterQualityHistory('all', 7);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">监控首页</h1>
          <p className="text-gray-500 mt-1">实时掌握养殖状况，科学管理鱼塘</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">最后更新：刚刚</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">塘口总数</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{ponds.length}</p>
              <p className="text-xs text-gray-400 mt-1">总面积 {ponds.reduce((s, p) => s + p.area, 0).toFixed(1)} 亩</p>
            </div>
            <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center">
              <Fish className="w-7 h-7 text-primary-600" />
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">运行设备</p>
              <p className="text-3xl font-bold text-secondary-600 mt-1">{runningDevices.length}</p>
              <p className="text-xs text-gray-400 mt-1">共 {devices.length} 台设备</p>
            </div>
            <div className="w-14 h-14 bg-secondary-100 rounded-xl flex items-center justify-center">
              <Activity className="w-7 h-7 text-secondary-600" />
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">待处理告警</p>
              <p className="text-3xl font-bold text-amber-600 mt-1">{getPendingAlertsCount()}</p>
              <p className="text-xs text-gray-400 mt-1">需要及时处理</p>
            </div>
            <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-7 h-7 text-amber-600" />
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">设备故障</p>
              <p className="text-3xl font-bold text-red-600 mt-1">{faultDevices.length}</p>
              <p className="text-xs text-gray-400 mt-1">需维修处理</p>
            </div>
            <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-7 h-7 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card title="塘口分布">
            <PondMap />
          </Card>
        </div>

        <Card title="实时告警" extra={
          <Button variant="ghost" size="sm" onClick={() => navigate('/alert')}>
            查看全部 <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        }>
          <div className="space-y-3 max-h-72 overflow-y-auto">
            {pendingAlerts.slice(0, 5).map((alert) => (
              <div
                key={alert.id}
                className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => navigate('/alert')}
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                    alert.level === 'danger' ? 'text-red-500' :
                    alert.level === 'warning' ? 'text-amber-500' : 'text-blue-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{alert.pondName}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{alert.message}</p>
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatRelativeTime(alert.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {pendingAlerts.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>暂无待处理告警</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      <Card title="水质概览">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <GaugeChart
            value={avgWaterQuality.temperature}
            min={0}
            max={40}
            label="平均水温"
            unit="°C"
            thresholds={{ warning: 30, danger: 35 }}
          />
          <GaugeChart
            value={avgWaterQuality.dissolvedOxygen}
            min={0}
            max={15}
            label="平均溶氧"
            unit="mg/L"
            thresholds={{ warning: 5, danger: 3 }}
          />
          <GaugeChart
            value={avgWaterQuality.ph}
            min={0}
            max={14}
            label="平均pH值"
            unit="pH"
            thresholds={{ warning: 9, danger: 10 }}
          />
          <GaugeChart
            value={avgWaterQuality.ammoniaNitrogen}
            min={0}
            max={2}
            label="平均氨氮"
            unit="mg/L"
            thresholds={{ warning: 0.6, danger: 1.0 }}
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="水质趋势" extra={
          <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option>近7天</option>
            <option>近30天</option>
          </select>
        }>
          <TrendChart
            data={trendData}
            xKey="date"
            lines={[
              { key: 'temperature', name: '水温(°C)', color: '#F59E0B' },
              { key: 'dissolvedOxygen', name: '溶氧(mg/L)', color: '#0EA5E9' }
            ]}
            height={250}
          />
        </Card>

        <Card title="设备状态" extra={
          <Button variant="ghost" size="sm" onClick={() => navigate('/device')}>
            设备管理 <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        }>
          <div className="space-y-3">
            {devices.slice(0, 5).map((device) => (
              <div
                key={device.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <StatusDot status={device.status} pulse={device.status === 'running'} />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{device.name}</p>
                    <p className="text-xs text-gray-500">
                      {getDeviceTypeName(device.type)} · {device.power}kW · 运行{Math.floor(device.runtime)}h
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge status={device.status} text={getStatusText(device.status)} />
                  {device.type !== 'sensor' && device.status !== 'fault' && (
                    <button
                      onClick={() => toggleDevice(device.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        device.status === 'running'
                          ? 'text-red-600 hover:bg-red-50'
                          : 'text-secondary-600 hover:bg-secondary-50'
                      }`}
                    >
                      {device.status === 'running' ? (
                        <PowerOff className="w-4 h-4" />
                      ) : (
                        <Power className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card title="塘口状态一览">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">塘口名称</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">养殖品种</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">面积</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">水温</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">溶氧</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">pH值</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">状态</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">操作</th>
              </tr>
            </thead>
            <tbody>
              {ponds.map((pond) => (
                <tr key={pond.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <span className="font-medium text-gray-800">{pond.name}</span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{pond.breed}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{pond.area}亩</td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Thermometer className="w-3 h-3 text-orange-500" />
                      {formatNumber(pond.waterQuality.temperature, 1)}°C
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Droplets className="w-3 h-3 text-blue-500" />
                      {formatNumber(pond.waterQuality.dissolvedOxygen, 1)}mg/L
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Wind className="w-3 h-3 text-green-500" />
                      {formatNumber(pond.waterQuality.ph, 1)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Badge status={pond.status} text={getStatusText(pond.status)} />
                  </td>
                  <td className="py-3 px-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/pond?id=${pond.id}`)}
                    >
                      详情
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;

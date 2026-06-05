import { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { StatusDot } from '../../components/ui/StatusDot';
import { useStore } from '../../store/useStore';
import { getStatusText, getDeviceTypeName, formatDate } from '../../utils/format';
import {
  Power,
  PowerOff,
  Settings,
  Clock,
  Zap,
  Wrench,
  Plus,
  Timer,
  Wind,
  Droplets
} from 'lucide-react';

const DeviceControl = () => {
  const { devices, ponds, toggleDevice, feedingSchedules } = useStore();
  const [activeTab, setActiveTab] = useState<'aerator' | 'feeder' | 'sensor'>('aerator');

  const filteredDevices = devices.filter(d => d.type === activeTab);
  const aeratorCount = devices.filter(d => d.type === 'aerator').length;
  const feederCount = devices.filter(d => d.type === 'feeder').length;
  const sensorCount = devices.filter(d => d.type === 'sensor').length;
  const runningCount = devices.filter(d => d.status === 'running').length;

  const getPondName = (pondId: string) => ponds.find(p => p.id === pondId)?.name || '-';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">设备控制</h1>
          <p className="text-gray-500 mt-1">远程控制养殖设备，设置自动化任务</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          添加设备
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Wind className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">增氧机</p>
              <p className="text-2xl font-bold text-gray-800">{aeratorCount}台</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Droplets className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">投饵机</p>
              <p className="text-2xl font-bold text-gray-800">{feederCount}台</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Settings className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">传感器</p>
              <p className="text-2xl font-bold text-gray-800">{sensorCount}台</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-secondary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">运行中</p>
              <p className="text-2xl font-bold text-secondary-600">{runningCount}台</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        {[
          { key: 'aerator', label: `增氧机 (${aeratorCount})` },
          { key: 'feeder', label: `投饵机 (${feederCount})` },
          { key: 'sensor', label: `传感器 (${sensorCount})` }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDevices.map(device => (
          <Card key={device.id}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  device.type === 'aerator' ? 'bg-blue-100' :
                  device.type === 'feeder' ? 'bg-green-100' : 'bg-purple-100'
                }`}>
                  {device.type === 'aerator' && <Wind className="w-6 h-6 text-blue-600" />}
                  {device.type === 'feeder' && <Droplets className="w-6 h-6 text-green-600" />}
                  {device.type === 'sensor' && <Settings className="w-6 h-6 text-purple-600" />}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{device.name}</h3>
                  <p className="text-sm text-gray-500">{getPondName(device.pondId)}</p>
                </div>
              </div>
              <Badge status={device.status} text={getStatusText(device.status)} />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span className="text-sm text-gray-600">功率: {device.power}kW</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-600">运行: {Math.floor(device.runtime)}h</span>
              </div>
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">维保: {formatDate(device.lastMaintenance)}</span>
              </div>
              {device.location && (
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">位置: {device.location}</span>
                </div>
              )}
            </div>

            {device.type !== 'sensor' && (
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <StatusDot status={device.status} pulse={device.status === 'running'} />
                <Button
                  variant={device.status === 'running' ? 'secondary' : 'primary'}
                  size="sm"
                  onClick={() => toggleDevice(device.id)}
                  disabled={device.status === 'fault'}
                >
                  {device.status === 'running' ? (
                    <><PowerOff className="w-4 h-4 mr-1" /> 关闭</>
                  ) : device.status === 'fault' ? (
                    <><Wrench className="w-4 h-4 mr-1" /> 维修中</>
                  ) : (
                    <><Power className="w-4 h-4 mr-1" /> 开启</>
                  )}
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>

      {activeTab === 'feeder' && (
        <Card title="自动投饵计划" extra={
          <Button size="sm">
            <Plus className="w-4 h-4 mr-1" />
            添加计划
          </Button>
        }>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">塘口</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">投喂时间</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">投喂量</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">状态</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">操作</th>
                </tr>
              </thead>
              <tbody>
                {feedingSchedules.map(schedule => {
                  const pond = ponds.find(p => p.id === schedule.pondId);
                  return (
                    <tr key={schedule.id} className="border-b border-gray-100">
                      <td className="py-3 px-4 text-sm text-gray-800 font-medium">{pond?.name}</td>
                      <td className="py-3 px-4 text-sm text-gray-600 flex items-center gap-2">
                        <Timer className="w-4 h-4 text-primary-500" />
                        {schedule.time}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{schedule.amount}kg</td>
                      <td className="py-3 px-4">
                        <Badge status={schedule.enabled ? 'running' : 'stopped'} text={schedule.enabled ? '已启用' : '已停用'} />
                      </td>
                      <td className="py-3 px-4">
                        <Button variant="ghost" size="sm">编辑</Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default DeviceControl;

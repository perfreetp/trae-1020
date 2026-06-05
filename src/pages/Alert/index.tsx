import { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { StatusDot } from '../../components/ui/StatusDot';
import { useStore } from '../../store/useStore';
import { formatRelativeTime, formatDateTime, getStatusText, getAlertLevelColor } from '../../utils/format';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  Settings,
  User,
  MessageSquare,
  X,
  Droplets,
  Settings as SettingsIcon,
  Activity
} from 'lucide-react';
import { ThresholdConfig } from '../../types';

const AlertCenter = () => {
  const { alerts, ponds, thresholds, updateAlertStatus, updateThresholds } = useStore();
  const [activeTab, setActiveTab] = useState<'list' | 'settings'>('list');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null);
  const [handleNote, setHandleNote] = useState('');
  const [localThresholds, setLocalThresholds] = useState<ThresholdConfig>(thresholds);

  const filteredAlerts = alerts.filter(a => {
    if (filterLevel !== 'all' && a.level !== filterLevel) return false;
    if (filterStatus !== 'all' && a.status !== filterStatus) return false;
    return true;
  });

  const pendingCount = alerts.filter(a => a.status === 'pending').length;
  const processingCount = alerts.filter(a => a.status === 'processing').length;
  const resolvedCount = alerts.filter(a => a.status === 'resolved').length;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'water_quality': return <Droplets className="w-4 h-4" />;
      case 'device': return <SettingsIcon className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'water_quality': return '水质告警';
      case 'device': return '设备告警';
      default: return '系统告警';
    }
  };

  const handleProcess = (alertId: string) => {
    updateAlertStatus(alertId, 'processing', '管理员');
    setSelectedAlert(null);
  };

  const handleResolve = (alertId: string) => {
    updateAlertStatus(alertId, 'resolved', '管理员', handleNote);
    setHandleNote('');
    setSelectedAlert(null);
  };

  const saveThresholds = () => {
    updateThresholds(localThresholds);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">预警处理</h1>
          <p className="text-gray-500 mt-1">处理异常告警，设置告警阈值</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-amber-700">待处理</p>
              <p className="text-3xl font-bold text-amber-600 mt-1">{pendingCount}</p>
            </div>
            <div className="w-12 h-12 bg-amber-200 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700">处理中</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">{processingCount}</p>
            </div>
            <div className="w-12 h-12 bg-blue-200 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700">已处理</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{resolvedCount}</p>
            </div>
            <div className="w-12 h-12 bg-green-200 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">告警总数</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{alerts.length}</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </Card>
      </div>

      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('list')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'list'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          告警列表
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'settings'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          阈值设置
        </button>
      </div>

      {activeTab === 'list' && (
        <>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">级别：</span>
              <select
                value={filterLevel}
                onChange={e => setFilterLevel(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">全部</option>
                <option value="info">信息</option>
                <option value="warning">警告</option>
                <option value="danger">严重</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">状态：</span>
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">全部</option>
                <option value="pending">待处理</option>
                <option value="processing">处理中</option>
                <option value="resolved">已处理</option>
              </select>
            </div>
          </div>

          <Card>
            <div className="space-y-3">
              {filteredAlerts.map(alert => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border transition-all ${
                    alert.level === 'danger' ? 'bg-red-50 border-red-200' :
                    alert.level === 'warning' ? 'bg-amber-50 border-amber-200' :
                    'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        alert.level === 'danger' ? 'bg-red-200 text-red-700' :
                        alert.level === 'warning' ? 'bg-amber-200 text-amber-700' :
                        'bg-blue-200 text-blue-700'
                      }`}>
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge status={alert.level} text={
                            alert.level === 'danger' ? '严重' :
                            alert.level === 'warning' ? '警告' : '信息'
                          } />
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            {getTypeIcon(alert.type)}
                            {getTypeName(alert.type)}
                          </span>
                          <StatusDot status={alert.status} />
                          <span className="text-xs text-gray-500">{getStatusText(alert.status)}</span>
                        </div>
                        <h4 className="font-medium text-gray-800 mt-1">{alert.pondName} - {alert.message}</h4>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatRelativeTime(alert.timestamp)}
                        </p>
                        {alert.handler && (
                          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <User className="w-3 h-3" />
                            处理人：{alert.handler}
                            {alert.handleTime && ` · ${formatDateTime(alert.handleTime)}`}
                          </p>
                        )}
                        {alert.handleNote && (
                          <p className="text-xs text-gray-600 mt-1 bg-white/50 rounded px-2 py-1">
                            <MessageSquare className="w-3 h-3 inline mr-1" />
                            {alert.handleNote}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {alert.status === 'pending' && (
                        <>
                          <Button size="sm" variant="secondary" onClick={() => handleProcess(alert.id)}>
                            开始处理
                          </Button>
                          <Button size="sm" onClick={() => setSelectedAlert(alert.id)}>
                            标记解决
                          </Button>
                        </>
                      )}
                      {alert.status === 'processing' && (
                        <Button size="sm" onClick={() => setSelectedAlert(alert.id)}>
                          标记解决
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {filteredAlerts.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>暂无符合条件的告警</p>
                </div>
              )}
            </div>
          </Card>
        </>
      )}

      {activeTab === 'settings' && (
        <Card title="告警阈值设置" extra={
          <Button size="sm" onClick={saveThresholds}>
            <Settings className="w-4 h-4 mr-1" />
            保存设置
          </Button>
        }>
          <div className="space-y-6">
            <p className="text-sm text-gray-500">设置各项水质指标的告警阈值，超出范围将触发告警</p>
            
            {[
              { key: 'temperature', label: '水温', unit: '°C', desc: '鱼类适宜生长温度范围' },
              { key: 'dissolvedOxygen', label: '溶氧', unit: 'mg/L', desc: '水中溶解氧含量，过低会导致鱼类缺氧' },
              { key: 'ph', label: 'pH值', unit: '', desc: '水体酸碱度，影响鱼类生理活动' },
              { key: 'ammoniaNitrogen', label: '氨氮', unit: 'mg/L', desc: '氨氮含量过高会导致鱼类中毒' },
              { key: 'nitrite', label: '亚硝酸盐', unit: 'mg/L', desc: '亚硝酸盐是水质恶化的重要指标' }
            ].map(item => (
              <div key={item.key} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-800">{item.label}</h4>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                  <span className="text-sm text-gray-600">{item.unit}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">最小值</label>
                    <input
                      type="number"
                      step="0.1"
                      value={localThresholds[item.key as keyof ThresholdConfig].min}
                      onChange={e => setLocalThresholds({
                        ...localThresholds,
                        [item.key]: {
                          ...localThresholds[item.key as keyof ThresholdConfig],
                          min: parseFloat(e.target.value)
                        }
                      })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">最大值</label>
                    <input
                      type="number"
                      step="0.1"
                      value={localThresholds[item.key as keyof ThresholdConfig].max}
                      onChange={e => setLocalThresholds({
                        ...localThresholds,
                        [item.key]: {
                          ...localThresholds[item.key as keyof ThresholdConfig],
                          max: parseFloat(e.target.value)
                        }
                      })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {selectedAlert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">处理告警</h3>
              <button onClick={() => setSelectedAlert(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">处理备注</label>
                <textarea
                  value={handleNote}
                  onChange={e => setHandleNote(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={3}
                  placeholder="请输入处理措施和结果..."
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="secondary" className="flex-1" onClick={() => setSelectedAlert(null)}>取消</Button>
                <Button className="flex-1" onClick={() => handleResolve(selectedAlert)}>确认解决</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertCenter;

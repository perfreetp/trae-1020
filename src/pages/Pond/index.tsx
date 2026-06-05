import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { StatusDot } from '../../components/ui/StatusDot';
import { GaugeChart } from '../../components/charts/GaugeChart';
import { TrendChart } from '../../components/charts/TrendChart';
import { useStore } from '../../store/useStore';
import { getStatusText, formatDate, formatNumber } from '../../utils/format';
import { generateWaterQualityHistory } from '../../data/mockData';
import {
  ArrowLeft,
  Thermometer,
  Droplets,
  Wind,
  Activity,
  Fish,
  Calendar,
  FileText,
  Plus,
  Clock,
  User
} from 'lucide-react';

const PondManagement = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedId = searchParams.get('id');
  const { ponds, stockRecords, samplingRecords, diseaseRecords, patrolRecords } = useStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'stock' | 'sampling' | 'disease' | 'patrol'>('overview');

  const selectedPond = ponds.find(p => p.id === selectedId);
  const pondStockRecords = stockRecords.filter(r => r.pondId === selectedId);
  const pondSamplingRecords = samplingRecords.filter(r => r.pondId === selectedId);
  const pondDiseaseRecords = diseaseRecords.filter(r => r.pondId === selectedId);
  const pondPatrolRecords = patrolRecords.filter(r => r.pondId === selectedId);
  const trendData = selectedId ? generateWaterQualityHistory(selectedId, 7) : [];

  if (selectedPond) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => setSearchParams({})}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回列表
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              {selectedPond.name}
              <Badge status={selectedPond.status} text={getStatusText(selectedPond.status)} />
            </h1>
            <p className="text-gray-500 mt-1">{selectedPond.breed} · {selectedPond.area}亩 · 水深{selectedPond.depth}m</p>
          </div>
        </div>

        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
          {[
            { key: 'overview', label: '概览' },
            { key: 'stock', label: '苗种投放' },
            { key: 'sampling', label: '采样检测' },
            { key: 'disease', label: '病害处置' },
            { key: 'patrol', label: '巡塘记录' }
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

        {activeTab === 'overview' && (
          <>
            <Card title="塘口档案">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <p className="text-sm text-gray-500">塘口面积</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{selectedPond.area} <span className="text-sm font-normal">亩</span></p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">平均水深</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{selectedPond.depth} <span className="text-sm font-normal">米</span></p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">养殖品种</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{selectedPond.breed}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">放苗日期</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{formatDate(selectedPond.stockDate)}</p>
                </div>
              </div>
              {selectedPond.notes && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <p className="text-sm text-gray-500">备注</p>
                  <p className="text-gray-700 mt-1">{selectedPond.notes}</p>
                </div>
              )}
            </Card>

            <Card title="实时水质">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <GaugeChart
                  value={selectedPond.waterQuality.temperature}
                  min={0}
                  max={40}
                  label="水温"
                  unit="°C"
                  thresholds={{ warning: 30, danger: 35 }}
                />
                <GaugeChart
                  value={selectedPond.waterQuality.dissolvedOxygen}
                  min={0}
                  max={15}
                  label="溶氧"
                  unit="mg/L"
                  thresholds={{ warning: 5, danger: 3 }}
                />
                <GaugeChart
                  value={selectedPond.waterQuality.ph}
                  min={0}
                  max={14}
                  label="pH值"
                  unit="pH"
                  thresholds={{ warning: 9, danger: 10 }}
                />
                <GaugeChart
                  value={selectedPond.waterQuality.ammoniaNitrogen}
                  min={0}
                  max={2}
                  label="氨氮"
                  unit="mg/L"
                  thresholds={{ warning: 0.6, danger: 1.0 }}
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Activity className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">亚硝酸盐</p>
                    <p className="font-semibold text-gray-800">{formatNumber(selectedPond.waterQuality.nitrite)} mg/L</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                    <Droplets className="w-5 h-5 text-cyan-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">透明度</p>
                    <p className="font-semibold text-gray-800">{selectedPond.waterQuality.transparency} cm</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card title="水质趋势">
              <TrendChart
                data={trendData}
                xKey="date"
                lines={[
                  { key: 'temperature', name: '水温(°C)', color: '#F59E0B' },
                  { key: 'dissolvedOxygen', name: '溶氧(mg/L)', color: '#0EA5E9' },
                  { key: 'ph', name: 'pH值', color: '#10B981' }
                ]}
                height={300}
              />
            </Card>
          </>
        )}

        {activeTab === 'stock' && (
          <Card title="苗种投放记录" extra={
            <Button size="sm">
              <Plus className="w-4 h-4 mr-1" />
              添加记录
            </Button>
          }>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">投放日期</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">品种</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">数量</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">规格</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">操作人</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">备注</th>
                  </tr>
                </thead>
                <tbody>
                  {pondStockRecords.map(record => (
                    <tr key={record.id} className="border-b border-gray-100">
                      <td className="py-3 px-4 text-sm text-gray-800">{formatDate(record.date)}</td>
                      <td className="py-3 px-4 text-sm text-gray-800 font-medium">{record.breed}</td>
                      <td className="py-3 px-4 text-sm text-gray-800">{record.quantity.toLocaleString()}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{record.spec}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{record.operator}</td>
                      <td className="py-3 px-4 text-sm text-gray-500">{record.notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {activeTab === 'sampling' && (
          <Card title="采样检测记录" extra={
            <Button size="sm">
              <Plus className="w-4 h-4 mr-1" />
              添加记录
            </Button>
          }>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">检测日期</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">水温</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">溶氧</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">pH值</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">氨氮</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">亚硝酸盐</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">检测人</th>
                  </tr>
                </thead>
                <tbody>
                  {pondSamplingRecords.map(record => (
                    <tr key={record.id} className="border-b border-gray-100">
                      <td className="py-3 px-4 text-sm text-gray-800">{formatDate(record.date)}</td>
                      <td className="py-3 px-4 text-sm text-gray-800">{record.temperature}°C</td>
                      <td className="py-3 px-4 text-sm text-gray-800">{record.dissolvedOxygen}mg/L</td>
                      <td className="py-3 px-4 text-sm text-gray-800">{record.ph}</td>
                      <td className="py-3 px-4 text-sm text-gray-800">{record.ammoniaNitrogen}mg/L</td>
                      <td className="py-3 px-4 text-sm text-gray-800">{record.nitrite}mg/L</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{record.sampler}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {activeTab === 'disease' && (
          <Card title="病害处置记录" extra={
            <Button size="sm">
              <Plus className="w-4 h-4 mr-1" />
              添加记录
            </Button>
          }>
            <div className="space-y-4">
              {pondDiseaseRecords.map(record => (
                <div key={record.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold text-gray-800">{record.diseaseName}</h4>
                        <Badge status={record.status} text={getStatusText(record.status)} />
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{formatDate(record.date)} · {record.operator}</p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">症状</p>
                      <p className="text-sm text-gray-700 mt-1">{record.symptoms}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">诊断</p>
                      <p className="text-sm text-gray-700 mt-1">{record.diagnosis}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">治疗方案</p>
                      <p className="text-sm text-gray-700 mt-1">{record.treatment}</p>
                    </div>
                  </div>
                  {record.notes && (
                    <div className="mt-3">
                      <p className="text-xs text-gray-500">备注</p>
                      <p className="text-sm text-gray-600 mt-1">{record.notes}</p>
                    </div>
                  )}
                </div>
              ))}
              {pondDiseaseRecords.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>暂无病害记录</p>
                </div>
              )}
            </div>
          </Card>
        )}

        {activeTab === 'patrol' && (
          <Card title="巡塘记录" extra={
            <Button size="sm">
              <Plus className="w-4 h-4 mr-1" />
              添加记录
            </Button>
          }>
            <div className="space-y-4">
              {pondPatrolRecords.map(record => (
                <div key={record.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{record.patrolman}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {record.date} · {record.weather}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">观察情况</p>
                      <p className="text-sm text-gray-700 mt-1">{record.observations}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">异常发现</p>
                      <p className="text-sm text-gray-700 mt-1">{record.abnormalities}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">处理措施</p>
                      <p className="text-sm text-gray-700 mt-1">{record.measures}</p>
                    </div>
                  </div>
                </div>
              ))}
              {pondPatrolRecords.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>暂无巡塘记录</p>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">塘口管理</h1>
          <p className="text-gray-500 mt-1">管理所有塘口档案和生产记录</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          新增塘口
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ponds.map((pond) => (
          <Card
            key={pond.id}
            className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1"
            onClick={() => setSearchParams({ id: pond.id })}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Fish className="w-5 h-5 text-primary-600" />
                  {pond.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{pond.breed}</p>
              </div>
              <Badge status={pond.status} text={getStatusText(pond.status)} />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-orange-500" />
                <span className="text-sm text-gray-600">{formatNumber(pond.waterQuality.temperature, 1)}°C</span>
              </div>
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-600">{formatNumber(pond.waterQuality.dissolvedOxygen, 1)}mg/L</span>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-600">pH {formatNumber(pond.waterQuality.ph, 1)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-500" />
                <span className="text-sm text-gray-600">{pond.area}亩</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <StatusDot status={pond.status} />
                <span className="text-xs text-gray-500">更新于 刚刚</span>
              </div>
              <Button variant="ghost" size="sm">
                查看详情
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PondManagement;

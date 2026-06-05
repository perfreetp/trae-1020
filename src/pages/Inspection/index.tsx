import { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useStore } from '../../store/useStore';
import { formatDate, getStatusText } from '../../utils/format';
import {
  Plus,
  ClipboardList,
  Droplets,
  FileText,
  User,
  Clock,
  Cloud,
  Camera
} from 'lucide-react';

const Inspection = () => {
  const { ponds, patrolRecords, samplingRecords, addPatrolRecord, addSamplingRecord } = useStore();
  const [activeTab, setActiveTab] = useState<'patrol' | 'sampling'>('patrol');
  const [showPatrolForm, setShowPatrolForm] = useState(false);
  const [showSamplingForm, setShowSamplingForm] = useState(false);

  const [patrolForm, setPatrolForm] = useState({
    pondId: ponds[0]?.id || '',
    weather: '晴',
    observations: '',
    abnormalities: '',
    measures: '',
    patrolman: '王师傅'
  });

  const [samplingForm, setSamplingForm] = useState({
    pondId: ponds[0]?.id || '',
    temperature: 25,
    dissolvedOxygen: 6,
    ph: 7.5,
    ammoniaNitrogen: 0.3,
    nitrite: 0.08,
    transparency: 30,
    sampler: '张技术员'
  });

  const handleSubmitPatrol = () => {
    addPatrolRecord({
      ...patrolForm,
      date: new Date().toISOString().slice(0, 16).replace('T', ' ')
    });
    setShowPatrolForm(false);
    setPatrolForm({ ...patrolForm, observations: '', abnormalities: '', measures: '' });
  };

  const handleSubmitSampling = () => {
    addSamplingRecord({
      ...samplingForm,
      date: new Date().toISOString().slice(0, 10)
    });
    setShowSamplingForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">巡检填报</h1>
          <p className="text-gray-500 mt-1">记录巡塘情况和水质采样数据</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setShowSamplingForm(true)}>
            <Droplets className="w-4 h-4 mr-2" />
            采样记录
          </Button>
          <Button variant="secondary" onClick={() => setShowPatrolForm(true)}>
            <ClipboardList className="w-4 h-4 mr-2" />
            巡塘记录
          </Button>
        </div>
      </div>

      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        {[
          { key: 'patrol', label: '巡塘记录' },
          { key: 'sampling', label: '采样检测' }
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

      {activeTab === 'patrol' && (
        <Card title="巡塘记录">
          <div className="space-y-4">
            {patrolRecords.map(record => {
              const pond = ponds.find(p => p.id === record.pondId);
              return (
                <div key={record.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{record.patrolman}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-3">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{record.date}</span>
                          <span className="flex items-center gap-1"><Cloud className="w-3 h-3" />{record.weather}</span>
                          <span className="text-primary-600 font-medium">{pond?.name}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">观察情况</p>
                      <p className="text-sm text-gray-700">{record.observations}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">异常发现</p>
                      <p className="text-sm text-gray-700">{record.abnormalities}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">处理措施</p>
                      <p className="text-sm text-gray-700">{record.measures}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {activeTab === 'sampling' && (
        <Card title="采样检测记录">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">塘口</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">日期</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">水温</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">溶氧</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">pH值</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">氨氮</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">亚硝酸盐</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">检测人</th>
                </tr>
              </thead>
              <tbody>
                {samplingRecords.map(record => {
                  const pond = ponds.find(p => p.id === record.pondId);
                  return (
                    <tr key={record.id} className="border-b border-gray-100">
                      <td className="py-3 px-4 text-sm font-medium text-gray-800">{pond?.name}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{formatDate(record.date)}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{record.temperature}°C</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{record.dissolvedOxygen}mg/L</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{record.ph}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{record.ammoniaNitrogen}mg/L</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{record.nitrite}mg/L</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{record.sampler}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {showPatrolForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-lg mx-4 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">添加巡塘记录</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">选择塘口</label>
                <select
                  value={patrolForm.pondId}
                  onChange={e => setPatrolForm({ ...patrolForm, pondId: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {ponds.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">天气</label>
                <select
                  value={patrolForm.weather}
                  onChange={e => setPatrolForm({ ...patrolForm, weather: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="晴">晴</option>
                  <option value="多云">多云</option>
                  <option value="阴">阴</option>
                  <option value="小雨">小雨</option>
                  <option value="大雨">大雨</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">观察情况</label>
                <textarea
                  value={patrolForm.observations}
                  onChange={e => setPatrolForm({ ...patrolForm, observations: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={2}
                  placeholder="记录鱼群活动、水色等情况"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">异常发现</label>
                <textarea
                  value={patrolForm.abnormalities}
                  onChange={e => setPatrolForm({ ...patrolForm, abnormalities: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={2}
                  placeholder="记录发现的异常情况"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">处理措施</label>
                <textarea
                  value={patrolForm.measures}
                  onChange={e => setPatrolForm({ ...patrolForm, measures: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={2}
                  placeholder="采取的处理措施"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="secondary" className="flex-1" onClick={() => setShowPatrolForm(false)}>取消</Button>
                <Button className="flex-1" onClick={handleSubmitPatrol}>提交</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSamplingForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">添加采样记录</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">选择塘口</label>
                <select
                  value={samplingForm.pondId}
                  onChange={e => setSamplingForm({ ...samplingForm, pondId: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {ponds.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">水温 (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={samplingForm.temperature}
                    onChange={e => setSamplingForm({ ...samplingForm, temperature: parseFloat(e.target.value) })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">溶氧 (mg/L)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={samplingForm.dissolvedOxygen}
                    onChange={e => setSamplingForm({ ...samplingForm, dissolvedOxygen: parseFloat(e.target.value) })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">pH值</label>
                  <input
                    type="number"
                    step="0.1"
                    value={samplingForm.ph}
                    onChange={e => setSamplingForm({ ...samplingForm, ph: parseFloat(e.target.value) })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">氨氮 (mg/L)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={samplingForm.ammoniaNitrogen}
                    onChange={e => setSamplingForm({ ...samplingForm, ammoniaNitrogen: parseFloat(e.target.value) })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">亚硝酸盐 (mg/L)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={samplingForm.nitrite}
                    onChange={e => setSamplingForm({ ...samplingForm, nitrite: parseFloat(e.target.value) })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">透明度 (cm)</label>
                  <input
                    type="number"
                    value={samplingForm.transparency}
                    onChange={e => setSamplingForm({ ...samplingForm, transparency: parseInt(e.target.value) })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="secondary" className="flex-1" onClick={() => setShowSamplingForm(false)}>取消</Button>
                <Button className="flex-1" onClick={handleSubmitSampling}>提交</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inspection;

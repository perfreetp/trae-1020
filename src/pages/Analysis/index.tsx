import { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useStore } from '../../store/useStore';
import { formatCurrency, formatDate, getStatusText } from '../../utils/format';
import { TrendChart } from '../../components/charts/TrendChart';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  ShoppingCart,
  Fish,
  Calendar,
  User
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const Analysis = () => {
  const { ponds, orders, costRecords, revenueRecords, yieldForecasts, workers, workRecords } = useStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'cost' | 'order' | 'worker'>('overview');

  const totalCost = costRecords.reduce((sum, c) => sum + c.amount, 0);
  const totalRevenue = revenueRecords.reduce((sum, r) => sum + r.amount, 0);
  const totalOrders = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const profit = totalRevenue - totalCost;
  const profitRate = totalRevenue > 0 ? ((profit / totalRevenue) * 100).toFixed(1) : 0;

  const costByCategory = costRecords.reduce((acc, c) => {
    acc[c.category] = (acc[c.category] || 0) + c.amount;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(costByCategory).map(([name, value]) => ({ name, value }));
  const COLORS = ['#0EA5E9', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  const monthlyData = [
    { month: '1月', 收入: 45000, 支出: 32000 },
    { month: '2月', 收入: 52000, 支出: 38000 },
    { month: '3月', 收入: 48000, 支出: 42000 },
    { month: '4月', 收入: 65000, 支出: 45000 },
    { month: '5月', 收入: 78000, 支出: 52000 },
    { month: '6月', 收入: totalRevenue, 支出: totalCost }
  ];

  const yieldData = yieldForecasts.map(yf => {
    const pond = ponds.find(p => p.id === yf.pondId);
    return {
      name: pond?.name || '',
      预估产量: yf.estimatedYield,
      置信度: yf.confidence
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">经营分析</h1>
          <p className="text-gray-500 mt-1">产量预估、成本收益和订单管理</p>
        </div>
        <div className="flex gap-2">
          <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option>本年度</option>
            <option>上年度</option>
          </select>
          <Button variant="secondary">
            <Calendar className="w-4 h-4 mr-2" />
            导出报表
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">总收入</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{formatCurrency(totalRevenue)}</p>
              <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +12.5% 同比
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">总支出</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{formatCurrency(totalCost)}</p>
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <TrendingDown className="w-3 h-3" /> +8.3% 同比
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">净利润</p>
              <p className={`text-2xl font-bold mt-1 ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(profit)}
              </p>
              <p className="text-xs text-gray-500 mt-1">利润率 {profitRate}%</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">预估总产量</p>
              <p className="text-2xl font-bold text-primary-600 mt-1">
                {yieldForecasts.reduce((s, y) => s + y.estimatedYield, 0).toLocaleString()} 斤
              </p>
              <p className="text-xs text-gray-500 mt-1">
                预计产值 {formatCurrency(yieldForecasts.reduce((s, y) => s + y.estimatedYield * 10, 0))}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <Fish className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </Card>
      </div>

      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        {[
          { key: 'overview', label: '经营概览' },
          { key: 'cost', label: '成本收益' },
          { key: 'order', label: '客户订单' },
          { key: 'worker', label: '用工登记' }
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="收支趋势">
            <TrendChart
              data={monthlyData}
              xKey="month"
              lines={[
                { key: '收入', name: '收入', color: '#10B981' },
                { key: '支出', name: '支出', color: '#EF4444' }
              ]}
              height={300}
            />
          </Card>

          <Card title="成本构成">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          <Card title="产量预估" className="lg:col-span-2">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={yieldData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6B7280' }} />
                <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="预估产量" name="预估产量(斤)" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
                <Bar dataKey="置信度" name="置信度(%)" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {activeTab === 'cost' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="支出记录">
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {costRecords.map(record => (
                <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{record.description}</p>
                    <p className="text-xs text-gray-500">{record.category} · {formatDate(record.date)}</p>
                  </div>
                  <p className="font-semibold text-red-600">-{formatCurrency(record.amount)}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card title="收入记录">
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {revenueRecords.map(record => (
                <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{record.description}</p>
                    <p className="text-xs text-gray-500">{record.category} · {formatDate(record.date)}</p>
                  </div>
                  <p className="font-semibold text-green-600">+{formatCurrency(record.amount)}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'order' && (
        <Card title="客户订单">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">订单号</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">客户</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">产品</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">数量</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">金额</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">状态</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">下单时间</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-primary-600">{order.orderNo}</td>
                    <td className="py-3 px-4 text-sm text-gray-800">{order.customerName}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{order.product}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{order.quantity}{order.unit}</td>
                    <td className="py-3 px-4 text-sm font-semibold text-gray-800">{formatCurrency(order.totalAmount)}</td>
                    <td className="py-3 px-4">
                      <Badge status={order.status} text={getStatusText(order.status)} />
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">{formatDate(order.createTime)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'worker' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card title="人员信息" className="lg:col-span-1">
            <div className="space-y-3">
              {workers.map(worker => (
                <div key={worker.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{worker.name}</p>
                    <p className="text-xs text-gray-500">{worker.position} · {worker.phone}</p>
                  </div>
                  <p className="text-sm font-semibold text-primary-600">¥{worker.dailyWage}/天</p>
                </div>
              ))}
            </div>
          </Card>

          <Card title="用工记录" className="lg:col-span-2">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">日期</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">人员</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">工种</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">工时</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">塘口</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">费用</th>
                  </tr>
                </thead>
                <tbody>
                  {workRecords.map(record => {
                    const worker = workers.find(w => w.id === record.workerId);
                    const pond = ponds.find(p => p.id === record.pondId);
                    const cost = worker ? (worker.dailyWage / 8) * record.hours : 0;
                    return (
                      <tr key={record.id} className="border-b border-gray-100">
                        <td className="py-3 px-4 text-sm text-gray-600">{formatDate(record.date)}</td>
                        <td className="py-3 px-4 text-sm font-medium text-gray-800">{worker?.name}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{record.workType}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{record.hours}小时</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{pond?.name || '-'}</td>
                        <td className="py-3 px-4 text-sm font-semibold text-gray-800">{formatCurrency(cost)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Analysis;

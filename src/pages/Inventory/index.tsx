import { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useStore } from '../../store/useStore';
import { formatDate } from '../../utils/format';
import {
  Package,
  Pill,
  Plus,
  AlertTriangle,
  TrendingDown,
  Calendar,
  FileText
} from 'lucide-react';

const InventoryManagement = () => {
  const { feedInventories, medicineInventories } = useStore();
  const [activeTab, setActiveTab] = useState<'feed' | 'medicine'>('feed');

  const lowStockFeed = feedInventories.filter(f => f.quantity <= f.minStock);
  const lowStockMedicine = medicineInventories.filter(m => m.quantity <= m.minStock);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">投入品管理</h1>
          <p className="text-gray-500 mt-1">管理饵料、药品等养殖投入品库存</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          入库登记
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">饵料种类</p>
              <p className="text-2xl font-bold text-gray-800">{feedInventories.length}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Pill className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">药品种类</p>
              <p className="text-2xl font-bold text-gray-800">{medicineInventories.length}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">库存预警</p>
              <p className="text-2xl font-bold text-red-600">{lowStockFeed.length + lowStockMedicine.length}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">本月消耗</p>
              <p className="text-2xl font-bold text-gray-800">¥8,560</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        {[
          { key: 'feed', label: '饵料库存' },
          { key: 'medicine', label: '药品管理' }
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

      {activeTab === 'feed' && (
        <Card title="饵料库存">
          {(lowStockFeed.length > 0) && (
            <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center gap-2 text-amber-700">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-medium">以下饵料库存不足，请及时采购：</span>
              </div>
              <p className="text-sm text-amber-600 mt-1">
                {lowStockFeed.map(f => f.name).join('、')}
              </p>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">饵料名称</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">品牌</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">规格</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">库存</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">最低库存</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">供应商</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">有效期至</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">状态</th>
                </tr>
              </thead>
              <tbody>
                {feedInventories.map(item => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-gray-800">{item.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{item.brand}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{item.spec}</td>
                    <td className="py-3 px-4 text-sm text-gray-800 font-medium">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">{item.minStock} {item.unit}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{item.supplier}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{formatDate(item.expiryDate)}</td>
                    <td className="py-3 px-4">
                      {item.quantity <= item.minStock ? (
                        <Badge status="warning" text="库存不足" />
                      ) : (
                        <Badge status="normal" text="充足" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'medicine' && (
        <Card title="药品管理">
          {(lowStockMedicine.length > 0) && (
            <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center gap-2 text-amber-700">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-medium">以下药品库存不足，请及时采购：</span>
              </div>
              <p className="text-sm text-amber-600 mt-1">
                {lowStockMedicine.map(m => m.name).join('、')}
              </p>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">药品名称</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">分类</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">规格</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">库存</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">最低库存</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">生产厂家</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">有效期至</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">状态</th>
                </tr>
              </thead>
              <tbody>
                {medicineInventories.map(item => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-gray-800">{item.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{item.category}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{item.spec}</td>
                    <td className="py-3 px-4 text-sm text-gray-800 font-medium">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">{item.minStock} {item.unit}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{item.manufacturer}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{formatDate(item.expiryDate)}</td>
                    <td className="py-3 px-4">
                      {item.quantity <= item.minStock ? (
                        <Badge status="warning" text="库存不足" />
                      ) : (
                        <Badge status="normal" text="充足" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default InventoryManagement;

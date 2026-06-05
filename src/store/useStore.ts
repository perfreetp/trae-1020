import { create } from 'zustand';
import {
  Pond,
  Device,
  Alert,
  StockRecord,
  SamplingRecord,
  DiseaseRecord,
  PatrolRecord,
  FeedingSchedule,
  FeedInventory,
  MedicineInventory,
  Worker,
  WorkRecord,
  Order,
  CostRecord,
  RevenueRecord,
  YieldForecast,
  ThresholdConfig,
  OperationLog,
  SearchResult
} from '../types';
import {
  ponds as initialPonds,
  devices as initialDevices,
  alerts as initialAlerts,
  stockRecords as initialStockRecords,
  samplingRecords as initialSamplingRecords,
  diseaseRecords as initialDiseaseRecords,
  patrolRecords as initialPatrolRecords,
  feedingSchedules as initialFeedingSchedules,
  feedInventories as initialFeedInventories,
  medicineInventories as initialMedicineInventories,
  workers as initialWorkers,
  workRecords as initialWorkRecords,
  orders as initialOrders,
  costRecords as initialCostRecords,
  revenueRecords as initialRevenueRecords,
  yieldForecasts as initialYieldForecasts,
  defaultThresholds
} from '../data/mockData';

interface AppState {
  ponds: Pond[];
  devices: Device[];
  alerts: Alert[];
  stockRecords: StockRecord[];
  samplingRecords: SamplingRecord[];
  diseaseRecords: DiseaseRecord[];
  patrolRecords: PatrolRecord[];
  feedingSchedules: FeedingSchedule[];
  feedInventories: FeedInventory[];
  medicineInventories: MedicineInventory[];
  workers: Worker[];
  workRecords: WorkRecord[];
  orders: Order[];
  costRecords: CostRecord[];
  revenueRecords: RevenueRecord[];
  yieldForecasts: YieldForecast[];
  thresholds: ThresholdConfig;
  operationLogs: OperationLog[];
  selectedPondId: string | null;
  sidebarCollapsed: boolean;
  currentPage: string;
  searchKeyword: string;
  searchResults: SearchResult[];
  showSearchResults: boolean;
  
  setSelectedPondId: (id: string | null) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setCurrentPage: (page: string) => void;
  setSearchKeyword: (keyword: string) => void;
  setShowSearchResults: (show: boolean) => void;
  performSearch: (keyword: string) => void;
  toggleDevice: (deviceId: string, operator?: string) => void;
  updateAlertStatus: (alertId: string, status: Alert['status'], handler?: string, note?: string) => void;
  addPatrolRecord: (record: Omit<PatrolRecord, 'id'>) => void;
  addSamplingRecord: (record: Omit<SamplingRecord, 'id'>) => void;
  updateThresholds: (thresholds: ThresholdConfig) => void;
  addOperationLog: (log: Omit<OperationLog, 'id' | 'timestamp'>) => void;
  getPondById: (id: string) => Pond | undefined;
  getDevicesByPondId: (pondId: string) => Device[];
  getAlertsByPondId: (pondId: string) => Alert[];
  getPendingAlertsCount: () => number;
}

const initialOperationLogs: OperationLog[] = [
  { id: 'log-1', type: 'device', action: '开启', target: '1号增氧机', operator: '管理员', timestamp: new Date(Date.now() - 3600000).toISOString(), pondId: 'pond-1', pondName: '1号塘' },
  { id: 'log-2', type: 'alert', action: '标记解决', target: '水温升高告警', operator: '李场长', timestamp: new Date(Date.now() - 4 * 3600000).toISOString(), details: '已调整投喂计划', pondId: 'pond-1', pondName: '1号塘' },
  { id: 'log-3', type: 'device', action: '关闭', target: '2号增氧机', operator: '管理员', timestamp: new Date(Date.now() - 6 * 3600000).toISOString(), pondId: 'pond-1', pondName: '1号塘' },
  { id: 'log-4', type: 'alert', action: '开始处理', target: '氨氮偏高告警', operator: '张技术员', timestamp: new Date(Date.now() - 8 * 3600000).toISOString(), pondId: 'pond-2', pondName: '2号塘' },
  { id: 'log-5', type: 'patrol', action: '新增巡塘记录', target: '3号塘', operator: '王师傅', timestamp: new Date(Date.now() - 12 * 3600000).toISOString(), pondId: 'pond-3', pondName: '3号塘' },
];

export const useStore = create<AppState>((set, get) => ({
  ponds: initialPonds,
  devices: initialDevices,
  alerts: initialAlerts,
  stockRecords: initialStockRecords,
  samplingRecords: initialSamplingRecords,
  diseaseRecords: initialDiseaseRecords,
  patrolRecords: initialPatrolRecords,
  feedingSchedules: initialFeedingSchedules,
  feedInventories: initialFeedInventories,
  medicineInventories: initialMedicineInventories,
  workers: initialWorkers,
  workRecords: initialWorkRecords,
  orders: initialOrders,
  costRecords: initialCostRecords,
  revenueRecords: initialRevenueRecords,
  yieldForecasts: initialYieldForecasts,
  thresholds: defaultThresholds,
  operationLogs: initialOperationLogs,
  selectedPondId: null,
  sidebarCollapsed: false,
  currentPage: '/',
  searchKeyword: '',
  searchResults: [],
  showSearchResults: false,

  setSelectedPondId: (id) => set({ selectedPondId: id }),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setSearchKeyword: (keyword) => set({ searchKeyword: keyword }),
  setShowSearchResults: (show) => set({ showSearchResults: show }),

  performSearch: (keyword) => {
    if (!keyword.trim()) {
      set({ searchResults: [], showSearchResults: false });
      return;
    }

    const lowerKeyword = keyword.toLowerCase();
    const results: SearchResult[] = [];

    get().ponds.forEach(pond => {
      if (pond.name.toLowerCase().includes(lowerKeyword) || pond.breed.toLowerCase().includes(lowerKeyword)) {
        results.push({
          type: 'pond',
          id: pond.id,
          title: pond.name,
          description: `${pond.breed} · ${pond.area}亩`,
          pondId: pond.id,
          pondName: pond.name
        });
      }
    });

    get().devices.forEach(device => {
      const pond = get().getPondById(device.pondId);
      if (device.name.toLowerCase().includes(lowerKeyword)) {
        results.push({
          type: 'device',
          id: device.id,
          title: device.name,
          description: `${device.type === 'aerator' ? '增氧机' : device.type === 'feeder' ? '投饵机' : '传感器'} · ${pond?.name || ''}`,
          pondId: device.pondId,
          pondName: pond?.name
        });
      }
    });

    get().alerts.forEach(alert => {
      if (alert.message.toLowerCase().includes(lowerKeyword) || (alert.pondName && alert.pondName.toLowerCase().includes(lowerKeyword))) {
        results.push({
          type: 'alert',
          id: alert.id,
          title: alert.message,
          description: `${alert.pondName} · ${alert.level === 'danger' ? '危险' : alert.level === 'warning' ? '警告' : '信息'}`,
          pondId: alert.pondId,
          pondName: alert.pondName
        });
      }
    });

    set({ searchResults: results, showSearchResults: true });
  },

  addOperationLog: (log) => set((state) => ({
    operationLogs: [
      { ...log, id: `log-${Date.now()}`, timestamp: new Date().toISOString() },
      ...state.operationLogs
    ]
  })),

  toggleDevice: (deviceId, operator = '管理员') => set((state) => {
    const device = state.devices.find(d => d.id === deviceId);
    const pond = state.ponds.find(p => p.id === device?.pondId);
    const newStatus = device?.status === 'running' ? 'stopped' : 'running';
    
    if (device) {
      state.addOperationLog({
        type: 'device',
        action: newStatus === 'running' ? '开启' : '关闭',
        target: device.name,
        operator,
        pondId: device.pondId,
        pondName: pond?.name
      });
    }

    return {
      devices: state.devices.map(d =>
        d.id === deviceId
          ? { ...d, status: newStatus }
          : d
      )
    };
  }),

  updateAlertStatus: (alertId, status, handler = '管理员', note) => set((state) => {
    const alert = state.alerts.find(a => a.id === alertId);
    
    if (alert) {
      const actionText = status === 'processing' ? '开始处理' : status === 'resolved' ? '标记解决' : '更新状态';
      state.addOperationLog({
        type: 'alert',
        action: actionText,
        target: alert.message,
        operator: handler,
        details: note,
        pondId: alert.pondId,
        pondName: alert.pondName
      });
    }

    return {
      alerts: state.alerts.map(a =>
        a.id === alertId
          ? {
              ...a,
              status,
              handler: handler || a.handler,
              handleTime: new Date().toISOString(),
              handleNote: note || a.handleNote
            }
          : a
      )
    };
  }),

  addPatrolRecord: (record) => set((state) => {
    const pond = state.ponds.find(p => p.id === record.pondId);
    state.addOperationLog({
      type: 'patrol',
      action: '新增巡塘记录',
      target: pond?.name || '未知塘口',
      operator: record.patrolman,
      pondId: record.pondId,
      pondName: pond?.name
    });

    return {
      patrolRecords: [
        { ...record, id: `patrol-${Date.now()}` },
        ...state.patrolRecords
      ]
    };
  }),

  addSamplingRecord: (record) => set((state) => {
    const pond = state.ponds.find(p => p.id === record.pondId);
    state.addOperationLog({
      type: 'patrol',
      action: '新增采样记录',
      target: pond?.name || '未知塘口',
      operator: record.sampler,
      pondId: record.pondId,
      pondName: pond?.name
    });

    return {
      samplingRecords: [
        { ...record, id: `sample-${Date.now()}` },
        ...state.samplingRecords
      ]
    };
  }),

  updateThresholds: (thresholds) => set({ thresholds }),

  getPondById: (id) => get().ponds.find(p => p.id === id),
  getDevicesByPondId: (pondId) => get().devices.filter(d => d.pondId === pondId),
  getAlertsByPondId: (pondId) => get().alerts.filter(a => a.pondId === pondId),
  getPendingAlertsCount: () => get().alerts.filter(a => a.status === 'pending').length
}));

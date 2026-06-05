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
  ThresholdConfig
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
  selectedPondId: string | null;
  sidebarCollapsed: boolean;
  currentPage: string;
  
  setSelectedPondId: (id: string | null) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setCurrentPage: (page: string) => void;
  toggleDevice: (deviceId: string) => void;
  updateAlertStatus: (alertId: string, status: Alert['status'], handler?: string, note?: string) => void;
  addPatrolRecord: (record: Omit<PatrolRecord, 'id'>) => void;
  addSamplingRecord: (record: Omit<SamplingRecord, 'id'>) => void;
  updateThresholds: (thresholds: ThresholdConfig) => void;
  getPondById: (id: string) => Pond | undefined;
  getDevicesByPondId: (pondId: string) => Device[];
  getAlertsByPondId: (pondId: string) => Alert[];
  getPendingAlertsCount: () => number;
}

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
  selectedPondId: null,
  sidebarCollapsed: false,
  currentPage: '/',

  setSelectedPondId: (id) => set({ selectedPondId: id }),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setCurrentPage: (page) => set({ currentPage: page }),

  toggleDevice: (deviceId) => set((state) => ({
    devices: state.devices.map(d =>
      d.id === deviceId
        ? { ...d, status: d.status === 'running' ? 'stopped' : 'running' }
        : d
    )
  })),

  updateAlertStatus: (alertId, status, handler, note) => set((state) => ({
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
  })),

  addPatrolRecord: (record) => set((state) => ({
    patrolRecords: [
      { ...record, id: `patrol-${Date.now()}` },
      ...state.patrolRecords
    ]
  })),

  addSamplingRecord: (record) => set((state) => ({
    samplingRecords: [
      { ...record, id: `sample-${Date.now()}` },
      ...state.samplingRecords
    ]
  })),

  updateThresholds: (thresholds) => set({ thresholds }),

  getPondById: (id) => get().ponds.find(p => p.id === id),
  getDevicesByPondId: (pondId) => get().devices.filter(d => d.pondId === pondId),
  getAlertsByPondId: (pondId) => get().alerts.filter(a => a.pondId === pondId),
  getPendingAlertsCount: () => get().alerts.filter(a => a.status === 'pending').length
}));

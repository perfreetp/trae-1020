export interface Pond {
  id: string;
  name: string;
  area: number;
  depth: number;
  breed: string;
  stockDate: string;
  location: {
    lat: number;
    lng: number;
  };
  status: 'normal' | 'warning' | 'danger';
  waterQuality: WaterQuality;
  notes?: string;
}

export interface WaterQuality {
  pondId: string;
  timestamp: string;
  temperature: number;
  dissolvedOxygen: number;
  ph: number;
  ammoniaNitrogen: number;
  nitrite: number;
  transparency: number;
}

export interface Device {
  id: string;
  pondId: string;
  name: string;
  type: 'aerator' | 'feeder' | 'sensor';
  status: 'running' | 'stopped' | 'fault';
  power: number;
  runtime: number;
  lastMaintenance: string;
  location?: string;
}

export interface Alert {
  id: string;
  pondId: string;
  pondName?: string;
  type: 'water_quality' | 'device' | 'system';
  level: 'info' | 'warning' | 'danger';
  message: string;
  timestamp: string;
  status: 'pending' | 'processing' | 'resolved';
  handler?: string;
  handleTime?: string;
  handleNote?: string;
}

export interface StockRecord {
  id: string;
  pondId: string;
  breed: string;
  quantity: number;
  spec: string;
  date: string;
  operator: string;
  notes?: string;
}

export interface SamplingRecord {
  id: string;
  pondId: string;
  date: string;
  temperature: number;
  dissolvedOxygen: number;
  ph: number;
  ammoniaNitrogen: number;
  nitrite: number;
  transparency: number;
  sampler: string;
  notes?: string;
}

export interface DiseaseRecord {
  id: string;
  pondId: string;
  date: string;
  diseaseName: string;
  symptoms: string;
  diagnosis: string;
  treatment: string;
  operator: string;
  status: 'active' | 'recovering' | 'resolved';
  notes?: string;
}

export interface PatrolRecord {
  id: string;
  pondId: string;
  date: string;
  weather: string;
  observations: string;
  abnormalities: string;
  measures: string;
  patrolman: string;
  images?: string[];
}

export interface FeedingSchedule {
  id: string;
  pondId: string;
  deviceId: string;
  time: string;
  amount: number;
  enabled: boolean;
}

export interface FeedInventory {
  id: string;
  name: string;
  brand: string;
  spec: string;
  quantity: number;
  unit: string;
  minStock: number;
  supplier: string;
  purchaseDate: string;
  expiryDate: string;
}

export interface MedicineInventory {
  id: string;
  name: string;
  category: string;
  spec: string;
  quantity: number;
  unit: string;
  minStock: number;
  manufacturer: string;
  purchaseDate: string;
  expiryDate: string;
}

export interface Worker {
  id: string;
  name: string;
  position: string;
  phone: string;
  dailyWage: number;
}

export interface WorkRecord {
  id: string;
  workerId: string;
  date: string;
  workType: string;
  hours: number;
  pondId?: string;
  notes?: string;
}

export interface Order {
  id: string;
  orderNo: string;
  customerName: string;
  product: string;
  quantity: number;
  unit: string;
  price: number;
  totalAmount: number;
  status: 'pending' | 'shipped' | 'completed' | 'cancelled';
  createTime: string;
  deliveryTime?: string;
  address: string;
  phone: string;
}

export interface CostRecord {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  pondId?: string;
}

export interface RevenueRecord {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  pondId?: string;
}

export interface YieldForecast {
  pondId: string;
  breed: string;
  estimatedYield: number;
  actualYield?: number;
  confidence: number;
  forecastDate: string;
  harvestDate: string;
}

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'owner' | 'technician';
  phone: string;
  avatar?: string;
}

export interface ThresholdConfig {
  temperature: { min: number; max: number };
  dissolvedOxygen: { min: number; max: number };
  ph: { min: number; max: number };
  ammoniaNitrogen: { min: number; max: number };
  nitrite: { min: number; max: number };
}

export interface OperationLog {
  id: string;
  type: 'device' | 'alert' | 'system' | 'inventory' | 'patrol';
  action: string;
  target: string;
  operator: string;
  timestamp: string;
  details?: string;
  pondId?: string;
  pondName?: string;
}

export interface SearchResult {
  type: 'pond' | 'device' | 'alert';
  id: string;
  title: string;
  description: string;
  pondId?: string;
  pondName?: string;
}

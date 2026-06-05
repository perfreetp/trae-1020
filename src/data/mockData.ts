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

const now = new Date();
const formatDate = (d: Date) => d.toISOString().split('T')[0];
const formatDateTime = (d: Date) => d.toISOString();

export const ponds: Pond[] = [
  {
    id: 'pond-1',
    name: '1号塘',
    area: 8.5,
    depth: 2.2,
    breed: '草鱼',
    stockDate: '2025-03-15',
    location: { lat: 30.5728, lng: 114.3055 },
    status: 'normal',
    waterQuality: {
      pondId: 'pond-1',
      timestamp: formatDateTime(now),
      temperature: 26.5,
      dissolvedOxygen: 7.2,
      ph: 7.4,
      ammoniaNitrogen: 0.35,
      nitrite: 0.08,
      transparency: 35
    },
    notes: '主养草鱼，套养花白鲢'
  },
  {
    id: 'pond-2',
    name: '2号塘',
    area: 12.0,
    depth: 2.5,
    breed: '鲫鱼',
    stockDate: '2025-04-01',
    location: { lat: 30.5735, lng: 114.3062 },
    status: 'warning',
    waterQuality: {
      pondId: 'pond-2',
      timestamp: formatDateTime(now),
      temperature: 28.1,
      dissolvedOxygen: 4.8,
      ph: 8.2,
      ammoniaNitrogen: 0.65,
      nitrite: 0.15,
      transparency: 28
    },
    notes: '精养鲫鱼塘'
  },
  {
    id: 'pond-3',
    name: '3号塘',
    area: 6.8,
    depth: 2.0,
    breed: '南美白对虾',
    stockDate: '2025-05-10',
    location: { lat: 30.5720, lng: 114.3048 },
    status: 'danger',
    waterQuality: {
      pondId: 'pond-3',
      timestamp: formatDateTime(now),
      temperature: 29.5,
      dissolvedOxygen: 3.2,
      ph: 8.8,
      ammoniaNitrogen: 0.92,
      nitrite: 0.25,
      transparency: 22
    },
    notes: '虾塘，注意溶氧'
  },
  {
    id: 'pond-4',
    name: '4号塘',
    area: 15.0,
    depth: 2.8,
    breed: '鲈鱼',
    stockDate: '2025-02-20',
    location: { lat: 30.5742, lng: 114.3070 },
    status: 'normal',
    waterQuality: {
      pondId: 'pond-4',
      timestamp: formatDateTime(now),
      temperature: 25.8,
      dissolvedOxygen: 8.1,
      ph: 7.2,
      ammoniaNitrogen: 0.25,
      nitrite: 0.05,
      transparency: 40
    },
    notes: '加州鲈养殖'
  },
  {
    id: 'pond-5',
    name: '5号塘',
    area: 10.0,
    depth: 2.3,
    breed: '黄颡鱼',
    stockDate: '2025-04-20',
    location: { lat: 30.5715, lng: 114.3035 },
    status: 'normal',
    waterQuality: {
      pondId: 'pond-5',
      timestamp: formatDateTime(now),
      temperature: 27.2,
      dissolvedOxygen: 6.8,
      ph: 7.6,
      ammoniaNitrogen: 0.42,
      nitrite: 0.10,
      transparency: 32
    },
    notes: '黄颡鱼精养'
  }
];

export const devices: Device[] = [
  { id: 'dev-1', pondId: 'pond-1', name: '1号增氧机', type: 'aerator', status: 'running', power: 1.5, runtime: 1256, lastMaintenance: '2025-05-01', location: '东侧' },
  { id: 'dev-2', pondId: 'pond-1', name: '2号增氧机', type: 'aerator', status: 'stopped', power: 1.5, runtime: 980, lastMaintenance: '2025-05-01', location: '西侧' },
  { id: 'dev-3', pondId: 'pond-1', name: '自动投饵机', type: 'feeder', status: 'running', power: 0.2, runtime: 560, lastMaintenance: '2025-05-10', location: '北岸' },
  { id: 'dev-4', pondId: 'pond-1', name: '水质传感器', type: 'sensor', status: 'running', power: 0.05, runtime: 2160, lastMaintenance: '2025-04-15' },
  { id: 'dev-5', pondId: 'pond-2', name: '1号增氧机', type: 'aerator', status: 'running', power: 2.2, runtime: 1580, lastMaintenance: '2025-04-20', location: '中央' },
  { id: 'dev-6', pondId: 'pond-2', name: '2号增氧机', type: 'aerator', status: 'fault', power: 2.2, runtime: 1420, lastMaintenance: '2025-04-20', location: '南侧' },
  { id: 'dev-7', pondId: 'pond-2', name: '自动投饵机', type: 'feeder', status: 'running', power: 0.3, runtime: 720, lastMaintenance: '2025-05-05' },
  { id: 'dev-8', pondId: 'pond-3', name: '1号增氧机', type: 'aerator', status: 'running', power: 1.5, runtime: 890, lastMaintenance: '2025-05-15', location: '东侧' },
  { id: 'dev-9', pondId: 'pond-3', name: '2号增氧机', type: 'aerator', status: 'running', power: 1.5, runtime: 875, lastMaintenance: '2025-05-15', location: '西侧' },
  { id: 'dev-10', pondId: 'pond-3', name: '水质传感器', type: 'sensor', status: 'running', power: 0.05, runtime: 720, lastMaintenance: '2025-05-10' },
  { id: 'dev-11', pondId: 'pond-4', name: '1号增氧机', type: 'aerator', status: 'stopped', power: 3.0, runtime: 2100, lastMaintenance: '2025-04-25', location: '北岸' },
  { id: 'dev-12', pondId: 'pond-4', name: '2号增氧机', type: 'aerator', status: 'stopped', power: 3.0, runtime: 2050, lastMaintenance: '2025-04-25', location: '南岸' },
  { id: 'dev-13', pondId: 'pond-4', name: '自动投饵机', type: 'feeder', status: 'stopped', power: 0.25, runtime: 480, lastMaintenance: '2025-05-12' },
  { id: 'dev-14', pondId: 'pond-5', name: '1号增氧机', type: 'aerator', status: 'running', power: 1.5, runtime: 650, lastMaintenance: '2025-05-08', location: '东侧' },
  { id: 'dev-15', pondId: 'pond-5', name: '水质传感器', type: 'sensor', status: 'running', power: 0.05, runtime: 1080, lastMaintenance: '2025-05-01' }
];

export const alerts: Alert[] = [
  {
    id: 'alert-1',
    pondId: 'pond-3',
    pondName: '3号塘',
    type: 'water_quality',
    level: 'danger',
    message: '溶氧过低：3.2mg/L，已低于安全阈值',
    timestamp: formatDateTime(new Date(now.getTime() - 10 * 60000)),
    status: 'pending'
  },
  {
    id: 'alert-2',
    pondId: 'pond-2',
    pondName: '2号塘',
    type: 'water_quality',
    level: 'warning',
    message: '氨氮偏高：0.65mg/L，建议换水',
    timestamp: formatDateTime(new Date(now.getTime() - 30 * 60000)),
    status: 'processing',
    handler: '张技术员'
  },
  {
    id: 'alert-3',
    pondId: 'pond-2',
    pondName: '2号塘',
    type: 'device',
    level: 'warning',
    message: '2号增氧机故障，已停止运行',
    timestamp: formatDateTime(new Date(now.getTime() - 2 * 3600000)),
    status: 'pending'
  },
  {
    id: 'alert-4',
    pondId: 'pond-3',
    pondName: '3号塘',
    type: 'water_quality',
    level: 'warning',
    message: 'pH值偏高：8.8，请注意调节',
    timestamp: formatDateTime(new Date(now.getTime() - 1 * 3600000)),
    status: 'pending'
  },
  {
    id: 'alert-5',
    pondId: 'pond-1',
    pondName: '1号塘',
    type: 'water_quality',
    level: 'info',
    message: '水温升高至26.5°C，注意投喂量调整',
    timestamp: formatDateTime(new Date(now.getTime() - 5 * 3600000)),
    status: 'resolved',
    handler: '李场长',
    handleTime: formatDateTime(new Date(now.getTime() - 4 * 3600000)),
    handleNote: '已调整投喂计划'
  }
];

export const stockRecords: StockRecord[] = [
  { id: 'stock-1', pondId: 'pond-1', breed: '草鱼', quantity: 8000, spec: '3-5尾/斤', date: '2025-03-15', operator: '李场长', notes: '优质草鱼苗' },
  { id: 'stock-2', pondId: 'pond-1', breed: '花白鲢', quantity: 2000, spec: '5-8尾/斤', date: '2025-03-15', operator: '李场长', notes: '套养' },
  { id: 'stock-3', pondId: 'pond-2', breed: '鲫鱼', quantity: 15000, spec: '20-30尾/斤', date: '2025-04-01', operator: '李场长' },
  { id: 'stock-4', pondId: 'pond-3', breed: '南美白对虾', quantity: 120000, spec: 'PL12', date: '2025-05-10', operator: '张技术员', notes: '一代苗' },
  { id: 'stock-5', pondId: 'pond-4', breed: '加州鲈', quantity: 6000, spec: '5-7cm', date: '2025-02-20', operator: '李场长' },
  { id: 'stock-6', pondId: 'pond-5', breed: '黄颡鱼', quantity: 10000, spec: '4-6cm', date: '2025-04-20', operator: '张技术员' }
];

export const samplingRecords: SamplingRecord[] = [
  { id: 'sample-1', pondId: 'pond-1', date: '2025-06-01', temperature: 26.2, dissolvedOxygen: 7.0, ph: 7.3, ammoniaNitrogen: 0.32, nitrite: 0.07, transparency: 36, sampler: '张技术员' },
  { id: 'sample-2', pondId: 'pond-1', date: '2025-06-03', temperature: 26.8, dissolvedOxygen: 7.5, ph: 7.5, ammoniaNitrogen: 0.38, nitrite: 0.09, transparency: 34, sampler: '张技术员' },
  { id: 'sample-3', pondId: 'pond-2', date: '2025-06-01', temperature: 27.8, dissolvedOxygen: 5.2, ph: 8.0, ammoniaNitrogen: 0.58, nitrite: 0.12, transparency: 30, sampler: '张技术员' },
  { id: 'sample-4', pondId: 'pond-2', date: '2025-06-03', temperature: 28.3, dissolvedOxygen: 4.5, ph: 8.3, ammoniaNitrogen: 0.68, nitrite: 0.16, transparency: 27, sampler: '张技术员', notes: '指标有恶化趋势' },
  { id: 'sample-5', pondId: 'pond-3', date: '2025-06-02', temperature: 29.0, dissolvedOxygen: 3.8, ph: 8.5, ammoniaNitrogen: 0.85, nitrite: 0.22, transparency: 25, sampler: '张技术员' }
];

export const diseaseRecords: DiseaseRecord[] = [
  { id: 'disease-1', pondId: 'pond-2', date: '2025-05-28', diseaseName: '细菌性烂鳃', symptoms: '鱼体发黑，离群独游，鳃丝腐烂', diagnosis: '柱状黄杆菌感染', treatment: '聚维酮碘全池泼洒，连续3天', operator: '张技术员', status: 'recovering', notes: '每天观察摄食情况' },
  { id: 'disease-2', pondId: 'pond-5', date: '2025-05-20', diseaseName: '车轮虫病', symptoms: '鱼体粘液增多，躁动不安', diagnosis: '车轮虫寄生', treatment: '硫酸铜+硫酸亚铁合剂全池泼洒', operator: '张技术员', status: 'resolved' },
  { id: 'disease-3', pondId: 'pond-3', date: '2025-06-01', diseaseName: '对虾白斑综合症', symptoms: '虾体活力下降，空胃空肠', diagnosis: '白斑病毒感染', treatment: '维生素C+免疫多糖拌饵投喂', operator: '张技术员', status: 'active', notes: '严重，需密切关注' }
];

export const patrolRecords: PatrolRecord[] = [
  { id: 'patrol-1', pondId: 'pond-1', date: '2025-06-04 08:30', weather: '晴', observations: '鱼群摄食正常，水质良好', abnormalities: '无', measures: '正常管理', patrolman: '王师傅' },
  { id: 'patrol-2', pondId: 'pond-2', date: '2025-06-04 09:00', weather: '晴', observations: '鱼摄食略有下降，水色偏浓', abnormalities: '发现少量鱼在水面浮头', measures: '已开启增氧机，准备换水', patrolman: '王师傅' },
  { id: 'patrol-3', pondId: 'pond-3', date: '2025-06-04 09:30', weather: '晴', observations: '虾池溶氧偏低，虾摄食一般', abnormalities: '部分虾爬边', measures: '已全部开启增氧机，投撒增氧剂', patrolman: '王师傅' },
  { id: 'patrol-4', pondId: 'pond-4', date: '2025-06-04 10:00', weather: '晴', observations: '鲈鱼摄食旺盛，水质清新', abnormalities: '无', measures: '正常管理', patrolman: '王师傅' },
  { id: 'patrol-5', pondId: 'pond-5', date: '2025-06-04 10:30', weather: '晴', observations: '黄颡鱼生长良好', abnormalities: '无', measures: '正常管理', patrolman: '王师傅' }
];

export const feedingSchedules: FeedingSchedule[] = [
  { id: 'feed-1', pondId: 'pond-1', deviceId: 'dev-3', time: '08:00', amount: 15, enabled: true },
  { id: 'feed-2', pondId: 'pond-1', deviceId: 'dev-3', time: '12:00', amount: 12, enabled: true },
  { id: 'feed-3', pondId: 'pond-1', deviceId: 'dev-3', time: '17:00', amount: 18, enabled: true },
  { id: 'feed-4', pondId: 'pond-2', deviceId: 'dev-7', time: '07:30', amount: 20, enabled: true },
  { id: 'feed-5', pondId: 'pond-2', deviceId: 'dev-7', time: '11:30', amount: 15, enabled: true },
  { id: 'feed-6', pondId: 'pond-2', deviceId: 'dev-7', time: '16:30', amount: 25, enabled: true },
  { id: 'feed-7', pondId: 'pond-4', deviceId: 'dev-13', time: '09:00', amount: 10, enabled: false },
  { id: 'feed-8', pondId: 'pond-4', deviceId: 'dev-13', time: '15:00', amount: 12, enabled: false }
];

export const feedInventories: FeedInventory[] = [
  { id: 'feed-inv-1', name: '草鱼配合饲料', brand: '通威', spec: '28%蛋白 25kg/袋', quantity: 85, unit: '袋', minStock: 20, supplier: '通威饲料经销商', purchaseDate: '2025-05-15', expiryDate: '2025-11-15' },
  { id: 'feed-inv-2', name: '鲫鱼配合饲料', brand: '通威', spec: '32%蛋白 25kg/袋', quantity: 42, unit: '袋', minStock: 20, supplier: '通威饲料经销商', purchaseDate: '2025-05-20', expiryDate: '2025-11-20' },
  { id: 'feed-inv-3', name: '对虾配合饲料', brand: '粤海', spec: '40%蛋白 20kg/袋', quantity: 18, unit: '袋', minStock: 15, supplier: '粤海饲料经销商', purchaseDate: '2025-05-25', expiryDate: '2025-11-25' },
  { id: 'feed-inv-4', name: '鲈鱼配合饲料', brand: '天邦', spec: '42%蛋白 20kg/袋', quantity: 35, unit: '袋', minStock: 10, supplier: '天邦饲料经销商', purchaseDate: '2025-05-10', expiryDate: '2025-11-10' },
  { id: 'feed-inv-5', name: '黄颡鱼配合饲料', brand: '通威', spec: '36%蛋白 25kg/袋', quantity: 12, unit: '袋', minStock: 15, supplier: '通威饲料经销商', purchaseDate: '2025-05-18', expiryDate: '2025-11-18' }
];

export const medicineInventories: MedicineInventory[] = [
  { id: 'med-1', name: '聚维酮碘溶液', category: '消毒剂', spec: '10% 500ml/瓶', quantity: 25, unit: '瓶', minStock: 10, manufacturer: '某兽药厂', purchaseDate: '2025-04-01', expiryDate: '2027-04-01' },
  { id: 'med-2', name: '硫酸铜', category: '杀虫药', spec: '98% 500g/袋', quantity: 15, unit: '袋', minStock: 5, manufacturer: '某化工厂', purchaseDate: '2025-04-15', expiryDate: '2028-04-15' },
  { id: 'med-3', name: '维生素C', category: '营养保健', spec: '50% 1kg/袋', quantity: 8, unit: '袋', minStock: 10, manufacturer: '某生物公司', purchaseDate: '2025-05-01', expiryDate: '2026-05-01' },
  { id: 'med-4', name: '增氧剂', category: '水质改良', spec: '1kg/袋', quantity: 5, unit: '袋', minStock: 20, manufacturer: '某生物公司', purchaseDate: '2025-05-10', expiryDate: '2026-05-10' },
  { id: 'med-5', name: 'EM菌', category: '微生态制剂', spec: '5L/桶', quantity: 6, unit: '桶', minStock: 3, manufacturer: '某生物科技', purchaseDate: '2025-05-20', expiryDate: '2025-11-20' }
];

export const workers: Worker[] = [
  { id: 'worker-1', name: '王师傅', position: '养殖工', phone: '138****1234', dailyWage: 200 },
  { id: 'worker-2', name: '李师傅', position: '养殖工', phone: '139****5678', dailyWage: 200 },
  { id: 'worker-3', name: '张技术员', position: '技术员', phone: '137****9012', dailyWage: 350 },
  { id: 'worker-4', name: '赵师傅', position: '电工', phone: '136****3456', dailyWage: 250 },
  { id: 'worker-5', name: '刘场长', position: '场长', phone: '135****7890', dailyWage: 400 }
];

export const workRecords: WorkRecord[] = [
  { id: 'work-1', workerId: 'worker-1', date: '2025-06-01', workType: '投喂', hours: 8, pondId: 'pond-1' },
  { id: 'work-2', workerId: 'worker-1', date: '2025-06-01', workType: '巡塘', hours: 2 },
  { id: 'work-3', workerId: 'worker-2', date: '2025-06-01', workType: '换水', hours: 6, pondId: 'pond-2' },
  { id: 'work-4', workerId: 'worker-3', date: '2025-06-01', workType: '水质检测', hours: 4 },
  { id: 'work-5', workerId: 'worker-3', date: '2025-06-01', workType: '病害诊断', hours: 2, pondId: 'pond-3' },
  { id: 'work-6', workerId: 'worker-1', date: '2025-06-02', workType: '投喂', hours: 8, pondId: 'pond-1' },
  { id: 'work-7', workerId: 'worker-2', date: '2025-06-02', workType: '清理塘埂', hours: 8 },
  { id: 'work-8', workerId: 'worker-4', date: '2025-06-02', workType: '设备维修', hours: 4, pondId: 'pond-2' }
];

export const orders: Order[] = [
  { id: 'order-1', orderNo: 'ORD202506001', customerName: '张老板', product: '草鱼', quantity: 2500, unit: '斤', price: 8.5, totalAmount: 21250, status: 'completed', createTime: '2025-06-01', deliveryTime: '2025-06-02', address: '武汉市某水产市场', phone: '138****1111' },
  { id: 'order-2', orderNo: 'ORD202506002', customerName: '李老板', product: '鲫鱼', quantity: 1800, unit: '斤', price: 12.0, totalAmount: 21600, status: 'shipped', createTime: '2025-06-03', deliveryTime: '2025-06-04', address: '长沙市某饭店', phone: '139****2222' },
  { id: 'order-3', orderNo: 'ORD202506003', customerName: '王老板', product: '鲈鱼', quantity: 500, unit: '斤', price: 28.0, totalAmount: 14000, status: 'pending', createTime: '2025-06-04', address: '广州市某餐厅', phone: '137****3333' },
  { id: 'order-4', orderNo: 'ORD202506004', customerName: '陈老板', product: '黄颡鱼', quantity: 1200, unit: '斤', price: 18.0, totalAmount: 21600, status: 'pending', createTime: '2025-06-04', address: '深圳市某超市', phone: '136****4444' },
  { id: 'order-5', orderNo: 'ORD202505001', customerName: '刘老板', product: '草鱼', quantity: 3000, unit: '斤', price: 8.2, totalAmount: 24600, status: 'completed', createTime: '2025-05-28', deliveryTime: '2025-05-29', address: '郑州市某市场', phone: '135****5555' }
];

export const costRecords: CostRecord[] = [
  { id: 'cost-1', date: '2025-06-01', category: '饲料', description: '购买草鱼饲料50袋', amount: 12500, pondId: 'pond-1' },
  { id: 'cost-2', date: '2025-06-02', category: '药品', description: '购买消毒剂和维生素C', amount: 2800 },
  { id: 'cost-3', date: '2025-06-03', category: '人工', description: '5月份工人工资', amount: 35000 },
  { id: 'cost-4', date: '2025-06-01', category: '水电', description: '5月份电费', amount: 8500 },
  { id: 'cost-5', date: '2025-05-28', category: '苗种', description: '虾苗款', amount: 18000, pondId: 'pond-3' },
  { id: 'cost-6', date: '2025-05-20', category: '设备', description: '新增增氧机2台', amount: 6000 }
];

export const revenueRecords: RevenueRecord[] = [
  { id: 'rev-1', date: '2025-06-02', category: '成鱼销售', description: '草鱼销售给张老板', amount: 21250, pondId: 'pond-1' },
  { id: 'rev-2', date: '2025-06-04', category: '成鱼销售', description: '鲫鱼销售给李老板', amount: 21600, pondId: 'pond-2' },
  { id: 'rev-3', date: '2025-05-29', category: '成鱼销售', description: '草鱼销售给刘老板', amount: 24600, pondId: 'pond-1' },
  { id: 'rev-4', date: '2025-05-20', category: '补贴', description: '水产养殖补贴', amount: 10000 },
  { id: 'rev-5', date: '2025-05-15', category: '其他', description: '塘埂作物收入', amount: 3500 }
];

export const yieldForecasts: YieldForecast[] = [
  { pondId: 'pond-1', breed: '草鱼', estimatedYield: 12000, confidence: 85, forecastDate: '2025-06-01', harvestDate: '2025-10-15' },
  { pondId: 'pond-2', breed: '鲫鱼', estimatedYield: 9000, confidence: 80, forecastDate: '2025-06-01', harvestDate: '2025-11-01' },
  { pondId: 'pond-3', breed: '南美白对虾', estimatedYield: 1800, confidence: 70, forecastDate: '2025-06-01', harvestDate: '2025-09-10' },
  { pondId: 'pond-4', breed: '加州鲈', estimatedYield: 5000, confidence: 88, forecastDate: '2025-06-01', harvestDate: '2025-09-30' },
  { pondId: 'pond-5', breed: '黄颡鱼', estimatedYield: 7500, confidence: 82, forecastDate: '2025-06-01', harvestDate: '2025-10-20' }
];

export const defaultThresholds: ThresholdConfig = {
  temperature: { min: 15, max: 32 },
  dissolvedOxygen: { min: 5, max: 12 },
  ph: { min: 6.5, max: 8.5 },
  ammoniaNitrogen: { min: 0, max: 0.5 },
  nitrite: { min: 0, max: 0.15 }
};

export const generateWaterQualityHistory = (pondId: string, days: number = 7) => {
  const data = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      date: formatDate(date),
      temperature: 24 + Math.random() * 6,
      dissolvedOxygen: 4 + Math.random() * 5,
      ph: 7 + Math.random() * 2,
      ammoniaNitrogen: 0.2 + Math.random() * 0.6,
      nitrite: 0.05 + Math.random() * 0.15
    });
  }
  return data;
};

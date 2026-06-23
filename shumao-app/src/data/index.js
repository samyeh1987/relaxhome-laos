// 共用設計 Token
export const COLORS = {
  primary: '#FF4D1A',
  primary2: '#FF6B3D',
  primary3: '#FF9A6C',
  primaryLight: '#FFF0EB',
  primaryGlow: 'rgba(255,77,26,0.25)',
  success: '#10B981',
  warning: '#F59E0B',
  info: '#3B82F6',
  dark: '#1A1A2E',
  darkSub: '#6B7A99',
  darkXs: '#9AA5BE',
  bgPage: '#F7F8FC',
  bgCard: '#FFFFFF',
  border: '#F0F1F5',
  borderMd: '#EAECF0',
};

// 技師資料
export const THERAPISTS = [
  { id: 1, name: { zh: 'Nana / 娜娜', en: 'Nana', th: 'นานา' }, emoji: '💆‍♀️', rating: 4.9, reviews: 312, distance: '1.2km', tags: { zh: ['泰式按摩', '精油', '全身'], en: ['Thai', 'Oil', 'Full Body'], th: ['นวดไทย', 'น้ำมัน', 'ทั้งตัว'] }, featured: true, available: true, price: 150000 },
  { id: 2, name: { zh: 'Khamphet / 坎碧', en: 'Khamphet', th: 'คำเพชร' }, emoji: '🧘‍♀️', rating: 4.8, reviews: 205, distance: '2.1km', tags: { zh: ['孕婦按摩', '產後恢復', '溫柔'], en: ['Prenatal', 'Postpartum', 'Gentle'], th: ['นวดคนท้อง', 'หลังคลอด', 'อ่อนโยน'] }, featured: false, available: true, price: 130000 },
  { id: 3, name: { zh: 'Souphavanh / 素帕', en: 'Souphavanh', th: 'สุภาวัณ' }, emoji: '🌿', rating: 4.7, reviews: 178, distance: '3.0km', tags: { zh: ['足部按摩', '老人按摩', '穴位'], en: ['Foot', 'Senior', 'Acupoint'], th: ['นวดเท้า', 'ผู้สูงอายุ', 'กดจุด'] }, featured: false, available: false, price: 120000 },
];

// 服務列表
export const SERVICES = [
  { id: 'full60', icon: '💆', color: 'from-[#FFEEE8] to-[#FFD9CB]', nameKey: 'fullBody', duration: 60, price: 150000 },
  { id: 'full90', icon: '💆', color: 'from-[#FFEEE8] to-[#FFD9CB]', nameKey: 'fullBody', duration: 90, price: 210000 },
  { id: 'thai60', icon: '🧘', color: 'from-[#E8FFEE] to-[#CBFFDA]', nameKey: 'thai', duration: 60, price: 130000 },
  { id: 'oil60', icon: '🌿', color: 'from-[#F3E8FF] to-[#E3CBFF]', nameKey: 'oil', duration: 60, price: 160000 },
  { id: 'foot60', icon: '🦶', color: 'from-[#FFF8E1] to-[#FFEDB0]', nameKey: 'foot', duration: 60, price: 100000 },
  { id: 'pregnant60', icon: '🤰', color: 'from-[#FFE4F0] to-[#FFCCE0]', nameKey: 'pregnant', duration: 60, price: 140000 },
];

// 時段
export const TIME_SLOTS = [
  '09:00', '10:00', '11:00', '13:00', '14:00', '15:00',
  '16:00', '17:00', '18:00', '19:00', '20:00', '21:00',
];

// BCEL 銀行信息
export const BANK_INFO = {
  bank: 'BCEL (ທ.ຄ.ລ.)',
  accountName: 'Vientiane Wellness Co., Ltd',
  accountNumber: '010-3-00124-8',
};

// 格式化 LAK
export const formatLAK = (amount) =>
  `₭${amount.toLocaleString()}`;

// 計算手續費
export const calcFee = (amount, ratePercent) =>
  Math.round(amount * ratePercent / 100);

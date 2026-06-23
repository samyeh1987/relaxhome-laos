import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { formatLAK } from '../../data';
import BottomNav from '../../components/BottomNav';

const PENDING_FEES = [
  { id: 1, therapist: 'Nana · 娜娜', service: { zh: '全身按摩 60分鐘', en: 'Full Body 60min', th: 'นวดทั้งตัว 60 น.' }, amount: 22500, status: 'review' },
  { id: 2, therapist: 'Khamphet · 坎碧', service: { zh: '泰式按摩 60分鐘', en: 'Thai 60min', th: 'นวดไทย 60 น.' }, amount: 19500, status: 'paid' },
  { id: 3, therapist: 'Souphavanh · 素帕', service: { zh: '足部按摩 60分鐘', en: 'Foot 60min', th: 'นวดเท้า 60 น.' }, amount: 15000, status: 'review' },
];

const FEE_RATES = [
  { service: { zh: '全身按摩', en: 'Full Body', th: 'นวดทั้งตัว' }, rate: 15 },
  { service: { zh: '泰式按摩', en: 'Thai Massage', th: 'นวดไทย' }, rate: 15 },
  { service: { zh: '精油按摩', en: 'Oil Massage', th: 'นวดน้ำมัน' }, rate: 12 },
  { service: { zh: '孕婦按摩', en: 'Prenatal', th: 'นวดคนท้อง' }, rate: 10 },
  { service: { zh: '足部按摩', en: 'Foot Massage', th: 'นวดเท้า' }, rate: 12 },
];

const SHOPS = [
  { name: 'Vientiane Relax Center', therapists: 8, active: 5, status: 'open' },
  { name: 'Lao Wellness Spa', therapists: 5, active: 3, status: 'open' },
  { name: 'Mekong Therapy House', therapists: 12, active: 7, status: 'open' },
];

const STATS = [
  { key: 'gmv', icon: '💰', val: '₭2,450,000', trend: '+12%', color: '#FF4D1A' },
  { key: 'revenue', icon: '📈', val: '₭367,500', trend: '+8%', color: '#10B981' },
  { key: 'orders', icon: '📋', val: '18', trend: '+5', color: '#3B82F6' },
  { key: 'activeTherapists', icon: '👥', val: '15', trend: '+2', color: '#F59E0B' },
];

export default function AdminDashboard() {
  const { T, lang } = useApp();
  const [feeStatuses, setFeeStatuses] = useState({});

  const handleApprove = (id) => setFeeStatuses(prev => ({ ...prev, [id]: 'paid' }));
  const handleReject = (id) => setFeeStatuses(prev => ({ ...prev, [id]: 'rejected' }));

  return (
    <div style={{ background: '#F0F2F5', display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      {/* Status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 20px', fontSize: 11, background: '#1a2536', flexShrink: 0, color: 'rgba(255,255,255,0.5)' }}>
        <span style={{ fontWeight: 800, fontSize: 13, color: '#fff' }}>{new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}</span>
        <span>▲ 📶 🔋</span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(165deg,#0D1B2A 0%,#1E3448 40%,#2D5F8A 100%)', padding: '16px 16px 20px' }}>
          <div style={{ fontSize: 17, fontWeight: 800, color: '#fff' }}>
            🇱🇦 {T.admin.title}
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 4 }}>Vientiane Wellness Co., Ltd</div>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: '14px 12px 0' }}>
          {STATS.map((s, i) => (
            <motion.div key={s.key} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} style={{ background: '#fff', borderRadius: 16, padding: 14, boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <span style={{ fontSize: 18 }}>{s.icon}</span>
                <span style={{ fontSize: 11, color: '#9AA5BE', fontWeight: 600 }}>{T.admin[s.key]}</span>
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#1A1A2E' }}>{s.val}</div>
              <div style={{ fontSize: 11, marginTop: 5, fontWeight: 600, color: s.color }}>↑ {s.trend}</div>
            </motion.div>
          ))}
        </div>

        {/* Pending Fees */}
        <div style={{ background: '#fff', margin: '10px 12px 0', borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
          <div style={{ padding: '14px 16px', fontSize: 14, fontWeight: 700, color: '#1A1A2E', borderBottom: '1px solid #f5f5f5', display: 'flex', justifyContent: 'space-between' }}>
            <span>{T.admin.pendingFees}</span>
            <span style={{ fontSize: 11, background: '#FFF0EB', color: '#FF4D1A', padding: '3px 10px', borderRadius: 20, fontWeight: 700 }}>
              {PENDING_FEES.filter(f => (feeStatuses[f.id] || f.status) === 'review').length} {lang === 'zh' ? '待審' : 'pending'}
            </span>
          </div>
          {PENDING_FEES.map(fee => {
            const status = feeStatuses[fee.id] || fee.status;
            return (
              <div key={fee.id} style={{ padding: '12px 16px', borderBottom: '1px solid #f5f5f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1A2E' }}>{fee.therapist}</div>
                  <div style={{ fontSize: 11, color: '#9AA5BE', marginTop: 2 }}>{fee.service[lang]}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: '#FF4D1A' }}>{formatLAK(fee.amount)}</span>
                  {status === 'review' ? (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleReject(fee.id)} style={{ fontSize: 11, background: '#FFF0EB', color: '#FF4D1A', border: 'none', padding: '4px 8px', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>{T.admin.reject}</motion.button>
                      <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleApprove(fee.id)} style={{ fontSize: 11, background: '#F0FFF4', color: '#10B981', border: 'none', padding: '4px 8px', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>{T.admin.approve}</motion.button>
                    </div>
                  ) : (
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 20, background: status === 'paid' ? '#F0FFF4' : '#FFF0EB', color: status === 'paid' ? '#10B981' : '#FF4D1A' }}>
                      {status === 'paid' ? T.admin.paid : T.admin.review}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Fee Rates */}
        <div style={{ background: '#fff', margin: '10px 12px 0', borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
          <div style={{ padding: '14px 16px', fontSize: 14, fontWeight: 700, color: '#1A1A2E', borderBottom: '1px solid #f5f5f5' }}>
            ⚙️ {T.admin.feeRates}
          </div>
          {FEE_RATES.map((fr, i) => (
            <div key={i} style={{ padding: '11px 16px', borderBottom: '1px solid #f5f5f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: '#555', fontWeight: 500 }}>{fr.service[lang]}</span>
              <span style={{ fontSize: 15, fontWeight: 800, color: '#FF4D1A', background: '#FFF0EB', padding: '4px 14px', borderRadius: 20 }}>{fr.rate}%</span>
            </div>
          ))}
        </div>

        {/* Partner Shops */}
        <div style={{ background: '#fff', margin: '10px 12px 0', borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.04)', marginBottom: 14 }}>
          <div style={{ padding: '14px 16px', fontSize: 14, fontWeight: 700, color: '#1A1A2E', borderBottom: '1px solid #f5f5f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>🏪 {T.admin.shops}</span>
            <motion.button whileTap={{ scale: 0.95 }} style={{ fontSize: 12, background: 'linear-gradient(135deg,#FF4D1A,#FF6B3D)', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: 10, cursor: 'pointer', fontWeight: 700 }}>{T.admin.addShop}</motion.button>
          </div>
          {SHOPS.map((shop, i) => (
            <div key={i} style={{ padding: '12px 16px', borderBottom: i < SHOPS.length - 1 ? '1px solid #f5f5f5' : 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#FFF0EB,#FFE0D5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>🏪</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1A2E' }}>{shop.name}</div>
                <div style={{ fontSize: 11, color: '#9AA5BE', marginTop: 2 }}>
                  {lang === 'zh' ? `技師 ${shop.therapists} · 在線 ${shop.active}` : lang === 'en' ? `${shop.therapists} therapists · ${shop.active} active` : `${shop.therapists} นักนวด · ${shop.active} ออนไลน์`}
                </div>
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 20, background: '#F0FFF4', color: '#10B981' }}>
                {lang === 'zh' ? '營業中' : lang === 'en' ? 'Open' : 'เปิด'}
              </span>
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { formatLAK } from '../../data';
import BottomNav from '../../components/BottomNav';

const SAMPLE_ORDERS = [
  { id: '#VTE-20260618-001', service: { zh: '全身按摩 60分鐘', en: 'Full Body 60min', th: 'นวดทั้งตัว 60 น.' }, therapist: { zh: 'Nana / 娜娜', en: 'Nana', th: 'นานา' }, status: 'active', price: 150000, date: '2026-06-18 19:00' },
  { id: '#VTE-20260615-018', service: { zh: '泰式按摩 60分鐘', en: 'Thai Massage 60min', th: 'นวดไทย 60 น.' }, therapist: { zh: 'Khamphet / 坎碧', en: 'Khamphet', th: 'คำเพชร' }, status: 'done', price: 130000, date: '2026-06-15 14:00' },
];

export default function OrderList() {
  const { T, lang } = useApp();
  const navigate = useNavigate();

  return (
    <div style={{ background: '#F7F8FC', display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 20px', fontSize: 11, background: '#fff', flexShrink: 0, color: '#888' }}>
        <span style={{ fontWeight: 800, fontSize: 13, color: '#1a1a2e' }}>{new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}</span>
        <span>▲ 📶 🔋</span>
      </div>
      <div style={{ background: '#fff', padding: '12px 20px', borderBottom: '1px solid #F0F1F5', flexShrink: 0 }}>
        <div style={{ fontSize: 18, fontWeight: 900, color: '#1A1A2E' }}>{T.nav.orders}</div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 14px 80px' }}>
        {SAMPLE_ORDERS.map((ord, i) => (
          <motion.div
            key={ord.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            style={{ background: '#fff', borderRadius: 18, padding: 16, marginBottom: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.05)', cursor: 'pointer' }}
            onClick={() => ord.status === 'active' && navigate('/order')}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 11, color: '#9AA5BE' }}>{ord.id}</span>
              <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: ord.status === 'active' ? '#FFF0EB' : '#F0FFF4', color: ord.status === 'active' ? '#FF4D1A' : '#10B981' }}>
                {ord.status === 'active' ? (lang === 'zh' ? '進行中' : lang === 'en' ? 'Active' : 'กำลังดำเนินการ') : (lang === 'zh' ? '已完成' : lang === 'en' ? 'Completed' : 'เสร็จสิ้น')}
              </span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#1A1A2E', marginBottom: 4 }}>{ord.service[lang]}</div>
            <div style={{ fontSize: 12, color: '#6B7A99' }}>👤 {ord.therapist[lang]}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, paddingTop: 12, borderTop: '1px dashed #eee' }}>
              <span style={{ fontSize: 12, color: '#9AA5BE' }}>📅 {ord.date}</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: '#FF4D1A' }}>{formatLAK(ord.price)}</span>
            </div>
            {ord.status === 'active' && (
              <motion.button whileTap={{ scale: 0.97 }} onClick={() => navigate('/order')} style={{ width: '100%', marginTop: 10, background: 'linear-gradient(135deg,#FF4D1A,#FF6B3D)', color: '#fff', border: 'none', borderRadius: 12, padding: '10px', fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(255,77,26,0.3)' }}>
                {lang === 'zh' ? '追蹤訂單 →' : lang === 'en' ? 'Track Order →' : 'ติดตามคำสั่ง →'}
              </motion.button>
            )}
          </motion.div>
        ))}
      </div>
      <BottomNav />
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { formatLAK } from '../../data';
import BottomNav from '../../components/BottomNav';

const STEPS = [
  { key: 'stepBooked', status: 'done' },
  { key: 'stepAccepted', status: 'done' },
  { key: 'stepOnTheWay', status: 'active' },
  { key: 'stepArrived', status: 'pending' },
  { key: 'stepPay', status: 'pending' },
  { key: 'stepDone', status: 'pending' },
];

const STEP_ICONS = { done: '✓', active: '→', pending: '·' };
const STEP_EMOJIS = ['📋', '👍', '🚗', '🏠', '💵', '⭐'];

export default function OrderTracking() {
  const { T, lang, cart } = useApp();
  const navigate = useNavigate();
  const [isCancelled, setIsCancelled] = useState(false);

  const therapistName = cart?.therapist?.name?.[lang] || (lang === 'zh' ? 'Nana / 娜娜' : lang === 'en' ? 'Nana' : 'นานา');
  const price = cart?.service?.price || 150000;

  return (
    <div style={{ background: '#F7F8FC', display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      {/* Status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 20px', fontSize: 11, color: '#888', background: '#fff', flexShrink: 0 }}>
        <span style={{ fontWeight: 800, fontSize: 13, color: '#1a1a2e' }}>{new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}</span>
        <span>▲ 📶 🔋</span>
      </div>
      {/* Header */}
      <div style={{ background: '#fff', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid #F0F1F5', flexShrink: 0 }}>
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)} style={{ width: 32, height: 32, borderRadius: '50%', background: '#F5F6FA', border: 'none', cursor: 'pointer', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</motion.button>
        <span style={{ fontSize: 16, fontWeight: 800, color: '#1A1A2E', flex: 1 }}>{T.order.title}</span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }}>
        {/* Order Hero */}
        <div style={{ background: 'linear-gradient(160deg,#FF4D1A 0%,#FF6B3D 55%,#FFB085 100%)', padding: '20px 20px 36px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', bottom: -50, right: -50, width: 180, height: 180, background: 'rgba(255,255,255,0.08)', borderRadius: '50%', pointerEvents: 'none' }} />
          <AnimatePresence>
            <motion.div key="status" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.75)' }}>
                {lang === 'zh' ? '訂單進行中' : lang === 'en' ? 'Order In Progress' : 'คำสั่งกำลังดำเนินการ'}
              </div>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#fff', marginTop: 3 }}>{T.order.onTheWay}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 5 }}>
                {T.order.etaPrefix} <strong>15 {lang === 'zh' ? '分鐘' : lang === 'en' ? 'min' : 'น.'}</strong> {T.order.etaSuffix}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Therapist Float Card */}
        <div style={{ background: '#fff', margin: '-18px 14px 0', borderRadius: 24, padding: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.10)', position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 50, height: 50, borderRadius: 15, background: 'linear-gradient(135deg,#fde8d8,#f0d3bd)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>💆‍♀️</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#1A1A2E' }}>{therapistName}</div>
            <div style={{ fontSize: 11, color: '#10B981', fontWeight: 700, marginTop: 3 }}>
              🚗 {lang === 'zh' ? '約15分鐘後到達' : lang === 'en' ? 'Arriving ~15 min' : 'กำลังมา ~15 น.'}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['📞', '💬'].map(ico => (
              <motion.button key={ico} whileTap={{ scale: 0.9 }} style={{ width: 38, height: 38, borderRadius: '50%', border: '1.5px solid #EAECF0', background: '#fff', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>{ico}</motion.button>
            ))}
          </div>
        </div>

        {/* Progress Steps */}
        <div style={{ background: '#fff', margin: '12px 14px 0', borderRadius: 18, padding: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          {STEPS.map((step, i) => (
            <div key={step.key} style={{ display: 'flex', gap: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <motion.div
                  animate={step.status === 'active' ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 2 }}
                  style={{
                    width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, flexShrink: 0,
                    background: step.status === 'done' ? 'linear-gradient(135deg,#10B981,#34D399)' : step.status === 'active' ? 'linear-gradient(135deg,#FF4D1A,#FF6B3D)' : '#F3F4F8',
                    color: step.status === 'pending' ? '#C8CDD9' : '#fff',
                    boxShadow: step.status === 'done' ? '0 3px 10px rgba(16,185,129,0.3)' : step.status === 'active' ? '0 3px 10px rgba(255,77,26,0.3)' : 'none',
                  }}
                >
                  {step.status === 'done' ? '✓' : STEP_EMOJIS[i]}
                </motion.div>
                {i < STEPS.length - 1 && (
                  <div style={{ width: 2.5, flex: 1, minHeight: 20, margin: '3px 0', borderRadius: 2, background: step.status === 'done' ? 'linear-gradient(180deg,#10B981,#34D399)' : '#F0F1F5' }} />
                )}
              </div>
              <div style={{ paddingBottom: i < STEPS.length - 1 ? 20 : 0, flex: 1, paddingTop: 4 }}>
                <div style={{ fontSize: 14, fontWeight: step.status !== 'pending' ? 700 : 500, color: step.status !== 'pending' ? '#1A1A2E' : '#C8CDD9' }}>
                  {T.order[step.key]}
                </div>
                {step.status === 'active' && (
                  <div style={{ fontSize: 11, color: '#6B7A99', marginTop: 2 }}>
                    {lang === 'zh' ? '預計15分鐘後到達' : lang === 'en' ? 'Estimated 15 min' : 'ประมาณ 15 น.'}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Cash Reminder */}
        <div style={{ margin: '12px 14px', background: 'linear-gradient(135deg,#FFFBF0,#FFF5D9)', border: '1.5px solid rgba(245,158,11,0.25)', borderRadius: 14, padding: '14px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 700, color: '#D48806', marginBottom: 6 }}>
            {T.order.cashReminder}
          </div>
          <p style={{ fontSize: 12, color: '#78350F', lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: T.order.cashDesc.replace('强', 'strong').replace('strong>', 'strong>') }} />
          <div style={{ marginTop: 12, background: 'rgba(255,255,255,0.7)', borderRadius: 10, padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: '#92400E', fontWeight: 600 }}>{lang === 'zh' ? '現場應付金額' : lang === 'en' ? 'Cash to Pay' : 'ชำระเงินสด'}</span>
            <span style={{ fontSize: 22, fontWeight: 900, color: '#FF4D1A' }}>{formatLAK(price)}</span>
          </div>
        </div>

        {/* Cancel */}
        <div style={{ padding: '0 14px 20px' }}>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/')}
            style={{ width: '100%', background: 'transparent', color: '#6B7A99', border: '1.5px solid #EAECF0', borderRadius: 14, padding: 14, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
          >
            {T.order.cancelOrder}
          </motion.button>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

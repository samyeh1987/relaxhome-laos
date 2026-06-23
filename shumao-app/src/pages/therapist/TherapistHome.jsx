import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { formatLAK } from '../../data';
import BottomNav from '../../components/BottomNav';

const PENDING_ORDERS = [
  { id: '#VTE-20260618-001', service: { zh: '全身按摩 60分鐘', en: 'Full Body 60min', th: 'นวดทั้งตัว 60 น.' }, client: { zh: '李小姐 · Ban Dong Rd', en: 'Ms. Li · Ban Dong Rd', th: 'คุณหลี่ · Ban Dong Rd' }, price: 150000, fee: 22500, time: '19:00' },
];

export default function TherapistHome() {
  const { T, lang, isReceiving, setIsReceiving } = useApp();
  const navigate = useNavigate();
  const [acceptedOrder, setAcceptedOrder] = useState(null);

  const hasPendingFee = true;
  const pendingFeeAmount = 22500;

  return (
    <div style={{ background: '#F7F8FC', display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      {/* Status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 20px', fontSize: 11, background: '#1a2536', flexShrink: 0, color: 'rgba(255,255,255,0.5)' }}>
        <span style={{ fontWeight: 800, fontSize: 13, color: '#fff' }}>{new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}</span>
        <span>▲ 📶 🔋</span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(160deg,#0D1B2A 0%,#1E3448 40%,#2D5F8A 100%)', padding: '16px 20px 28px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', bottom: -60, right: -40, width: 200, height: 200, background: 'rgba(255,255,255,0.04)', borderRadius: '50%', pointerEvents: 'none' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                {lang === 'zh' ? '技師端' : lang === 'en' ? 'Therapist' : 'นักนวด'}
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginTop: 2 }}>
                {lang === 'zh' ? 'Nana · 娜娜' : lang === 'en' ? 'Nana' : 'นานา'}
              </div>
            </div>
            <div style={{ width: 40, height: 40, background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)', position: 'relative', fontSize: 18 }}>
              🔔
              {hasPendingFee && <span style={{ width: 10, height: 10, background: '#FF4D1A', borderRadius: '50%', position: 'absolute', top: 4, right: 4, border: '2px solid #1E3448' }} />}
            </div>
          </div>
          {/* Stats */}
          <div style={{ display: 'flex', gap: 10 }}>
            {[
              { val: '₭450,000', lbl: T.therapist.todayIncome, color: '#52C41A' },
              { val: '3', lbl: T.therapist.todayOrders, color: '#3B82F6' },
              { val: formatLAK(pendingFeeAmount), lbl: T.therapist.pendingFee, color: '#F59E0B' },
            ].map((s, i) => (
              <div key={i} style={{ flex: 1, background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', borderRadius: 14, padding: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>{s.val}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 3 }}>{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Toggle Card */}
        <div style={{ background: '#fff', margin: '-14px 14px 0', borderRadius: 18, padding: '14px 18px', boxShadow: '0 8px 32px rgba(0,0,0,0.10)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 2 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#1A1A2E' }}>
              {isReceiving ? T.therapist.receiveSwitch : T.therapist.offSwitch}
            </div>
            <div style={{ fontSize: 11, color: isReceiving ? '#52C41A' : '#9AA5BE', fontWeight: 600, marginTop: 2 }}>
              {isReceiving ? (lang === 'zh' ? '正在等待新訂單' : lang === 'en' ? 'Waiting for orders' : 'รอรับงานอยู่') : (lang === 'zh' ? '已暫停接單' : lang === 'en' ? 'Paused' : 'หยุดรับงาน')}
            </div>
          </div>
          <motion.div
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsReceiving(!isReceiving)}
            style={{ width: 52, height: 30, background: isReceiving ? 'linear-gradient(135deg,#52C41A,#73D13D)' : '#E5E7EB', borderRadius: 15, position: 'relative', cursor: 'pointer', boxShadow: isReceiving ? '0 4px 12px rgba(82,196,26,0.3)' : 'none', transition: 'all 0.3s' }}
          >
            <motion.div
              animate={{ right: isReceiving ? 3 : undefined, left: isReceiving ? undefined : 3 }}
              style={{ width: 24, height: 24, background: '#fff', borderRadius: '50%', position: 'absolute', top: 3, right: isReceiving ? 3 : undefined, left: isReceiving ? undefined : 3, boxShadow: '0 2px 8px rgba(0,0,0,0.15)', transition: 'all 0.3s' }}
            />
          </motion.div>
        </div>

        {/* Fee Alert */}
        {hasPendingFee && (
          <div style={{ background: 'linear-gradient(135deg,#FFF3E0,#FFE8C0)', border: '1px solid #FFB74D', borderRadius: 14, padding: '14px 16px', margin: '14px 14px 0', boxShadow: '0 4px 16px rgba(255,183,77,0.15)' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#E65100', marginBottom: 4 }}>{T.therapist.feeAlert}</div>
            <p style={{ fontSize: 12, color: '#666', lineHeight: 1.6 }}>{T.therapist.feeAlertDesc}</p>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate('/therapist/fee')}
              style={{ width: '100%', background: 'linear-gradient(135deg,#FF4D1A,#FF6B3D)', color: '#fff', border: 'none', borderRadius: 12, padding: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', marginTop: 10, boxShadow: '0 4px 16px rgba(255,77,26,0.3)' }}
            >
              {T.therapist.payFeeNow}
            </motion.button>
          </div>
        )}

        {/* New Order */}
        <div style={{ padding: '14px 14px 0' }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#1A1A2E', marginBottom: 12 }}>{T.therapist.orderList}</div>
          {PENDING_ORDERS.map(ord => (
            <motion.div key={ord.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ background: '#fff', borderRadius: 18, padding: 16, marginBottom: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20, background: '#FFF0EB', color: '#FF4D1A' }}>
                  🔔 {T.therapist.newOrder}
                </span>
                <span style={{ fontSize: 11, color: '#9AA5BE' }}>📅 {ord.time}</span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#1A1A2E', marginBottom: 6 }}>{ord.service[lang]}</div>
              <div style={{ fontSize: 12, color: '#6B7A99' }}>👤 {ord.client[lang]}</div>
              <div style={{ borderTop: '1px dashed #eee', marginTop: 12, paddingTop: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6B7A99', marginBottom: 4 }}>
                  <span>{T.therapist.clientPaid}</span><span style={{ fontWeight: 700, color: '#1A1A2E' }}>{formatLAK(ord.price)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6B7A99', marginBottom: 4 }}>
                  <span>{T.therapist.platformFee} (15%)</span><span style={{ fontWeight: 700, color: '#FF4D1A' }}>-{formatLAK(ord.fee)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 700, color: '#1A1A2E' }}>
                  <span>{T.therapist.netIncome}</span><span style={{ color: '#10B981' }}>{formatLAK(ord.price - ord.fee)}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button style={{ flex: 1, border: '1.5px solid #EAECF0', background: '#fff', color: '#6B7A99', borderRadius: 12, padding: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>{T.therapist.decline}</button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setAcceptedOrder(ord)}
                  style={{ flex: 2, background: 'linear-gradient(135deg,#FF4D1A,#FF6B3D)', color: '#fff', border: 'none', borderRadius: 12, padding: 10, fontSize: 13, fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 12px rgba(255,77,26,0.3)' }}
                >
                  {T.therapist.accept} ✓
                </motion.button>
              </div>
            </motion.div>
          ))}

          {acceptedOrder && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ background: '#F0FFF4', border: '1.5px solid #52C41A', borderRadius: 14, padding: 14, textAlign: 'center' }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>🎉</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#065F46' }}>
                {lang === 'zh' ? '已接單！請前往服務地點' : lang === 'en' ? 'Order Accepted! Head to client' : 'รับงานแล้ว! ไปยังลูกค้า'}
              </div>
            </motion.div>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

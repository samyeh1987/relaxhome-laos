import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { BANK_INFO, calcFee, formatLAK } from '../../data';
import BottomNav from '../../components/BottomNav';

export default function FeePayment() {
  const { T, lang } = useApp();
  const navigate = useNavigate();
  const [copied, setCopied] = useState('');
  const [uploaded, setUploaded] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const clientAmount = 150000;
  const feeRate = 15;
  const feeAmount = calcFee(clientAmount, feeRate);

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(''), 2000);
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ background: '#F7F8FC', display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200 }} style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 72, marginBottom: 20 }}>✅</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#1A1A2E', marginBottom: 8 }}>
            {lang === 'zh' ? '已提交！' : lang === 'en' ? 'Submitted!' : 'ส่งแล้ว!'}
          </div>
          <div style={{ fontSize: 14, color: '#6B7A99', lineHeight: 1.8 }}>{T.fee.submitHint}</div>
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => navigate('/therapist')} style={{ marginTop: 28, background: 'linear-gradient(135deg,#FF4D1A,#FF6B3D)', color: '#fff', border: 'none', borderRadius: 16, padding: '14px 32px', fontSize: 15, fontWeight: 800, cursor: 'pointer', boxShadow: '0 6px 22px rgba(255,77,26,0.32)' }}>
            {lang === 'zh' ? '返回首頁' : lang === 'en' ? 'Back to Home' : 'กลับหน้าหลัก'}
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ background: '#F7F8FC', display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      {/* Status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 20px', fontSize: 11, background: '#1a2536', flexShrink: 0, color: 'rgba(255,255,255,0.5)' }}>
        <span style={{ fontWeight: 800, fontSize: 13, color: '#fff' }}>{new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}</span>
        <span>▲ 📶 🔋</span>
      </div>
      {/* Header */}
      <div style={{ background: '#1a2536', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)} style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', fontSize: 15, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</motion.button>
        <span style={{ fontSize: 16, fontWeight: 800, color: '#fff', flex: 1 }}>{T.fee.title}</span>
      </div>

      {/* Warning */}
      <div style={{ background: 'linear-gradient(135deg,#FFF3E0,#FFE8C0)', borderBottom: '1px solid #FFB74D', padding: '10px 16px', fontSize: 12, color: '#E65100', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 500, flexShrink: 0 }}>
        {T.fee.warning}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 100 }}>
        {/* Order Summary */}
        <div style={{ background: '#fff', margin: '14px 14px 0', borderRadius: 18, padding: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: 12, color: '#9AA5BE', marginBottom: 8 }}>{T.fee.orderSummary}</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#1A1A2E', marginBottom: 14 }}>
            {lang === 'zh' ? '全身按摩 60分鐘 · Nana' : lang === 'en' ? 'Full Body 60min · Nana' : 'นวดทั้งตัว 60 น. · นานา'}
          </div>
          <div style={{ display: 'flex', paddingTop: 14, borderTop: '1px solid #f5f5f5' }}>
            {[
              { v: '19:00', l: lang === 'zh' ? '開始時間' : 'Start Time' },
              { v: '20:00', l: lang === 'zh' ? '結束時間' : 'End Time' },
              { v: lang === 'zh' ? '已完成' : 'Done', l: lang === 'zh' ? '狀態' : 'Status' },
            ].map((it, i) => (
              <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1A2E' }}>{it.v}</div>
                <div style={{ fontSize: 11, color: '#9AA5BE', marginTop: 3 }}>{it.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Fee Calculation */}
        <div style={{ background: '#fff', margin: '10px 14px 0', borderRadius: 18, padding: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 800, color: '#1A1A2E', marginBottom: 14 }}>
            <span style={{ width: 3, height: 15, background: 'linear-gradient(180deg,#FF4D1A,#FF9A6C)', borderRadius: 2, display: 'inline-block' }} />
            {T.fee.feeCalc}
          </div>
          {[
            { label: T.fee.clientAmount, value: formatLAK(clientAmount), color: '#1A1A2E' },
            { label: `${T.fee.feeRate} (${feeRate}%)`, value: `× ${feeRate}%`, color: '#FF4D1A' },
          ].map((row, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F7F8FC' }}>
              <span style={{ fontSize: 13, color: '#6B7A99' }}>{row.label}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: row.color }}>{row.value}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, marginTop: 6, borderTop: '2px solid #F0F1F5' }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#1A1A2E' }}>{T.fee.feeAmount}</span>
            <span style={{ fontSize: 22, fontWeight: 800, color: '#FF4D1A' }}>{formatLAK(feeAmount)}</span>
          </div>
          <div style={{ marginTop: 12, background: 'linear-gradient(135deg,#FFF8F6,#FFF0EB)', border: '2px solid rgba(255,77,26,0.2)', borderRadius: 14, padding: 14, textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: '#9AA5BE', marginBottom: 4 }}>
              {lang === 'zh' ? '需轉帳金額' : lang === 'en' ? 'Amount to Transfer' : 'ยอดโอนเงิน'}
            </div>
            <div style={{ fontSize: 32, fontWeight: 900, color: '#FF4D1A' }}>{formatLAK(feeAmount)}</div>
          </div>
        </div>

        {/* Bank Info */}
        <div style={{ background: '#fff', margin: '10px 14px 0', borderRadius: 18, padding: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 800, color: '#1A1A2E', marginBottom: 14 }}>
            <span style={{ width: 3, height: 15, background: 'linear-gradient(180deg,#1890FF,#40A9FF)', borderRadius: 2, display: 'inline-block' }} />
            {T.fee.transferTo}
          </div>
          <div style={{ background: '#F9FAFB', borderRadius: 14, padding: 14, border: '1px solid #f0f0f0' }}>
            {[
              { k: T.fee.bankName, v: BANK_INFO.bank, copyKey: 'bank' },
              { k: T.fee.accountName, v: BANK_INFO.accountName, copyKey: 'name' },
              { k: T.fee.accountNumber, v: BANK_INFO.accountNumber, copyKey: 'number' },
            ].map(row => (
              <div key={row.copyKey} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid #F0F1F5' }}>
                <span style={{ fontSize: 12, color: '#9AA5BE' }}>{row.k}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#1A1A2E', display: 'flex', alignItems: 'center', gap: 8 }}>
                  {row.v}
                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleCopy(row.v, row.copyKey)} style={{ fontSize: 10, background: copied === row.copyKey ? '#52C41A' : '#fff', color: copied === row.copyKey ? '#fff' : '#666', border: '1px solid #e8e8e8', padding: '3px 8px', borderRadius: 6, cursor: 'pointer', transition: 'all 0.2s' }}>
                    {copied === row.copyKey ? '✓' : T.fee.copy}
                  </motion.button>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Upload Proof */}
        <div style={{ background: '#fff', margin: '10px 14px 0', borderRadius: 18, padding: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 800, color: '#1A1A2E', marginBottom: 14 }}>
            <span style={{ width: 3, height: 15, background: 'linear-gradient(180deg,#52C41A,#73D13D)', borderRadius: 2, display: 'inline-block' }} />
            {T.fee.uploadProof}
          </div>
          <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={() => setUploaded(true)}
            style={{ border: `2px dashed ${uploaded ? '#52C41A' : '#FFD4C2'}`, borderRadius: 14, padding: 28, textAlign: 'center', cursor: 'pointer', background: uploaded ? '#F0FFF4' : '#FFFAF8' }}
          >
            {uploaded ? (
              <>
                <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
                <div style={{ fontSize: 14, color: '#065F46', fontWeight: 700 }}>
                  {lang === 'zh' ? '截圖已上傳' : lang === 'en' ? 'Screenshot uploaded' : 'อัปโหลดแล้ว'}
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 32, marginBottom: 8 }}>📸</div>
                <div style={{ fontSize: 14, color: '#666', fontWeight: 500 }}>{T.fee.uploadHint}</div>
                <div style={{ fontSize: 11, color: '#bbb', marginTop: 4 }}>{T.fee.uploadFormats}</div>
              </>
            )}
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: '#fff', padding: '14px 16px 24px', borderTop: '1px solid #F0F1F5', boxShadow: '0 -4px 20px rgba(0,0,0,0.06)', flexShrink: 0 }}>
        <div style={{ fontSize: 11, color: '#FF4D4F', textAlign: 'center', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
          ⚠️ {T.fee.warning}
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSubmit}
          disabled={!uploaded}
          style={{ width: '100%', background: uploaded ? 'linear-gradient(135deg,#FF4D1A,#FF6B3D)' : '#eee', color: uploaded ? '#fff' : '#999', border: 'none', borderRadius: 18, padding: 15, fontSize: 15, fontWeight: 800, cursor: uploaded ? 'pointer' : 'not-allowed', boxShadow: uploaded ? '0 6px 22px rgba(255,77,26,0.32)' : 'none' }}
        >
          {T.fee.submit}
        </motion.button>
      </div>
    </div>
  );
}

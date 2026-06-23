import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import BottomNav from '../../components/BottomNav';

export default function UserProfile() {
  const { T, lang, setUserMode } = useApp();
  const navigate = useNavigate();

  return (
    <div style={{ background: '#F7F8FC', display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 20px', fontSize: 11, background: '#fff', flexShrink: 0, color: '#888' }}>
        <span style={{ fontWeight: 800, fontSize: 13, color: '#1a1a2e' }}>{new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}</span>
        <span>▲ 📶 🔋</span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }}>
        {/* Profile Hero */}
        <div style={{ background: 'linear-gradient(160deg,#1A0A00 0%,#FF4D1A 45%,#FFAA5C 100%)', padding: '28px 20px 36px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 38, border: '3px solid rgba(255,255,255,0.4)', margin: '0 auto 12px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>😊</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>
            {lang === 'zh' ? '李小姐' : lang === 'en' ? 'Ms. Li' : 'คุณหลี่'}
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>
            📍 {T.location}
          </div>
        </div>

        {/* Mode Switch */}
        <div style={{ background: '#fff', margin: '14px 14px 0', borderRadius: 18, padding: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1A2E', marginBottom: 12 }}>
            {lang === 'zh' ? '切換模式（演示用）' : lang === 'en' ? 'Switch Mode (Demo)' : 'เปลี่ยนโหมด (ตัวอย่าง)'}
          </div>
          {[
            { mode: 'user', icon: '👤', label: { zh: '用戶模式', en: 'User Mode', th: 'โหมดผู้ใช้' }, path: '/' },
            { mode: 'therapist', icon: '💆', label: { zh: '技師模式', en: 'Therapist Mode', th: 'โหมดนักนวด' }, path: '/therapist' },
            { mode: 'admin', icon: '⚙️', label: { zh: '管理後台', en: 'Admin Dashboard', th: 'แดชบอร์ดแอดมิน' }, path: '/admin' },
          ].map(m => (
            <motion.button
              key={m.mode}
              whileTap={{ scale: 0.97 }}
              onClick={() => { setUserMode(m.mode); navigate(m.path); }}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 12, border: '1.5px solid #EAECF0', background: '#fff', cursor: 'pointer', marginBottom: 8, textAlign: 'left' }}
            >
              <span style={{ fontSize: 20 }}>{m.icon}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#1A1A2E' }}>{m.label[lang]}</span>
              <span style={{ marginLeft: 'auto', color: '#9AA5BE' }}>›</span>
            </motion.button>
          ))}
        </div>

        {/* Info */}
        <div style={{ background: '#fff', margin: '10px 14px 0', borderRadius: 18, padding: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1A2E', marginBottom: 12 }}>
            {lang === 'zh' ? '帳戶資訊' : lang === 'en' ? 'Account Info' : 'ข้อมูลบัญชี'}
          </div>
          {[
            { icon: '📞', label: lang === 'zh' ? '電話' : lang === 'en' ? 'Phone' : 'โทรศัพท์', val: '+856 20-5555-1234' },
            { icon: '📍', label: lang === 'zh' ? '城市' : lang === 'en' ? 'City' : 'เมือง', val: 'Vientiane, Laos 🇱🇦' },
            { icon: '📅', label: lang === 'zh' ? '加入時間' : lang === 'en' ? 'Joined' : 'เข้าร่วม', val: 'June 2026' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #F7F8FC' }}>
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              <div>
                <div style={{ fontSize: 11, color: '#9AA5BE' }}>{item.label}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1A2E' }}>{item.val}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

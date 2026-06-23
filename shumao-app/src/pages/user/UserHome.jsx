import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { THERAPISTS, formatLAK } from '../../data';
import BottomNav from '../../components/BottomNav';

const BANNER_COLORS = [
  'linear-gradient(160deg,#FF4D1A 0%,#FF6B3D 50%,#FFB085 100%)',
  'linear-gradient(160deg,#1a6b3a 0%,#2d9b57 50%,#4BC97A 100%)',
  'linear-gradient(160deg,#2D3A4A 0%,#3A4D63 50%,#4A6180 100%)',
];
const BANNER_CTAS = ['#FF4D1A', '#1a6b3a', '#2D3A4A'];
const BANNER_DECO = ['💆‍♀️', '🌿', '⭐'];

const CAT_ITEMS = [
  { icon: '💆', colorClass: 'ci1', key: 'fullBody' },
  { icon: '🧘', colorClass: 'ci3', key: 'thai' },
  { icon: '🌿', colorClass: 'ci5', key: 'oil' },
  { icon: '🤰', colorClass: 'ci6', key: 'pregnant' },
  { icon: '🦶', colorClass: 'ci4', key: 'foot' },
  { icon: '💪', colorClass: 'ci2', key: 'neck' },
  { icon: '🤱', colorClass: 'ci7', key: 'postpartum' },
  { icon: '👴', colorClass: 'ci8', key: 'senior' },
];

const CAT_GRADIENTS = {
  ci1: 'linear-gradient(140deg,#FFEEE8,#FFD9CB)',
  ci2: 'linear-gradient(140deg,#E8F3FF,#CEDFFF)',
  ci3: 'linear-gradient(140deg,#E8FFEE,#CBFFDA)',
  ci4: 'linear-gradient(140deg,#FFF8E1,#FFEDB0)',
  ci5: 'linear-gradient(140deg,#F3E8FF,#E3CBFF)',
  ci6: 'linear-gradient(140deg,#FFE4F0,#FFCCE0)',
  ci7: 'linear-gradient(140deg,#E8FAF5,#CBFAE8)',
  ci8: 'linear-gradient(140deg,#FFF4E0,#FFE5B0)',
};

function Banner({ T, lang }) {
  const [idx, setIdx] = useState(0);
  const banners = T.banners;

  useEffect(() => {
    const timer = setInterval(() => setIdx(i => (i + 1) % banners.length), 3500);
    return () => clearInterval(timer);
  }, [banners.length]);

  return (
    <div className="relative overflow-hidden" style={{ flexShrink: 0 }}>
      <div style={{ display: 'flex', transition: 'transform .45s cubic-bezier(.25,.8,.25,1)', transform: `translateX(-${idx * 100}%)` }}>
        {banners.map((b, i) => (
          <div key={i} style={{ minWidth: '100%', height: 150, position: 'relative', background: BANNER_COLORS[i], overflow: 'hidden', flexShrink: 0 }}>
            <div style={{ position: 'absolute', right: -15, bottom: -20, fontSize: 100, opacity: .15, pointerEvents: 'none', filter: 'blur(1px)' }}>{BANNER_DECO[i]}</div>
            <div style={{ position: 'relative', zIndex: 2, padding: '16px 20px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <span style={{ alignSelf: 'flex-start', fontSize: 9, fontWeight: 800, background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(8px)', color: '#fff', padding: '3px 10px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.3)', letterSpacing: '.8px', textTransform: 'uppercase' }}>
                {b.tag}
              </span>
              <div>
                <div style={{ fontSize: 18, fontWeight: 900, color: '#fff', lineHeight: 1.25, whiteSpace: 'pre-line' }}>{b.title}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)', marginTop: 3 }}>{b.sub}</div>
              </div>
              <button style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.95)', color: BANNER_CTAS[i], fontSize: 11, fontWeight: 800, padding: '6px 16px', borderRadius: 20, border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(0,0,0,0.15)' }}>
                {b.cta}
              </button>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 5, padding: '8px 0', background: '#F7F8FC' }}>
        {banners.map((_, i) => (
          <span key={i} onClick={() => setIdx(i)} style={{ width: idx === i ? 16 : 5, height: 5, borderRadius: 3, background: idx === i ? '#FF4D1A' : 'rgba(0,0,0,0.12)', cursor: 'pointer', transition: 'all .3s', display: 'inline-block' }} />
        ))}
      </div>
    </div>
  );
}

function TherapistCard({ therapist, lang, T, onBook }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, boxShadow: '0 8px 32px rgba(0,0,0,0.10)' }}
      style={{ background: '#fff', borderRadius: 24, overflow: 'hidden', marginBottom: 14, boxShadow: '0 2px 16px rgba(0,0,0,0.06)', cursor: 'pointer' }}
    >
      {/* Image Area */}
      <div style={{ height: 148, background: 'linear-gradient(145deg,#fde8d8,#f0d3bd)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 54, position: 'relative' }}>
        {therapist.featured && (
          <span style={{ position: 'absolute', top: 10, left: 10, background: 'linear-gradient(135deg,#FF4D1A,#FF6B3D)', color: '#fff', fontSize: 9, fontWeight: 800, padding: '4px 10px', borderRadius: 20, boxShadow: '0 3px 10px rgba(255,77,26,0.35)', letterSpacing: '.5px', textTransform: 'uppercase' }}>
            ⭐ {T.featured}
          </span>
        )}
        <span style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.42)', backdropFilter: 'blur(12px)', color: '#fff', fontSize: 10, padding: '4px 10px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: therapist.available ? '#52C41A' : '#ccc', boxShadow: therapist.available ? '0 0 8px rgba(82,196,26,0.6)' : 'none', animation: therapist.available ? 'blink 2s infinite' : 'none', display: 'inline-block' }} />
          {therapist.available ? T.available : '已滿'}
        </span>
        {therapist.emoji}
      </div>
      {/* Body */}
      <div style={{ padding: '14px 16px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#1A1A2E', letterSpacing: '-.2px' }}>{therapist.name[lang]}</div>
          <div style={{ fontSize: 15, fontWeight: 900, color: '#FF4D1A' }}>{formatLAK(therapist.price)}<small style={{ fontSize: 10, fontWeight: 500, color: '#9AA5BE' }}>{T.booking?.perSession}</small></div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: '#F59E0B', fontWeight: 700, marginTop: 3 }}>
          {'★'.repeat(5)} <span style={{ color: '#9AA5BE', fontWeight: 500, fontSize: 10 }}>({therapist.reviews})</span>
          <span style={{ marginLeft: 6, color: '#9AA5BE', fontSize: 10 }}>📍 {therapist.distance}</span>
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
          {(therapist.tags[lang] || therapist.tags.zh).map(tag => (
            <span key={tag} style={{ background: '#FFF2EE', color: '#FF6B3D', fontSize: 10, padding: '3px 10px', borderRadius: 20, fontWeight: 600, border: '1px solid rgba(255,107,61,0.12)' }}>{tag}</span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button style={{ flex: 1, border: '1.5px solid #FF4D1A', background: 'transparent', color: '#FF4D1A', borderRadius: 12, padding: '10px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
            {T.viewProfile}
          </button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onBook(therapist)}
            disabled={!therapist.available}
            style={{ flex: 2, background: therapist.available ? 'linear-gradient(135deg,#FF4D1A,#FF6B3D)' : '#eee', color: therapist.available ? '#fff' : '#999', border: 'none', borderRadius: 12, padding: '10px', fontSize: 13, fontWeight: 800, cursor: therapist.available ? 'pointer' : 'not-allowed', boxShadow: therapist.available ? '0 4px 14px rgba(255,77,26,0.3)' : 'none' }}
          >
            {T.bookNow}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default function UserHome() {
  const { T, lang, getGreeting } = useApp();
  const navigate = useNavigate();

  const handleBook = (therapist) => {
    navigate(`/book/${therapist.id}`);
  };

  return (
    <div style={{ background: '#F7F8FC', display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      {/* Status bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 20px 4px', fontSize: 11, color: '#888', background: '#fff', flexShrink: 0 }}>
        <span style={{ fontWeight: 800, fontSize: 13, color: '#1a1a2e' }}>{new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}</span>
        <span style={{ display: 'flex', gap: 4, alignItems: 'center', fontSize: 10 }}>▲ 📶 🔋</span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {/* Hero */}
        <div style={{ background: 'linear-gradient(160deg,#1A0A00 0%,#FF4D1A 45%,#FF6B3D 75%,#FFAA5C 100%)', padding: '16px 20px 20px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', bottom: -40, right: -60, width: 220, height: 220, background: 'rgba(255,255,255,0.07)', borderRadius: '50%', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: -80, left: -80, width: 240, height: 240, background: 'rgba(255,255,255,0.04)', borderRadius: '50%', pointerEvents: 'none' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 0, position: 'relative', zIndex: 1 }}>
            <div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{getGreeting()}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginTop: 2, letterSpacing: '-.3px' }}>
                {lang === 'zh' ? '李小姐' : lang === 'en' ? 'Ms. Li' : 'คุณหลี่'}
              </div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.65)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
                📍 {T.location}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ position: 'relative', fontSize: 22 }}>
                🔔
                <span style={{ width: 8, height: 8, background: '#fff', borderRadius: '50%', position: 'absolute', top: 0, right: 0, border: '1.5px solid #FF4D1A', display: 'inline-block' }} />
              </div>
              <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19, border: '2px solid rgba(255,255,255,0.35)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>😊</div>
            </div>
          </div>
        </div>

        {/* Banner */}
        <Banner T={T} lang={lang} />

        {/* Categories */}
        <div style={{ margin: '12px 12px 0', background: '#fff', borderRadius: 18, padding: '16px 14px 10px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#1A1A2E', marginBottom: 14 }}>
            {lang === 'zh' ? '服務項目' : lang === 'en' ? 'Services' : 'บริการ'}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
            {CAT_ITEMS.map(c => (
              <motion.div key={c.key} whileTap={{ scale: 0.92 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, cursor: 'pointer' }} onClick={() => navigate(`/book/1`)}>
                <div style={{ width: 58, height: 58, borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, background: CAT_GRADIENTS[c.colorClass], boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>{c.icon}</div>
                <span style={{ fontSize: 10, fontWeight: 600, color: '#6B7A99', textAlign: 'center', lineHeight: 1.3 }}>{T.services[c.key]}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Nearby Therapists */}
        <div style={{ padding: '16px 12px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#1A1A2E' }}>{T.nearbyTherapists}</div>
            <span style={{ fontSize: 12, color: '#FF4D1A', fontWeight: 600, cursor: 'pointer' }}>{T.seeAll}</span>
          </div>
          {THERAPISTS.map((therapist, i) => (
            <motion.div key={therapist.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <TherapistCard therapist={therapist} lang={lang} T={T} onBook={handleBook} />
            </motion.div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

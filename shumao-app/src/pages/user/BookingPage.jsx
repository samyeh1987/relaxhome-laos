import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { THERAPISTS, SERVICES, TIME_SLOTS, formatLAK } from '../../data';

export default function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { T, lang, setCart } = useApp();

  const therapist = THERAPISTS.find(t => t.id === Number(id)) || THERAPISTS[0];
  const [selectedService, setSelectedService] = useState(SERVICES[0].id);
  const [selectedTime, setSelectedTime] = useState('');
  const [address, setAddress] = useState('Ban Dong Rd, Xaysettha, Vientiane');

  const service = SERVICES.find(s => s.id === selectedService);

  const handleConfirm = () => {
    setCart({ therapist, service, time: selectedTime, address, price: service.price });
    navigate('/order');
  };

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
        <span style={{ fontSize: 16, fontWeight: 800, color: '#1A1A2E', flex: 1 }}>{T.booking.title}</span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 100 }}>
        {/* Therapist Hero */}
        <div style={{ background: 'linear-gradient(160deg,#1A0A00 0%,#FF4D1A 50%,#FF9A6C 100%)', padding: 20, display: 'flex', gap: 16, alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -10, bottom: -20, fontSize: 80, opacity: .12, pointerEvents: 'none' }}>💆‍♀️</div>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34, flexShrink: 0, border: '2px solid rgba(255,255,255,0.3)', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
            {therapist.emoji}
          </div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>{therapist.name[lang]}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
              <span style={{ color: '#FFD700', fontSize: 12 }}>★★★★★</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{therapist.rating}</span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)' }}>({therapist.reviews})</span>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
              {(therapist.tags[lang] || therapist.tags.zh).map(tag => (
                <span key={tag} style={{ fontSize: 10, fontWeight: 600, background: 'rgba(255,255,255,0.2)', color: '#fff', padding: '3px 10px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.25)' }}>{tag}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Select Service */}
        <div style={{ background: '#fff', margin: '10px 14px 0', borderRadius: 18, padding: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 800, color: '#1A1A2E', marginBottom: 14 }}>
            <span style={{ width: 3, height: 15, background: 'linear-gradient(180deg,#FF4D1A,#FF9A6C)', borderRadius: 2, display: 'inline-block' }} />
            {T.booking.selectService}
          </div>
          {SERVICES.map(svc => (
            <motion.div
              key={svc.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedService(svc.id)}
              style={{
                border: `2px solid ${selectedService === svc.id ? '#FF4D1A' : '#F0F1F5'}`,
                borderRadius: 14, padding: '13px 14px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', marginBottom: 9, transition: 'all .2s',
                background: selectedService === svc.id ? 'linear-gradient(135deg,#FFF8F6,#FFEEE8)' : '#fff',
                boxShadow: selectedService === svc.id ? '0 4px 14px rgba(255,77,26,0.1)' : 'none',
              }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 12, background: `linear-gradient(135deg,${svc.color.replace('from-[','').replace(']','').replace(' to-[','').replace(']','')})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{svc.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1A2E' }}>{T.services[svc.nameKey]} · {svc.duration}{T.booking.min}</div>
                <div style={{ fontSize: 11, color: '#6B7A99', marginTop: 2 }}>{svc.duration}{T.booking.min}</div>
              </div>
              <div style={{ fontSize: 15, fontWeight: 900, color: '#FF4D1A', flexShrink: 0 }}>{formatLAK(svc.price)}</div>
              <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${selectedService === svc.id ? 'transparent' : '#ddd'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: selectedService === svc.id ? 'linear-gradient(135deg,#FF4D1A,#FF6B3D)' : 'transparent' }}>
                {selectedService === svc.id && <span style={{ fontSize: 10, color: '#fff', fontWeight: 800 }}>✓</span>}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Select Time */}
        <div style={{ background: '#fff', margin: '10px 14px 0', borderRadius: 18, padding: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 800, color: '#1A1A2E', marginBottom: 14 }}>
            <span style={{ width: 3, height: 15, background: 'linear-gradient(180deg,#FF4D1A,#FF9A6C)', borderRadius: 2, display: 'inline-block' }} />
            {T.booking.selectTime}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 9 }}>
            {TIME_SLOTS.map(slot => (
              <motion.button
                key={slot}
                whileTap={{ scale: 0.92 }}
                onClick={() => setSelectedTime(slot)}
                style={{
                  border: `1.5px solid ${selectedTime === slot ? '#FF4D1A' : '#EAECF0'}`,
                  borderRadius: 11, padding: '10px 4px', textAlign: 'center', cursor: 'pointer',
                  fontSize: 12, fontWeight: 600, transition: 'all .2s',
                  background: selectedTime === slot ? 'linear-gradient(135deg,#FF4D1A,#FF6B3D)' : '#fff',
                  color: selectedTime === slot ? '#fff' : '#6B7A99',
                  boxShadow: selectedTime === slot ? '0 4px 14px rgba(255,77,26,0.25)' : 'none',
                }}
              >
                {slot}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Address */}
        <div style={{ background: '#fff', margin: '10px 14px 0', borderRadius: 18, padding: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 800, color: '#1A1A2E', marginBottom: 14 }}>
            <span style={{ width: 3, height: 15, background: 'linear-gradient(180deg,#FF4D1A,#FF9A6C)', borderRadius: 2, display: 'inline-block' }} />
            {T.booking.address}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#F7F8FC', borderRadius: 12, padding: '12px 14px', border: '1.5px solid #EAECF0', cursor: 'pointer' }}>
            <span style={{ fontSize: 20 }}>📍</span>
            <input
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder={T.booking.enterAddress}
              style={{ flex: 1, fontSize: 13, color: '#1A1A2E', fontWeight: 500, border: 'none', background: 'transparent', outline: 'none' }}
            />
          </div>
        </div>

        {/* Payment Notice */}
        <div style={{ margin: '10px 14px 0', background: 'linear-gradient(135deg,#FFFBF0,#FFF5D9)', border: '1.5px solid rgba(245,158,11,0.25)', borderRadius: 14, padding: '14px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 800, color: '#92400E', marginBottom: 7 }}>
            {T.booking.paymentNote}
          </div>
          <p style={{ fontSize: 11, color: '#78350F', lineHeight: 1.8 }} dangerouslySetInnerHTML={{ __html: T.booking.paymentDesc }} />
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: '#fff', padding: '14px 16px 24px', borderTop: '1px solid #F0F1F5', boxShadow: '0 -4px 20px rgba(0,0,0,0.06)', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 11, color: '#6B7A99' }}>{T.booking.totalPayable}</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#FF4D1A', letterSpacing: '-.5px' }}>
              {service ? formatLAK(service.price) : '—'}
            </div>
          </div>
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleConfirm}
          disabled={!selectedTime}
          style={{
            width: '100%', background: selectedTime ? 'linear-gradient(135deg,#FF4D1A,#FF6B3D)' : '#eee',
            color: selectedTime ? '#fff' : '#999', border: 'none', borderRadius: 18, padding: 15,
            fontSize: 15, fontWeight: 800, cursor: selectedTime ? 'pointer' : 'not-allowed',
            boxShadow: selectedTime ? '0 6px 22px rgba(255,77,26,0.32)' : 'none',
          }}
        >
          {T.booking.confirmBooking}
        </motion.button>
      </div>
    </div>
  );
}

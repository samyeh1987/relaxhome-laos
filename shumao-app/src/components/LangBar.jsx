import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

export default function LangBar() {
  const { lang, setLang } = useApp();
  const langs = [
    { code: 'zh', label: '中文' },
    { code: 'en', label: 'English' },
    { code: 'th', label: 'ภาษาไทย' },
  ];

  return (
    <div className="flex items-center gap-2 px-4 py-2 border-b"
      style={{ background: 'linear-gradient(135deg,#0a0a0f,#16091a)', borderColor: 'rgba(255,107,61,0.15)' }}>
      <span className="text-xs mr-1" style={{ color: 'rgba(255,255,255,0.4)' }}>🌐</span>
      {langs.map(l => (
        <motion.button
          key={l.code}
          whileTap={{ scale: 0.93 }}
          onClick={() => setLang(l.code)}
          className="text-xs font-bold px-3 py-1 rounded-full border transition-all"
          style={lang === l.code ? {
            background: 'linear-gradient(135deg,#FF4D1A,#FF6B3D)',
            borderColor: 'transparent',
            color: '#fff',
            boxShadow: '0 2px 12px rgba(255,77,26,0.4)',
          } : {
            background: 'transparent',
            borderColor: 'rgba(255,107,61,0.3)',
            color: 'rgba(255,255,255,0.5)',
          }}
        >
          {l.label}
        </motion.button>
      ))}
      <span className="ml-auto text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
        📍 ວຽງຈັນ · Vientiane
      </span>
    </div>
  );
}

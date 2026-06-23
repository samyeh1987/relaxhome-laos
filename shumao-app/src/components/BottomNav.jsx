import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

const userTabs = [
  { path: '/', icon: '🏠', key: 'home' },
  { path: '/orders', icon: '📋', key: 'orders' },
  { path: '/profile', icon: '👤', key: 'profile' },
];

const therapistTabs = [
  { path: '/therapist', icon: '📱', key: 'receiveOrders' },
  { path: '/therapist/income', icon: '💰', key: 'income' },
  { path: '/therapist/fee', icon: '💳', key: 'fee' },
];

const adminTabs = [
  { path: '/admin', icon: '📊', key: 'dashboard' },
  { path: '/admin/shops', icon: '🏪', key: 'shops' },
  { path: '/admin/rates', icon: '⚙️', key: 'feeRates' },
];

export default function BottomNav() {
  const { T, userMode } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = userMode === 'admin' ? adminTabs
    : userMode === 'therapist' ? therapistTabs
    : userTabs;

  return (
    <div className="flex border-t bg-white pb-safe" style={{ borderColor: '#F0F1F5', paddingBottom: 'env(safe-area-inset-bottom,14px)' }}>
      {tabs.map(tab => {
        const isActive = location.pathname === tab.path;
        return (
          <motion.button
            key={tab.path}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(tab.path)}
            className="flex-1 flex flex-col items-center gap-1 pt-2 pb-1 text-[9px] font-semibold tracking-wide border-none bg-transparent cursor-pointer transition-colors"
            style={{ color: isActive ? '#FF4D1A' : '#C8CDD9' }}
          >
            <span className="text-xl leading-none">{tab.icon}</span>
            {T.nav[tab.key]}
          </motion.button>
        );
      })}
    </div>
  );
}

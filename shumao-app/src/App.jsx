import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import LangBar from './components/LangBar';
import UserHome from './pages/user/UserHome';
import BookingPage from './pages/user/BookingPage';
import OrderTracking from './pages/user/OrderTracking';
import OrderList from './pages/user/OrderList';
import UserProfile from './pages/user/UserProfile';
import TherapistHome from './pages/therapist/TherapistHome';
import FeePayment from './pages/therapist/FeePayment';
import AdminDashboard from './pages/admin/AdminDashboard';

function AppTopBar() {
  return (
    <div style={{ background: '#0a0a0f', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid rgba(255,107,61,0.08)' }}>
      <span style={{ fontSize: 17, fontWeight: 900, background: 'linear-gradient(135deg,#FF6B3D,#FFAA5C)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        🛎️ 舒摩到家 · RelaxHome
      </span>
      <span style={{ background: 'rgba(255,107,61,0.12)', color: '#FF6B3D', fontSize: 9, fontWeight: 800, padding: '3px 9px', borderRadius: 20, border: '1px solid rgba(255,107,61,0.2)', letterSpacing: '.8px', textTransform: 'uppercase' }}>
        MVP v1.0
      </span>
      <span style={{ marginLeft: 'auto', fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>🇱🇦 Vientiane Demo</span>
    </div>
  );
}

function PhoneShell() {
  return (
    <div style={{
      width: 375,
      minHeight: 780,
      background: '#F7F8FC',
      borderRadius: 50,
      boxShadow: '0 0 0 2px #2a2a3e, 0 0 0 4px #1a1a2e, 0 0 0 6px rgba(255,107,61,0.12), 0 24px 80px rgba(0,0,0,0.6)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Notch */}
      <div style={{ width: 120, height: 28, background: '#1a1a2e', borderRadius: '0 0 20px 20px', margin: '0 auto', flexShrink: 0, zIndex: 10 }} />
      {/* Screen */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/" element={<UserHome />} />
          <Route path="/book/:id" element={<BookingPage />} />
          <Route path="/order" element={<OrderTracking />} />
          <Route path="/orders" element={<OrderList />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/therapist" element={<TherapistHome />} />
          <Route path="/therapist/fee" element={<FeePayment />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/shops" element={<AdminDashboard />} />
          <Route path="/admin/rates" element={<AdminDashboard />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', flexDirection: 'column' }}>
          <LangBar />
          <AppTopBar />
          <div style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            padding: '24px 16px 40px',
            overflowX: 'auto',
          }}>
            <PhoneShell />
          </div>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}

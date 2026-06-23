import { createContext, useContext, useState, useCallback } from 'react';
import { translations } from '../i18n';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [lang, setLang] = useState('zh');
  const [userMode, setUserMode] = useState('user'); // 'user' | 'therapist' | 'admin'
  const [cart, setCart] = useState(null); // 當前預約信息
  const [isReceiving, setIsReceiving] = useState(true); // 技師接單開關

  const t = useCallback((key) => {
    const keys = key.split('.');
    let val = translations[lang];
    for (const k of keys) {
      val = val?.[k];
    }
    return val ?? key;
  }, [lang]);

  const T = translations[lang]; // 直接取整個語言包

  const getGreeting = useCallback(() => {
    const h = new Date().getHours();
    if (h < 12) return T.greeting.morning;
    if (h < 17) return T.greeting.afternoon;
    return T.greeting.evening;
  }, [T]);

  return (
    <AppContext.Provider value={{ lang, setLang, userMode, setUserMode, T, t, getGreeting, cart, setCart, isReceiving, setIsReceiving }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);

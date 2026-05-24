import { useEffect } from 'react';

export const useTelegram = () => {
  const tg = window.Telegram?.WebApp;
  
  useEffect(() => {
    if (tg) {
      tg.ready();
      tg.expand();
      tg.setHeaderColor('#0d0d14');
      tg.setBackgroundColor('#0d0d14');
    }
  }, []);
  
  return {
    tg,
    user: tg?.initDataUnsafe?.user,
    isExpanded: tg?.isExpanded,
    colorScheme: tg?.colorScheme || 'dark',
    haptic: {
      impact: (style = 'medium') => tg?.HapticFeedback?.impactOccurred(style),
      notification: (type = 'success') => tg?.HapticFeedback?.notificationOccurred(type),
      selection: () => tg?.HapticFeedback?.selectionChanged(),
    }
  };
};

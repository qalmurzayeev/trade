import { useStore } from '../store/index.js';
import { useTelegram } from '../hooks/useTelegram.js';

const tabs = [
  { id: 'home', icon: '🏠', label: 'Главная' },
  { id: 'courses', icon: '📚', label: 'Курсы' },
  { id: 'progress', icon: '📈', label: 'Прогресс' },
  { id: 'profile', icon: '👤', label: 'Профиль' },
];

export default function BottomNav() {
  const { activeTab, setActiveTab } = useStore();
  const { haptic } = useTelegram();

  const handleTab = (id) => {
    haptic.selection();
    setActiveTab(id);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 pb-safe z-50"
      style={{ background: 'rgba(13,13,20,0.95)', borderTop: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)' }}>
      <div className="flex items-center justify-around px-2 pt-2 pb-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => handleTab(tab.id)}
            className="flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all duration-200 min-w-0"
            style={{
              background: activeTab === tab.id ? 'rgba(244,63,94,0.12)' : 'transparent',
            }}
          >
            <span className="text-xl leading-none" style={{
              filter: activeTab === tab.id ? 'none' : 'grayscale(0.8) opacity(0.5)',
              transform: activeTab === tab.id ? 'scale(1.1)' : 'scale(1)',
              transition: 'transform 0.2s ease'
            }}>
              {tab.icon}
            </span>
            <span className="text-xs font-medium" style={{
              color: activeTab === tab.id ? '#f43f5e' : 'var(--text-muted)',
              transition: 'color 0.2s ease'
            }}>
              {tab.label}
            </span>
            {activeTab === tab.id && (
              <div className="w-1 h-1 rounded-full" style={{ background: 'linear-gradient(135deg, #f43f5e, #8b5cf6)' }} />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}

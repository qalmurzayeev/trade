import { useState } from 'react';
import { useStore } from '../store/index.js';
import AdminPanel from './AdminPanel.jsx';

const INFO_ITEMS = [
  { key: 'full_name', icon: '👤', label: 'Имя' },
  { key: 'age', icon: '🎂', label: 'Возраст' },
  { key: 'city', icon: '📍', label: 'Город' },
  { key: 'monthly_income', icon: '💰', label: 'Доход' },
];

export default function ProfilePage() {
  const { user } = useStore();
  const [showAdmin, setShowAdmin] = useState(false);

  if (showAdmin) {
    return <AdminPanel onBack={() => setShowAdmin(false)} />;
  }

  return (
    <div className="flex flex-col gap-6 px-5 pt-6 pb-24">
      {/* Header */}
      <div className="flex flex-col items-center gap-4 pt-4">
        {user?.telegram_photo_url ? (
          <img src={user.telegram_photo_url} alt="avatar" className="w-24 h-24 rounded-full object-cover ring-4 ring-rose-500/30" />
        ) : (
          <div className="w-24 h-24 rounded-full flex items-center justify-center text-4xl ring-4"
            style={{ background: 'linear-gradient(135deg, #f43f5e, #8b5cf6)', ringColor: 'rgba(244,63,94,0.3)' }}>
            {(user?.full_name || user?.telegram_first_name || 'U')[0].toUpperCase()}
          </div>
        )}
        
        <div className="text-center">
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {user?.full_name || `${user?.telegram_first_name || ''} ${user?.telegram_last_name || ''}`.trim()}
          </h1>
          {user?.telegram_username && (
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>@{user.telegram_username}</p>
          )}
          {user?.is_admin && (
            <span className="mt-2 inline-block text-xs px-3 py-1 rounded-full font-medium"
              style={{ background: 'linear-gradient(135deg, rgba(244,63,94,0.2), rgba(139,92,246,0.2))', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.3)' }}>
              ⚡ Администратор
            </span>
          )}
        </div>
      </div>

      {/* Info card */}
      <div className="glass-card overflow-hidden">
        <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Информация</h2>
        </div>
        {INFO_ITEMS.map((item, idx) => (
          <div key={item.key}
            className="px-5 py-4 flex items-center gap-4"
            style={{ borderBottom: idx < INFO_ITEMS.length - 1 ? '1px solid var(--border)' : 'none' }}>
            <span className="text-xl">{item.icon}</span>
            <div>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.label}</p>
              <p className="font-medium text-sm mt-0.5" style={{ color: user?.[item.key] ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                {user?.[item.key] || '—'}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Telegram info */}
      <div className="glass-card overflow-hidden">
        <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Telegram</h2>
        </div>
        <div className="px-5 py-4">
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Telegram ID</p>
          <p className="font-mono font-medium text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            {user?.telegram_id}
          </p>
        </div>
      </div>

      {/* Admin panel button */}
      {user?.is_admin && (
        <button className="btn-primary" onClick={() => setShowAdmin(true)}>
          ⚙️ Панель администратора
        </button>
      )}

      {/* Member since */}
      {user?.created_at && (
        <p className="text-center text-xs" style={{ color: 'var(--text-muted)' }}>
          Участник с {new Date(user.created_at).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      )}
    </div>
  );
}

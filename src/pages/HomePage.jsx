import { useEffect, useState } from 'react';
import { useStore } from '../store/index.js';
import { api } from '../utils/api.js';

const GREETINGS = ['Привет', 'Салем', 'Здравствуйте'];

export default function HomePage() {
  const { user, setActiveTab } = useStore();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const hour = new Date().getHours();
  const timeGreet =  'Академия Айгуль Жеңісбекқызы';

  useEffect(() => {
    api.getCourses().then(d => { setCourses(d.courses.slice(0, 3)); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const activeCourses = courses.filter(c => c.access_status === 'active');
  const displayName = user?.full_name?.split(' ')[0] || user?.telegram_first_name || 'Студент';

  return (
    <div className="flex flex-col gap-6 pb-6">
      {/* Header */}
      <div className="px-5 pt-6">
        <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>{timeGreet}</p>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          {displayName} <span className="text-2xl">👋</span>
        </h1>
        {user?.city && (
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>📍 {user.city}</p>
        )}
      </div>

      {/* Stats banner */}
      <div className="mx-5 rounded-3xl p-5 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #f43f5e 0%, #8b5cf6 100%)' }}>
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white, transparent 50%)' }} />
        <div className="relative z-10">
          <p className="text-white/70 text-sm mb-1">Активных курсов</p>
          <p className="text-white text-4xl font-bold">{activeCourses.length}</p>
          <p className="text-white/70 text-sm mt-2">
            {activeCourses.length > 0 ? 'Продолжайте обучение!' : 'Запишитесь на курс'}
          </p>
        </div>
        <div className="absolute right-4 bottom-4 text-5xl opacity-30">🎓</div>
      </div>

      {/* Quick actions */}
      <div className="px-5">
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: '📚', label: 'Все курсы', tab: 'courses', color: 'rgba(244,63,94,0.15)' },
            { icon: '📈', label: 'Мой прогресс', tab: 'progress', color: 'rgba(139,92,246,0.15)' },
          ].map(item => (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              className="glass-card p-4 flex flex-col gap-2 text-left transition-all duration-200 active:scale-95"
              style={{ background: item.color, border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* My courses */}
      {activeCourses.length > 0 && (
        <div className="px-5">
          <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Мои курсы</h2>
          <div className="flex flex-col gap-3">
            {activeCourses.map(course => (
              <button
                key={course.id}
                onClick={() => setActiveTab('courses')}
                className="glass-card flex items-center gap-4 p-4 text-left transition-all duration-200 active:scale-98 w-full"
              >
                <div className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0">
                  <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{course.title}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                    {course.module_count} модулей · {course.lesson_count} уроков
                  </p>
                  <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                    <div className="h-full rounded-full w-1/3" style={{ background: 'linear-gradient(90deg, #f43f5e, #8b5cf6)' }} />
                  </div>
                </div>
                <span style={{ color: 'var(--text-muted)' }}>›</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Available courses */}
      <div className="px-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Доступные курсы</h2>
          <button onClick={() => setActiveTab('courses')} style={{ color: '#f43f5e' }} className="text-sm font-medium">
            Все →
          </button>
        </div>
        
        {loading ? (
          <div className="flex flex-col gap-3">
            {[1,2].map(i => (
              <div key={i} className="glass-card h-20 shimmer-bg rounded-3xl" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {courses.slice(0, 2).map(course => (
              <div key={course.id} className="glass-card overflow-hidden">
                <div className="h-28 w-full overflow-hidden">
                  <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{course.title}</h3>
                  <p className="text-xs mt-1 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{course.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs px-2 py-1 rounded-full" style={{
                      background: course.access_status === 'active' ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.07)',
                      color: course.access_status === 'active' ? '#4ade80' : 'var(--text-muted)'
                    }}>
                      {course.access_status === 'active' ? '✓ Есть доступ' : '🔒 Нет доступа'}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {course.lesson_count} уроков
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

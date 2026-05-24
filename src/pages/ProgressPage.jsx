import { useEffect, useState } from 'react';
import { api } from '../utils/api.js';
import { useStore } from '../store/index.js';

export default function ProgressPage() {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setActiveTab } = useStore();

  useEffect(() => {
    api.getProgress().then(d => { setProgress(d.progress); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const totalLessons = progress.reduce((a, c) => a + parseInt(c.total_lessons || 0), 0);
  const totalCompleted = progress.reduce((a, c) => a + parseInt(c.completed_lessons || 0), 0);
  const overallPercent = totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0;

  return (
    <div className="flex flex-col gap-6 px-5 pt-6 pb-24">
      <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Мой прогресс</h1>

      {/* Overall stats */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Общий прогресс</p>
            <p className="text-3xl font-bold gradient-text mt-1">{overallPercent}%</p>
          </div>
          <div className="w-16 h-16 relative">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2.5" />
              <circle cx="18" cy="18" r="15.9" fill="none"
                stroke="url(#progressGrad)" strokeWidth="2.5"
                strokeDasharray={`${overallPercent} ${100 - overallPercent}`}
                strokeLinecap="round" />
              <defs>
                <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f43f5e" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Курсов', value: progress.length },
            { label: 'Уроков', value: totalCompleted },
            { label: 'Осталось', value: totalLessons - totalCompleted },
          ].map(stat => (
            <div key={stat.label} className="text-center p-3 rounded-2xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{stat.value}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {[1,2].map(i => <div key={i} className="glass-card h-24 shimmer-bg" />)}
        </div>
      ) : progress.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">🎯</div>
          <p className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Нет активных курсов</p>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Запишитесь на курс, чтобы начать обучение</p>
          <button className="btn-primary" style={{ maxWidth: 200, margin: '0 auto' }} onClick={() => setActiveTab('courses')}>
            Смотреть курсы
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <h2 className="font-semibold" style={{ color: 'var(--text-secondary)' }}>По курсам</h2>
          {progress.map(course => {
            const total = parseInt(course.total_lessons || 0);
            const completed = parseInt(course.completed_lessons || 0);
            const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
            
            return (
              <div key={course.id} className="glass-card p-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden flex-shrink-0">
                    {course.thumbnail_url ? (
                      <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl" style={{ background: 'rgba(244,63,94,0.2)' }}>🎓</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{course.title}</p>
                      <span className="text-xs font-bold gradient-text">{pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden mb-2" style={{ background: 'rgba(255,255,255,0.1)' }}>
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #f43f5e, #8b5cf6)' }}
                      />
                    </div>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {completed} из {total} уроков
                    </p>
                  </div>
                </div>

                {pct === 100 && (
                  <div className="mt-3 p-3 rounded-2xl text-center"
                    style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
                    <p className="text-sm font-semibold text-green-400">🏆 Курс завершён!</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

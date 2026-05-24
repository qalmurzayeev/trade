import { useEffect, useState } from 'react';
import { api } from '../utils/api.js';
import { useTelegram } from '../hooks/useTelegram.js';

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [courseDetail, setCourseDetail] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [lessonData, setLessonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lessonLoading, setLessonLoading] = useState(false);
  const [hwText, setHwText] = useState('');
  const [hwSubmitted, setHwSubmitted] = useState(false);
  const { haptic } = useTelegram();

  useEffect(() => {
    api.getCourses().then(d => { setCourses(d.courses); setLoading(false); });
  }, []);

  const openCourse = async (course) => {
    haptic.impact('light');
    setSelected(course);
    const detail = await api.getCourse(course.id);
    setCourseDetail(detail);
  };

  const openLesson = async (lesson) => {
    if (!courseDetail?.access || courseDetail.access.status !== 'active') {
      haptic.notification('error');
      return;
    }
    haptic.impact('light');
    setSelectedLesson(lesson);
    setLessonLoading(true);
    setHwSubmitted(false);
    setHwText('');
    try {
      const data = await api.getLesson(selected.id, lesson.id);
      setLessonData(data);
    } catch (e) {
      setLessonData({ error: e.message });
    }
    setLessonLoading(false);
  };

  const markComplete = async () => {
    haptic.notification('success');
    await api.completeLesson(selected.id, selectedLesson.id);
    setLessonData(p => ({...p, completed: true}));
  };

  const submitHw = async () => {
    if (!hwText.trim()) return;
    haptic.impact('medium');
    await api.submitHomework(selected.id, selectedLesson.id, hwText);
    setHwSubmitted(true);
  };

  // Lesson view
  if (selectedLesson) {
    return (
      <div className="flex flex-col min-h-screen pb-24 animate-fade-in">
        <div className="sticky top-0 z-10 px-5 pt-4 pb-3 flex items-center gap-3"
          style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border)' }}>
          <button onClick={() => { setSelectedLesson(null); setLessonData(null); }}
            className="w-9 h-9 rounded-2xl flex items-center justify-center transition-all active:scale-90"
            style={{ background: 'rgba(255,255,255,0.07)' }}>
            ←
          </button>
          <h2 className="font-semibold flex-1 truncate" style={{ color: 'var(--text-primary)' }}>
            {selectedLesson.title}
          </h2>
          {lessonData?.completed && <span className="text-green-400 text-sm">✓</span>}
        </div>

        {lessonLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#f43f5e transparent transparent transparent' }} />
          </div>
        ) : lessonData?.error ? (
          <div className="mx-5 mt-6 glass-card p-5 text-center">
            <div className="text-3xl mb-3">🔒</div>
            <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>Нет доступа</p>
            <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>{lessonData.error}</p>
          </div>
        ) : lessonData ? (
          <div className="flex flex-col gap-5 px-5 pt-5">
            {/* Video */}
            {lessonData.lesson?.video_url && (
              <div className="rounded-3xl overflow-hidden aspect-video bg-black">
                <iframe src={lessonData.lesson.video_url} className="w-full h-full" allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope" />
              </div>
            )}

            {/* Description */}
            {lessonData.lesson?.description && (
              <div className="glass-card p-5">
                <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>О уроке</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {lessonData.lesson.description}
                </p>
              </div>
            )}

            {/* PDF */}
            {lessonData.lesson?.pdf_url && (
              <a href={lessonData.lesson.pdf_url} target="_blank" rel="noreferrer"
                className="glass-card p-4 flex items-center gap-3 active:scale-98 transition-transform"
                style={{ textDecoration: 'none' }}>
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl"
                  style={{ background: 'rgba(244,63,94,0.15)' }}>📄</div>
                <div>
                  <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Материалы урока</p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Скачать PDF</p>
                </div>
                <span className="ml-auto" style={{ color: 'var(--text-muted)' }}>↗</span>
              </a>
            )}

            {/* Homework */}
            {lessonData.lesson?.homework && (
              <div className="glass-card p-5">
                <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <span>📝</span> Домашнее задание
                </h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
                  {lessonData.lesson.homework}
                </p>
                {!hwSubmitted ? (
                  <>
                    <textarea
                      className="input-field resize-none"
                      rows={4}
                      placeholder="Напишите ваш ответ..."
                      value={hwText}
                      onChange={e => setHwText(e.target.value)}
                    />
                    <button className="btn-primary mt-3" onClick={submitHw} disabled={!hwText.trim()}>
                      Отправить задание
                    </button>
                  </>
                ) : (
                  <div className="text-center py-3">
                    <div className="text-3xl mb-2">🎉</div>
                    <p className="font-semibold text-green-400">Задание отправлено!</p>
                  </div>
                )}
              </div>
            )}

            {/* Complete button */}
            {!lessonData.completed ? (
              <button className="btn-primary" onClick={markComplete}>
                ✓ Отметить как пройденный
              </button>
            ) : (
              <div className="glass-card p-4 text-center"
                style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
                <p className="font-semibold text-green-400">✓ Урок пройден!</p>
              </div>
            )}
          </div>
        ) : null}
      </div>
    );
  }

  // Course detail view
  if (selected) {
    const access = courseDetail?.access;
    const isActive = access?.status === 'active';

    return (
      <div className="flex flex-col min-h-screen pb-24 animate-fade-in">
        <div className="sticky top-0 z-10 px-5 pt-4 pb-3 flex items-center gap-3"
          style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border)' }}>
          <button onClick={() => { setSelected(null); setCourseDetail(null); }}
            className="w-9 h-9 rounded-2xl flex items-center justify-center transition-all active:scale-90"
            style={{ background: 'rgba(255,255,255,0.07)' }}>
            ←
          </button>
          <h2 className="font-semibold flex-1 truncate" style={{ color: 'var(--text-primary)' }}>{selected.title}</h2>
        </div>

        <div className="h-48 overflow-hidden">
          <img src={selected.thumbnail_url} alt={selected.title} className="w-full h-full object-cover" />
        </div>

        <div className="px-5 pt-5 flex flex-col gap-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{selected.title}</h1>
              <p className="text-sm mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{selected.description}</p>
            </div>
            <span className={`flex-shrink-0 text-xs px-3 py-1 rounded-full font-medium ${
              access?.status === 'active' ? 'status-active' :
              access?.status === 'blocked' ? 'status-blocked' :
              access?.status === 'expired' ? 'status-expired' :
              'text-gray-400 bg-gray-800'
            }`}>
              {access?.status === 'active' ? '✓ Активен' :
               access?.status === 'blocked' ? '⛔ Заблокирован' :
               access?.status === 'expired' ? '⏰ Истёк' : '🔒 Нет доступа'}
            </span>
          </div>

          {!courseDetail ? (
            <div className="flex flex-col gap-3">
              {[1,2,3].map(i => <div key={i} className="glass-card h-16 shimmer-bg" />)}
            </div>
          ) : (
            courseDetail.modules?.map(mod => (
              <div key={mod.id} className="glass-card overflow-hidden">
                <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
                  <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{mod.title}</h3>
                  {mod.description && (
                    <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{mod.description}</p>
                  )}
                </div>
                <div>
                  {mod.lessons.map((lesson, idx) => (
                    <button
                      key={lesson.id}
                      onClick={() => openLesson(lesson)}
                      className="w-full flex items-center gap-4 px-5 py-4 text-left transition-all active:bg-white/5"
                      style={{ borderBottom: idx < mod.lessons.length - 1 ? '1px solid var(--border)' : 'none' }}
                    >
                      <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
                        style={{
                          background: lesson.completed
                            ? 'linear-gradient(135deg, #4ade80, #22c55e)'
                            : isActive ? 'linear-gradient(135deg, #f43f5e, #8b5cf6)' : 'rgba(255,255,255,0.07)',
                          color: 'white'
                        }}>
                        {lesson.completed ? '✓' : isActive ? '▶' : '🔒'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate" style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                          {lesson.title}
                        </p>
                        {lesson.duration_minutes > 0 && (
                          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                            ⏱ {lesson.duration_minutes} мин
                          </p>
                        )}
                      </div>
                      {isActive && <span style={{ color: 'var(--text-muted)' }}>›</span>}
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // Course list
  return (
    <div className="flex flex-col gap-5 px-5 pt-6 pb-6">
      <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Курсы</h1>
      
      {loading ? (
        <div className="flex flex-col gap-4">
          {[1,2,3].map(i => <div key={i} className="h-48 rounded-3xl shimmer-bg" />)}
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">📚</div>
          <p style={{ color: 'var(--text-secondary)' }}>Курсов пока нет</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {courses.map(course => (
            <button
              key={course.id}
              onClick={() => openCourse(course)}
              className="glass-card overflow-hidden text-left transition-all active:scale-98 w-full"
            >
              <div className="h-40 overflow-hidden relative">
                <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(13,13,20,0.8) 0%, transparent 50%)' }} />
                {course.access_status && (
                  <div className="absolute top-3 right-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      course.access_status === 'active' ? 'status-active' :
                      course.access_status === 'blocked' ? 'status-blocked' : 'status-expired'
                    }`}>
                      {course.access_status === 'active' ? '✓ Активен' : course.access_status === 'blocked' ? '⛔ Блок' : '⏰ Истёк'}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>{course.title}</h3>
                <p className="text-sm mt-1 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{course.description}</p>
                <div className="flex items-center gap-4 mt-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <span>📦 {course.module_count} модулей</span>
                  <span>🎬 {course.lesson_count} уроков</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

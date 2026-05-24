import { useEffect, useState } from 'react';
import { api } from '../utils/api.js';

const TABS = ['Курсы', 'Пользователи', 'Доступ'];

export default function AdminPanel({ onBack }) {
  const [tab, setTab] = useState(0);
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [access, setAccess] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Forms
  const [courseForm, setCourseForm] = useState({ title: '', description: '', thumbnail_url: '', is_published: true });
  const [moduleForm, setModuleForm] = useState({ course_id: '', title: '', order_index: 1 });
  const [lessonForm, setLessonForm] = useState({ module_id: '', title: '', description: '', video_url: '', homework: '', duration_minutes: 10, order_index: 1 });
  const [accessForm, setAccessForm] = useState({ telegram_id: '', course_id: '', status: 'active' });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [modules, setModules] = useState([]);

  useEffect(() => {
    Promise.all([
      api.admin.getCourses(),
      api.admin.getUsers(),
      api.admin.getAccess()
    ]).then(([c, u, a]) => {
      setCourses(c.courses);
      setUsers(u.users);
      setAccess(a.access);
      setLoading(false);
    });
  }, []);

  const loadModules = async (courseId) => {
    const detail = await api.getCourse(courseId);
    setModules(detail.modules || []);
  };

  const showSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleCreateCourse = async () => {
    if (!courseForm.title) return;
    setSaving(true);
    const { course } = await api.admin.createCourse(courseForm);
    setCourses(p => [course, ...p]);
    setCourseForm({ title: '', description: '', thumbnail_url: '', is_published: true });
    showSuccess('Курс создан!');
    setSaving(false);
  };

  const handleCreateModule = async () => {
    if (!moduleForm.course_id || !moduleForm.title) return;
    setSaving(true);
    await api.admin.createModule(moduleForm);
    await loadModules(moduleForm.course_id);
    setModuleForm(p => ({...p, title: ''}));
    showSuccess('Модуль создан!');
    setSaving(false);
  };

  const handleCreateLesson = async () => {
    if (!lessonForm.module_id || !lessonForm.title) return;
    setSaving(true);
    await api.admin.createLesson(lessonForm);
    setLessonForm(p => ({...p, title: '', description: '', video_url: '', homework: ''}));
    showSuccess('Урок создан!');
    setSaving(false);
  };

  const handleSetAccess = async () => {
    if (!accessForm.telegram_id || !accessForm.course_id) return;
    setSaving(true);
    try {
      await api.admin.setAccess(accessForm);
      const a = await api.admin.getAccess();
      setAccess(a.access);
      showSuccess('Доступ обновлён!');
    } catch (e) {
      showSuccess('Ошибка: ' + e.message);
    }
    setSaving(false);
  };

  return (
    <div className="flex flex-col min-h-screen pb-10">
      <div className="sticky top-0 z-10 px-5 pt-4 pb-3 flex items-center gap-3"
        style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border)' }}>
        <button onClick={onBack} className="w-9 h-9 rounded-2xl flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.07)' }}>←</button>
        <h2 className="font-bold" style={{ color: 'var(--text-primary)' }}>Администратор</h2>
      </div>

      {success && (
        <div className="mx-5 mt-3 p-3 rounded-2xl text-center text-sm font-medium animate-fade-up"
          style={{ background: 'rgba(34,197,94,0.15)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)' }}>
          ✓ {success}
        </div>
      )}

      {/* Tabs */}
      <div className="flex px-5 gap-2 mt-4 mb-5">
        {TABS.map((t, i) => (
          <button key={i} onClick={() => setTab(i)}
            className="flex-1 py-2 rounded-2xl text-sm font-medium transition-all"
            style={{
              background: tab === i ? 'linear-gradient(135deg, #f43f5e, #8b5cf6)' : 'rgba(255,255,255,0.07)',
              color: tab === i ? 'white' : 'var(--text-secondary)'
            }}>
            {t}
          </button>
        ))}
      </div>

      <div className="px-5 flex flex-col gap-5">
        {/* Courses tab */}
        {tab === 0 && (
          <>
            <div className="glass-card p-5">
              <h3 className="font-semibold mb-4 gradient-text">+ Новый курс</h3>
              <div className="flex flex-col gap-3">
                <input className="input-field" placeholder="Название курса" value={courseForm.title} onChange={e => setCourseForm(p => ({...p, title: e.target.value}))} />
                <textarea className="input-field resize-none" rows={2} placeholder="Описание" value={courseForm.description} onChange={e => setCourseForm(p => ({...p, description: e.target.value}))} />
                <input className="input-field" placeholder="URL изображения" value={courseForm.thumbnail_url} onChange={e => setCourseForm(p => ({...p, thumbnail_url: e.target.value}))} />
                <label className="flex items-center gap-3 px-4 py-3 rounded-2xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)' }}>
                  <input type="checkbox" checked={courseForm.is_published} onChange={e => setCourseForm(p => ({...p, is_published: e.target.checked}))} />
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Опубликовать</span>
                </label>
                <button className="btn-primary" onClick={handleCreateCourse} disabled={saving}>Создать курс</button>
              </div>
            </div>

            <div className="glass-card p-5">
              <h3 className="font-semibold mb-4 gradient-text">+ Новый модуль</h3>
              <div className="flex flex-col gap-3">
                <select className="input-field" value={moduleForm.course_id} onChange={e => { setModuleForm(p => ({...p, course_id: e.target.value})); loadModules(e.target.value); }}>
                  <option value="">Выберите курс</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
                <input className="input-field" placeholder="Название модуля" value={moduleForm.title} onChange={e => setModuleForm(p => ({...p, title: e.target.value}))} />
                <input className="input-field" type="number" placeholder="Порядок" value={moduleForm.order_index} onChange={e => setModuleForm(p => ({...p, order_index: parseInt(e.target.value)}))} />
                <button className="btn-primary" onClick={handleCreateModule} disabled={saving}>Создать модуль</button>
              </div>
            </div>

            <div className="glass-card p-5">
              <h3 className="font-semibold mb-4 gradient-text">+ Новый урок</h3>
              <div className="flex flex-col gap-3">
                <select className="input-field" onChange={e => { loadModules(e.target.value); setLessonForm(p => ({...p, module_id: ''})); }}>
                  <option value="">Выберите курс</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
                <select className="input-field" value={lessonForm.module_id} onChange={e => setLessonForm(p => ({...p, module_id: e.target.value}))}>
                  <option value="">Выберите модуль</option>
                  {modules.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
                </select>
                <input className="input-field" placeholder="Название урока" value={lessonForm.title} onChange={e => setLessonForm(p => ({...p, title: e.target.value}))} />
                <textarea className="input-field resize-none" rows={2} placeholder="Описание" value={lessonForm.description} onChange={e => setLessonForm(p => ({...p, description: e.target.value}))} />
                <input className="input-field" placeholder="Ссылка на видео" value={lessonForm.video_url} onChange={e => setLessonForm(p => ({...p, video_url: e.target.value}))} />
                <textarea className="input-field resize-none" rows={2} placeholder="Домашнее задание" value={lessonForm.homework} onChange={e => setLessonForm(p => ({...p, homework: e.target.value}))} />
                <input className="input-field" type="number" placeholder="Длительность (мин)" value={lessonForm.duration_minutes} onChange={e => setLessonForm(p => ({...p, duration_minutes: parseInt(e.target.value)}))} />
                <button className="btn-primary" onClick={handleCreateLesson} disabled={saving}>Создать урок</button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>Все курсы ({courses.length})</h3>
              <div className="flex flex-col gap-2">
                {courses.map(c => (
                  <div key={c.id} className="glass-card px-4 py-3 flex items-center gap-3">
                    <span className="text-lg">{c.is_published ? '✅' : '📝'}</span>
                    <div className="flex-1">
                      <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{c.title}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{c.module_count} мод · {c.lesson_count} уроков</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Users tab */}
        {tab === 1 && (
          <div>
            <h3 className="font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>Все пользователи ({users.length})</h3>
            <div className="flex flex-col gap-2">
              {users.map(u => (
                <div key={u.id} className="glass-card px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #f43f5e, #8b5cf6)', color: 'white' }}>
                      {(u.full_name || u.telegram_first_name || 'U')[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                        {u.full_name || u.telegram_first_name || 'Без имени'}
                        {u.is_admin && <span className="ml-2 text-xs text-rose-400">admin</span>}
                      </p>
                      <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                        ID: {u.telegram_id} {u.city && `· ${u.city}`}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Access tab */}
        {tab === 2 && (
          <>
            <div className="glass-card p-5">
              <h3 className="font-semibold mb-4 gradient-text">Управление доступом</h3>
              <div className="flex flex-col gap-3">
                <input className="input-field" placeholder="Telegram ID пользователя" type="number" value={accessForm.telegram_id} onChange={e => setAccessForm(p => ({...p, telegram_id: e.target.value}))} />
                <select className="input-field" value={accessForm.course_id} onChange={e => setAccessForm(p => ({...p, course_id: e.target.value}))}>
                  <option value="">Выберите курс</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
                <select className="input-field" value={accessForm.status} onChange={e => setAccessForm(p => ({...p, status: e.target.value}))}>
                  <option value="active">✅ Активный</option>
                  <option value="blocked">⛔ Заблокирован</option>
                  <option value="expired">⏰ Истёкший</option>
                </select>
                <button className="btn-primary" onClick={handleSetAccess} disabled={saving}>Сохранить доступ</button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>Записи доступа ({access.length})</h3>
              <div className="flex flex-col gap-2">
                {access.map(a => (
                  <div key={a.id} className="glass-card px-4 py-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                          {a.full_name || a.telegram_username || `ID:${a.telegram_id}`}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{a.course_title}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        a.status === 'active' ? 'status-active' :
                        a.status === 'blocked' ? 'status-blocked' : 'status-expired'
                      }`}>
                        {a.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

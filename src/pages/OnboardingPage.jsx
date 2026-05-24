import { useState } from 'react';
import { api } from '../utils/api.js';
import { useStore } from '../store/index.js';
import { useTelegram } from '../hooks/useTelegram.js';

const INCOME_OPTIONS = [
  'До 100 000 ₸',
  '100 000 – 300 000 ₸',
  '300 000 – 700 000 ₸',
  '700 000 – 1 500 000 ₸',
  'Более 1 500 000 ₸'
];

export default function OnboardingPage() {
  const { user, setUser, setNeedsOnboarding } = useStore();
  const { haptic } = useTelegram();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: user?.telegram_first_name ? `${user.telegram_first_name} ${user.telegram_last_name || ''}`.trim() : '',
    age: '',
    city: '',
    monthly_income: ''
  });

  const handleSubmit = async () => {
    if (!form.full_name || !form.age || !form.city || !form.monthly_income) return;
    
    haptic.impact('medium');
    setLoading(true);
    try {
      const { user: updated } = await api.completeOnboarding(form);
      setUser(updated);
      setNeedsOnboarding(false);
    } catch (e) {
      haptic.notification('error');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: 'Добро пожаловать! 👋',
      subtitle: 'Расскажите немного о себе, чтобы мы могли персонализировать ваш опыт обучения',
      field: (
        <div className="flex flex-col gap-3">
          <label style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Ваше полное имя</label>
          <input
            className="input-field"
            placeholder="Иван Иванов"
            value={form.full_name}
            onChange={e => setForm(p => ({...p, full_name: e.target.value}))}
          />
        </div>
      ),
      valid: form.full_name.length > 2
    },
    {
      title: 'Сколько вам лет? 🎂',
      subtitle: 'Это поможет нам подобрать подходящий контент',
      field: (
        <div className="flex flex-col gap-3">
          <label style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Возраст</label>
          <input
            className="input-field"
            type="number"
            placeholder="25"
            min="16"
            max="80"
            value={form.age}
            onChange={e => setForm(p => ({...p, age: e.target.value}))}
          />
        </div>
      ),
      valid: form.age >= 16 && form.age <= 80
    },
    {
      title: 'Из какого вы города? 🌆',
      subtitle: 'Иногда мы проводим офлайн мероприятия',
      field: (
        <div className="flex flex-col gap-3">
          <label style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Город</label>
          <input
            className="input-field"
            placeholder="Алматы"
            value={form.city}
            onChange={e => setForm(p => ({...p, city: e.target.value}))}
          />
        </div>
      ),
      valid: form.city.length > 1
    },
    {
      title: 'Ваш ежемесячный доход? 💰',
      subtitle: 'Эта информация конфиденциальна и помогает нам предлагать актуальные курсы',
      field: (
        <div className="flex flex-col gap-2">
          {INCOME_OPTIONS.map(opt => (
            <button
              key={opt}
              onClick={() => setForm(p => ({...p, monthly_income: opt}))}
              className="text-left px-4 py-3 rounded-2xl transition-all duration-200 text-sm font-medium"
              style={{
                background: form.monthly_income === opt 
                  ? 'linear-gradient(135deg, rgba(244,63,94,0.2), rgba(139,92,246,0.2))'
                  : 'rgba(255,255,255,0.05)',
                border: form.monthly_income === opt ? '1px solid rgba(244,63,94,0.4)' : '1px solid var(--border)',
                color: form.monthly_income === opt ? '#f8f8ff' : 'var(--text-secondary)'
              }}
            >
              {form.monthly_income === opt && <span className="mr-2">✓</span>}
              {opt}
            </button>
          ))}
        </div>
      ),
      valid: !!form.monthly_income
    }
  ];

  const currentStep = steps[step];
  const isLast = step === steps.length - 1;

  return (
    <div className="min-h-screen flex flex-col px-5 pt-safe" style={{ background: 'var(--bg-primary)' }}>
      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl opacity-10"
          style={{ background: 'radial-gradient(circle, #f43f5e, transparent)' }} />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full blur-3xl opacity-10"
          style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }} />
      </div>

      <div className="relative z-10 flex-1 flex flex-col pt-12">
        {/* Progress bar */}
        <div className="flex gap-2 mb-10">
          {steps.map((_, i) => (
            <div key={i} className="h-1 flex-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: i <= step ? '100%' : '0%',
                  background: 'linear-gradient(90deg, #f43f5e, #8b5cf6)'
                }}
              />
            </div>
          ))}
        </div>

        {/* Logo */}
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-8"
          style={{ background: 'linear-gradient(135deg, #f43f5e, #8b5cf6)', boxShadow: '0 8px 24px rgba(244,63,94,0.3)' }}>
          🎓
        </div>

        {/* Step content */}
        <div key={step} className="animate-fade-up">
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            {currentStep.title}
          </h1>
          <p className="text-sm mb-8 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {currentStep.subtitle}
          </p>
          {currentStep.field}
        </div>

        <div className="flex-1" />

        {/* Navigation */}
        <div className="pb-8 flex flex-col gap-3">
          <button
            className="btn-primary"
            disabled={!currentStep.valid || loading}
            onClick={() => {
              if (!currentStep.valid) return;
              haptic.impact('light');
              if (isLast) handleSubmit();
              else setStep(s => s + 1);
            }}
            style={{ opacity: currentStep.valid ? 1 : 0.5 }}
          >
            {loading ? 'Сохранение...' : isLast ? 'Начать обучение 🚀' : 'Продолжить →'}
          </button>
          
          {step > 0 && (
            <button className="btn-secondary" onClick={() => setStep(s => s - 1)}>
              ← Назад
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

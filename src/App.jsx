import { useEffect } from 'react';
import { useStore } from './store/index.js';
import { api } from './utils/api.js';
import { useTelegram } from './hooks/useTelegram.js';
import LoadingScreen from './components/LoadingScreen.jsx';
import BottomNav from './components/BottomNav.jsx';
import OnboardingPage from './pages/OnboardingPage.jsx';
import HomePage from './pages/HomePage.jsx';
import CoursesPage from './pages/CoursesPage.jsx';
import ProgressPage from './pages/ProgressPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';

const PAGES = {
  home: HomePage,
  courses: CoursesPage,
  progress: ProgressPage,
  profile: ProfilePage,
};

export default function App() {
  const { isLoading, setLoading, setUser, setNeedsOnboarding, needsOnboarding, activeTab } = useStore();
  useTelegram();

  useEffect(() => {
    const init = async () => {
      try {
        const { user, needsOnboarding } = await api.login();
        setUser(user);
        setNeedsOnboarding(needsOnboarding);
      } catch (e) {
        console.error('Login failed:', e);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  if (isLoading) return <LoadingScreen />;
  if (needsOnboarding) return <OnboardingPage />;

  const PageComponent = PAGES[activeTab] || HomePage;

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(244,63,94,0.08), transparent)' }} />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.08), transparent)' }} />
      </div>

      {/* Scrollable content */}
      <div className="relative z-10 overflow-y-auto pb-28" style={{ minHeight: '100vh' }}>
        <PageComponent key={activeTab} />
      </div>

      <BottomNav />
    </div>
  );
}
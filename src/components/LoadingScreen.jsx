export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
      {/* Glow orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #f43f5e, transparent)' }} />
        <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 translate-y-1/2 w-64 h-64 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }} />
      </div>
      
      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Logo */}
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl"
          style={{ background: 'linear-gradient(135deg, #f43f5e 0%, #8b5cf6 100%)', boxShadow: '0 8px 32px rgba(244,63,94,0.4)' }}>
          🎓
        </div>
        
        <div className="text-center">
          <h1 className="text-2xl font-bold gradient-text mb-1">EduFlow</h1>
          <p style={{ color: 'var(--text-muted)' }} className="text-sm">Загрузка...</p>
        </div>
        
        {/* Spinner */}
        <div className="flex gap-2">
          {[0, 1, 2].map(i => (
            <div key={i} className="w-2 h-2 rounded-full animate-pulse"
              style={{ 
                background: 'linear-gradient(135deg, #f43f5e, #8b5cf6)',
                animationDelay: `${i * 0.15}s`
              }} />
          ))}
        </div>
      </div>
    </div>
  );
}

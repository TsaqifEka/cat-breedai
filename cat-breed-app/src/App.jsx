import React from 'react';
import { useLanguage } from './context/LanguageContext';
import { usePrediction } from './hooks/usePrediction';
import Dropzone from './components/Dropzone';
import LoadingSpinner from './components/LoadingSpinner';
import ResultCard from './components/ResultCard';
import AnimatedBackground from './components/AnimatedBackground';
import { Image as ImageIcon } from 'lucide-react';

function App() {
  const { lang, toggleLanguage, t } = useLanguage();
  const { predict, reset, loading, result, error, previewUrl } = usePrediction();

  return (
    <>
      <AnimatedBackground />
      <div className="app-container">
        <header className="header">
          <div>
            <h1>{t('app.title')}</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              {t('app.subtitle')}
            </p>
          </div>
          <div className="tab-switcher lang-switcher">
            <button 
              className={`tab-btn ${lang === 'en' ? 'active' : ''}`}
              onClick={() => lang !== 'en' && toggleLanguage()}
              style={{ padding: '0.5rem 1rem' }}
            >
              EN
            </button>
            <button 
              className={`tab-btn ${lang === 'id' ? 'active' : ''}`}
              onClick={() => lang !== 'id' && toggleLanguage()}
              style={{ padding: '0.5rem 1rem' }}
            >
              ID
            </button>
          </div>
        </header>

        <main className="app-grid">
          {/* Left Column: Input */}
          <div className="input-column">
            <Dropzone onImageSelect={predict} />
          </div>

          {/* Right Column: Output */}
          <div className="output-column">
            {error && !loading && (
              <div className="glass waiting-card" style={{ borderColor: 'var(--color-red)' }}>
                <p style={{ color: 'var(--color-red)', marginBottom: '1rem' }}>{error}</p>
                <button className="btn btn-secondary" onClick={reset}>Try Again</button>
              </div>
            )}

            {loading && (
              <div className="glass waiting-card">
                <LoadingSpinner />
                <p style={{ marginTop: '1rem', color: 'var(--color-text-muted)' }}>Analyzing your cat...</p>
              </div>
            )}

            {!loading && !result && !error && (
              <div className="glass waiting-card">
                <ImageIcon size={64} color="var(--color-text-muted)" style={{ opacity: 0.5, marginBottom: '1rem' }} />
                <h3>Waiting for a photo...</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                  Upload an image or take a picture to see the breed prediction here.
                </p>
              </div>
            )}

            {!loading && result && (
              <ResultCard result={result} onReset={reset} previewUrl={previewUrl} />
            )}
          </div>
        </main>
      </div>
    </>
  );
}

export default App;

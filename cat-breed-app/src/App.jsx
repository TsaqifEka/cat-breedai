import React from 'react';
import { useLanguage } from './context/LanguageContext';
import { usePrediction } from './hooks/usePrediction';
import Dropzone from './components/Dropzone';
import LoadingSpinner from './components/LoadingSpinner';
import ResultCard from './components/ResultCard';

function App() {
  const { lang, toggleLanguage, t } = useLanguage();
  const { predict, reset, loading, result, error, previewUrl } = usePrediction();

  return (
    <div className="app-container">
      <header className="header">
        <div>
          <h1>{t('app.title')}</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            {t('app.subtitle')}
          </p>
        </div>
        <button className="lang-toggle" onClick={toggleLanguage}>
          {lang === 'en' ? 'EN' : 'ID'}
        </button>
      </header>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {error && !loading && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--color-red)', color: 'var(--color-red)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem', textAlign: 'center' }}>
            {error}
            <button className="btn btn-secondary mt-4" onClick={reset}>Try Again</button>
          </div>
        )}

        {loading && <LoadingSpinner />}

        {!loading && !result && !error && (
          <Dropzone onImageSelect={predict} />
        )}

        {!loading && result && (
          <ResultCard result={result} onReset={reset} previewUrl={previewUrl} />
        )}
      </main>
    </div>
  );
}

export default App;

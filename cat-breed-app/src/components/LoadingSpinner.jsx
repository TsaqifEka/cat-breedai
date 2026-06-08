import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const LoadingSpinner = () => {
  const { t } = useLanguage();
  const [factIndex, setFactIndex] = useState(0);
  
  const facts = t('loading.facts');

  useEffect(() => {
    // Cycle facts every 3 seconds
    const interval = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % facts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [facts.length]);

  return (
    <div className="glass animate-fade-in" style={{ padding: '3rem 2rem', borderRadius: '1rem', textAlign: 'center' }}>
      <div className="spinner mb-4"></div>
      <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--color-emerald)' }}>
        {t('loading.analyzing')}
      </h2>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', minHeight: '3rem', transition: 'opacity 0.3s ease' }}>
        {facts[factIndex]}
      </p>
    </div>
  );
};

export default LoadingSpinner;

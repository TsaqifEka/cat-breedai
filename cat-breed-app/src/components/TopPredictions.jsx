import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const TopPredictions = ({ predictions, color = 'var(--color-emerald)' }) => {
  const { t } = useLanguage();

  if (!predictions || predictions.length === 0) return null;

  return (
    <div className="mt-4 w-full">
      <h3 className="mb-4 text-center" style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
        {t('result.top_predictions')}
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {predictions.map((pred, index) => {
          // Fallback to the raw breed name if translation not found
          const breedName = t(`breed.${pred.breed}`);
          
          return (
            <div key={index} style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                <span>{breedName}</span>
                <span>{pred.confidence}%</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--color-surface-hover)', borderRadius: '4px', overflow: 'hidden' }}>
                <div 
                  style={{ 
                    height: '100%', 
                    width: `${pred.confidence}%`, 
                    backgroundColor: color,
                    transition: 'width 1s ease-out'
                  }} 
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopPredictions;

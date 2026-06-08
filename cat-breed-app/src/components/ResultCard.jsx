import React, { useMemo } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import ConfidenceRing from './ConfidenceRing';
import TopPredictions from './TopPredictions';
import { useLanguage } from '../context/LanguageContext';

// Theming mapping
const FLUFFY = 'var(--color-emerald)'; // Persian, Ragdoll, Maine_Coon
const SLEEK = 'var(--color-sky)';      // Siamese, Sphynx
const SPOTTED = 'var(--color-amber)';   // Bengal, British_Shorthair
const ERROR = 'var(--color-red)';       // Non-cat

const getThemeColor = (breed, isCat) => {
  if (!isCat) return ERROR;
  if (['Persian', 'Ragdoll', 'Maine_Coon'].includes(breed)) return FLUFFY;
  if (['Siamese', 'Sphynx'].includes(breed)) return SLEEK;
  if (['Bengal', 'British_Shorthair'].includes(breed)) return SPOTTED;
  return FLUFFY; // Default
};

const ResultCard = ({ result, onReset, previewUrl }) => {
  const { t } = useLanguage();
  
  if (!result) return null;

  const { is_cat, cat_confidence, breed, breed_confidence, top_3_predictions, message } = result;
  const themeColor = getThemeColor(breed, is_cat);

  return (
    <div 
      className="glass animate-fade-in" 
      style={{ 
        borderRadius: '1rem', 
        padding: '2rem',
        borderTop: `4px solid ${themeColor}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem'
      }}
    >
      {previewUrl && (
        <div style={{ width: '100%', maxWidth: '200px', borderRadius: '0.75rem', overflow: 'hidden', margin: '0 auto', border: `2px solid var(--color-surface-hover)` }}>
          <img src={previewUrl} alt="Uploaded preview" style={{ width: '100%', display: 'block', objectFit: 'cover' }} />
        </div>
      )}

      {!is_cat ? (
        // Non-Cat Error State
        <div className="w-full" style={{ textAlign: 'center' }}>
          <AlertCircle size={64} color={themeColor} style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ color: themeColor, marginBottom: '0.5rem' }}>{t('error.not_cat')}</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>
            {t('error.cat_confidence')}: {cat_confidence}%
          </p>
        </div>
      ) : (
        // Cat Detected State
        <>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.75rem', color: themeColor, marginBottom: '0.5rem' }}>
              {t(`breed.${breed}`) || breed}
            </h2>
          </div>
          
          <ConfidenceRing percentage={breed_confidence} color={themeColor} />
          
          <TopPredictions predictions={top_3_predictions} color={themeColor} />
        </>
      )}

      <button 
        className="btn mt-4" 
        onClick={onReset}
        style={{ 
          backgroundColor: is_cat ? themeColor : 'transparent',
          border: is_cat ? 'none' : `1px solid ${themeColor}`,
          color: is_cat ? '#000' : themeColor,
        }}
      >
        <RotateCcw size={20} />
        {t('result.scan_another')}
      </button>
    </div>
  );
};

export default ResultCard;

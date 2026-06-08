import React, { createContext, useState, useContext, useMemo } from 'react';
import en from '../i18n/en.json';
import id from '../i18n/id.json';

const LanguageContext = createContext();

const translations = { en, id };

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('en');

  const t = (key, returnArray = false) => {
    const text = translations[lang][key];
    if (!text) return key;
    return text;
  };

  const toggleLanguage = () => {
    setLang(prev => (prev === 'en' ? 'id' : 'en'));
  };

  const value = useMemo(() => ({ lang, toggleLanguage, t }), [lang]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

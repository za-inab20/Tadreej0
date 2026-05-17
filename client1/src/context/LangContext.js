import React, { createContext, useContext, useState } from 'react';
import T from '../i18n/translations';

const LangContext = createContext({ lang: 'en', setLang: () => {}, t: T.en });

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem('tadreej_lang') || 'en';
    document.documentElement.dir = saved === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = saved;
    return saved;
  });

  const changeLang = (l) => {
    setLang(l);
    localStorage.setItem('tadreej_lang', l);
    document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = l;
  };

  return (
    <LangContext.Provider value={{ lang, setLang: changeLang, t: T[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}

export function useT() {
  const { t } = useContext(LangContext);
  return t;
}

import { useEffect, useMemo, useState } from 'react';

export type AppLanguage = 'zh-CN' | 'en-US';

const DICT = {
  'zh-CN': {
    home: '首页',
    login: '注册/登录',
    preferences: '偏好设置',
    userCenter: '用户中心',
    logout: '退出登录',
    search: '搜索',
    settingsTitle: '偏好设置',
    settingsSub: '个性化您的使用体验',
    uiSettings: '界面设置',
    themeMode: '主题模式',
    themeDesc: '选择您喜欢的界面主题',
    notifications: '通知设置',
    emailNotifications: '邮件通知',
    emailNotificationsDesc: '接收重要更新和提醒邮件',
    pushNotifications: '推送通知',
    pushNotificationsDesc: '接收实时浏览器推送通知',
  },
  'en-US': {
    home: 'Home',
    login: 'Sign In',
    preferences: 'Preferences',
    userCenter: 'User Center',
    logout: 'Log out',
    search: 'Search',
    settingsTitle: 'Preferences',
    settingsSub: 'Personalize your experience',
    uiSettings: 'Interface',
    themeMode: 'Theme mode',
    themeDesc: 'Choose your preferred theme',
    notifications: 'Notifications',
    emailNotifications: 'Email notifications',
    emailNotificationsDesc: 'Receive important updates via email',
    pushNotifications: 'Push notifications',
    pushNotificationsDesc: 'Receive real-time browser push notifications',
  },
} as const;

function normalizeLanguage(value: string | null): AppLanguage {
  return value === 'en-US' ? 'en-US' : 'zh-CN';
}

export function useLanguage() {
  const [language, setLanguageState] = useState<AppLanguage>(() => normalizeLanguage(localStorage.getItem('language')));

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: string) => {
    const normalized = normalizeLanguage(lang);
    setLanguageState(normalized);
    window.dispatchEvent(new CustomEvent('app-language-changed', { detail: { language: normalized } }));
  };

  useEffect(() => {
    const handler = (event: Event) => {
      const custom = event as CustomEvent<{ language?: AppLanguage }>;
      if (custom.detail?.language) {
        setLanguageState(normalizeLanguage(custom.detail.language));
      }
    };
    window.addEventListener('app-language-changed', handler as EventListener);
    return () => window.removeEventListener('app-language-changed', handler as EventListener);
  }, []);

  const t = useMemo(() => DICT[language], [language]);

  return { language, setLanguage, t };
}

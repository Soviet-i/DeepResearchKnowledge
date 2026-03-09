import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { ThemeToggle } from '../components/ThemeToggle';
import { LanguageSelector } from '../components/LanguageSelector';
import { NotificationToggle } from '../components/NotificationToggle';
import { useTheme, type ThemeMode } from '../hooks/useTheme';
import { useLanguage } from '../hooks/useLanguage';
import { toast } from 'sonner';

export default function PreferenceSettingsPage() {
  const { themeMode, setThemeMode } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const [selectedTheme, setSelectedTheme] = useState<ThemeMode>(themeMode);
  const [emailNotifications, setEmailNotifications] = useState<boolean>(() => {
    const val = localStorage.getItem('pref_email_notifications');
    return val === null ? true : val === 'true';
  });
  const [pushNotifications, setPushNotifications] = useState<boolean>(() => {
    const val = localStorage.getItem('pref_push_notifications');
    return val === null ? false : val === 'true';
  });

  useEffect(() => {
    setSelectedTheme(themeMode);
  }, [themeMode]);

  useEffect(() => {
    setThemeMode(selectedTheme);
  }, [selectedTheme, setThemeMode]);

  useEffect(() => {
    localStorage.setItem('pref_email_notifications', String(emailNotifications));
  }, [emailNotifications]);

  useEffect(() => {
    localStorage.setItem('pref_push_notifications', String(pushNotifications));
  }, [pushNotifications]);

  const onPushToggle = async (enabled: boolean) => {
    if (enabled && 'Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        toast.error(language === 'en-US' ? 'Notification permission denied' : '浏览器通知权限未开启');
        setPushNotifications(false);
        return;
      }
      toast.success(language === 'en-US' ? 'Push notifications enabled' : '推送通知已开启');
    }

    if (!enabled) {
      toast.success(language === 'en-US' ? 'Push notifications disabled' : '推送通知已关闭');
    }

    setPushNotifications(enabled);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">{t.settingsTitle}</h1>
          <p className="text-gray-500 mb-8">{t.settingsSub}</p>

          <div className="space-y-8">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">{t.uiSettings}</h2>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">{t.themeMode}</h3>
                <p className="text-xs text-gray-500 mb-3">{t.themeDesc}</p>
                <ThemeToggle selectedTheme={selectedTheme} onThemeChange={setSelectedTheme} />
              </div>

              <LanguageSelector selectedLanguage={language} onLanguageChange={setLanguage} />
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">{t.notifications}</h2>

              <NotificationToggle
                title={t.emailNotifications}
                description={t.emailNotificationsDesc}
                isEnabled={emailNotifications}
                onToggle={setEmailNotifications}
              />

              <NotificationToggle
                title={t.pushNotifications}
                description={t.pushNotificationsDesc}
                isEnabled={pushNotifications}
                onToggle={onPushToggle}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

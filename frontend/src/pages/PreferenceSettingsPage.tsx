import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { ThemeToggle } from '../components/ThemeToggle';
import { LanguageSelector } from '../components/LanguageSelector';
import { NotificationToggle } from '../components/NotificationToggle';
import { useTheme } from '../hooks/useTheme';

// 定义偏好设置页面
export default function PreferenceSettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark' | 'auto'>(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      return savedTheme;
    }
    return 'auto';
  });
  
  const [language, setLanguage] = useState<string>('zh-CN');
  const [emailNotifications, setEmailNotifications] = useState<boolean>(true);
  const [pushNotifications, setPushNotifications] = useState<boolean>(false);

  // 当主题改变时，应用到整个应用
  useEffect(() => {
    if (selectedTheme === 'auto') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      if (theme !== systemTheme) {
        toggleTheme();
      }
    } else if (theme !== selectedTheme) {
      toggleTheme();
    }
  }, [selectedTheme, theme, toggleTheme]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">偏好设置</h1>
          <p className="text-gray-500 mb-8">个性化您的使用体验</p>

          <div className="space-y-8">
            {/* 界面设置 */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">界面设置</h2>
              
              {/* 主题模式 */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">主题模式</h3>
                <p className="text-xs text-gray-500 mb-3">选择您喜欢的界面主题</p>
                <ThemeToggle 
                  selectedTheme={selectedTheme} 
                  onThemeChange={setSelectedTheme} 
                />
              </div>
              
              {/* 语言选择 */}
              <LanguageSelector 
                selectedLanguage={language} 
                onLanguageChange={setLanguage} 
              />
            </div>

            {/* 通知设置 */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">通知设置</h2>
              
              {/* 邮件通知 */}
              <NotificationToggle 
                title="邮件通知"
                description="接收重要更新和提醒邮件"
                isEnabled={emailNotifications}
                onToggle={setEmailNotifications}
              />
              
              {/* 推送通知 */}
              <NotificationToggle 
                title="推送通知"
                description="接收实时推送通知"
                isEnabled={pushNotifications}
                onToggle={setPushNotifications}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { cn } from '../lib/utils';

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}

export function LanguageSelector({ selectedLanguage, onLanguageChange }: LanguageSelectorProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">语言</h3>
        <p className="text-xs text-gray-500">选择界面显示语言</p>
      </div>
      <select
        className={cn(
          'px-3 py-2 border border-gray-300 rounded-md text-sm bg-white',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
        )}
        value={selectedLanguage}
        onChange={(e) => onLanguageChange(e.target.value)}
      >
        <option value="zh-CN">简体中文</option>
        <option value="en-US">English</option>
      </select>
    </div>
  );
}
import React from 'react';
import { cn } from '../lib/utils';

interface ThemeToggleProps {
  selectedTheme: 'light' | 'dark' | 'auto';
  onThemeChange: (theme: 'light' | 'dark' | 'auto') => void;
}

export function ThemeToggle({ selectedTheme, onThemeChange }: ThemeToggleProps) {
  return (
    <div className="flex space-x-3">
      <button
        className={cn(
          'px-3 py-2 rounded-md border text-sm transition-all',
          selectedTheme === 'light'
            ? 'border-blue-500 bg-blue-50 text-blue-700'
            : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
        )}
        onClick={() => onThemeChange('light')}
      >
        浅色
      </button>
      <button
        className={cn(
          'px-3 py-2 rounded-md border text-sm transition-all',
          selectedTheme === 'dark'
            ? 'border-blue-500 bg-blue-50 text-blue-700'
            : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
        )}
        onClick={() => onThemeChange('dark')}
      >
        深色
      </button>
      <button
        className={cn(
          'px-3 py-2 rounded-md border text-sm transition-all',
          selectedTheme === 'auto'
            ? 'border-blue-500 bg-blue-50 text-blue-700'
            : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
        )}
        onClick={() => onThemeChange('auto')}
      >
        自动
      </button>
    </div>
  );
}

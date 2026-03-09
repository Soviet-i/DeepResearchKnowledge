import React from 'react';
import { cn } from '../lib/utils';

interface NotificationToggleProps {
  title: string;
  description: string;
  isEnabled: boolean;
  onToggle: (value: boolean) => void;
}

export function NotificationToggle({ 
  title, 
  description, 
  isEnabled, 
  onToggle 
}: NotificationToggleProps) {
  return (
    <div className="flex justify-between items-center py-3">
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-1">{title}</h3>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={isEnabled}
          onChange={(e) => onToggle(e.target.checked)}
          className="sr-only peer"
        />
        <div 
          className={cn(
            "w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
          )}
        ></div>
      </label>
    </div>
  );
}
import React from 'react';
import { ChevronDown } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function Select({ options, value, onChange, className = '' }: SelectProps) {
  return (
    <div className={`relative inline-block ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none bg-secondary/50 hover:bg-secondary/70 border border-border/80 text-foreground text-xs py-1.5 pl-3 pr-8 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-all font-semibold cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-background text-foreground">
            {opt.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-2.5 flex items-center pointer-events-none text-muted-foreground">
        <ChevronDown className="h-3.5 w-3.5" />
      </div>
    </div>
  );
}

export default Select;

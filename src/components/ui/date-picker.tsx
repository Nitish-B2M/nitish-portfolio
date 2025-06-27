'use client';

import * as React from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { cn } from '@/lib/utils';

interface DatePickerProps {
  date?: Date;
  setDate: (date: Date | null) => void;
  disabled?: boolean;
  className?: string;
}

export function DatePicker({ date, setDate, disabled, className }: DatePickerProps) {
  return (
    <div className={cn('grid gap-2', className)}>
      <ReactDatePicker
        selected={date}
        onChange={setDate}
        disabled={disabled}
        dateFormat="MMMM d, yyyy"
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  );
} 
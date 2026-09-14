'use client';

import * as React from 'react';
import { UploadCloud, FileText, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  accept?: string;
  maxSizeMB?: number;
  label?: string;
  helperText?: string;
  className?: string;
}

export function FileUpload({
  onFileSelect,
  selectedFile,
  accept = 'image/*,application/pdf',
  maxSizeMB = 10,
  label,
  helperText = 'PDF, PNG, JPG up to 10MB',
  className,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.size <= maxSizeMB * 1024 * 1024) {
        onFileSelect(file);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size <= maxSizeMB * 1024 * 1024) {
        onFileSelect(file);
      }
    }
  };

  return (
    <div className={cn('w-full flex flex-col gap-1.5', className)}>
      {label && (
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 tracking-wide uppercase">
          {label}
        </label>
      )}

      {selectedFile ? (
        <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-md bg-blue-100 dark:bg-blue-950/60 flex items-center justify-center text-[#0B2545] dark:text-blue-400 shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-900 dark:text-slate-100 truncate">
                {selectedFile.name}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onFileSelect(null)}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            'flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-colors text-center',
            isDragging
              ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20'
              : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 bg-slate-50/40 dark:bg-slate-900/40'
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleInputChange}
            className="hidden"
          />
          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 mb-2">
            <UploadCloud className="w-5 h-5" />
          </div>
          <p className="text-xs font-medium text-slate-900 dark:text-slate-100 mb-0.5">
            <span className="text-blue-600 dark:text-blue-400 hover:underline">Click to browse</span> or drag and drop
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">{helperText}</p>
        </div>
      )}
    </div>
  );
}

import React from 'react';
import { Box, Printer, Settings } from 'lucide-react';

interface HeaderProps {
  onOpenSettings?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenSettings }) => {
  return (
    <header className="w-full bg-slate-900 border-b border-slate-800 py-4 px-6 sticky top-0 z-50 shadow-md">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-green-500 p-2 rounded-lg">
            <Printer className="w-6 h-6 text-slate-900" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">BambuPrint AI <span className="text-green-500">打印助手</span></h1>
            <p className="text-xs text-slate-400">切片参数优化与诊断</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-sm text-slate-400">
            <Box className="w-4 h-4" />
            <span>FDM 专用</span>
          </div>
          
          {onOpenSettings && (
            <button 
              onClick={onOpenSettings}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-all border border-transparent hover:border-slate-700"
              title="API 设置"
            >
              <Settings className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
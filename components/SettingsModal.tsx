import React from 'react';
import { X, Server, Cpu, Sliders } from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSettingsChange: (newSettings: AppSettings) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSettingsChange }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-scale-in">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900">
          <div className="flex items-center gap-2 text-white">
            <Sliders className="w-5 h-5 text-green-500" />
            <h2 className="font-bold text-lg">API 与模型设置</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* API Status Section */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              AI 驱动节点
            </label>
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-green-500/10 p-2 rounded-md">
                  <Server className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">System Managed API</div>
                  <div className="text-xs text-green-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    已连接
                  </div>
                </div>
              </div>
              <div className="text-xs text-slate-500 font-mono">SECURE_ENV</div>
            </div>
          </div>

          {/* Model Selection (Read Only / Simulated) */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              当前模型
            </label>
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 flex items-center gap-3 opacity-90">
              <div className="bg-indigo-500/20 p-2 rounded-md">
                <Cpu className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-white flex justify-between">
                  <span>Qwen-Max (Expert)</span>
                  <span className="text-xs bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/30">Default</span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  通义千问高精度逻辑驱动
                </div>
              </div>
            </div>
          </div>

          {/* Temperature/Creativity Control */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                回答风格 (Temperature)
              </label>
              <span className="text-xs font-mono text-green-400 bg-green-900/20 px-2 py-0.5 rounded">
                {settings.temperature}
              </span>
            </div>
            
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.1"
              value={settings.temperature}
              onChange={(e) => onSettingsChange({ ...settings, temperature: parseFloat(e.target.value) })}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-green-500 hover:accent-green-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-medium">
              <span>严谨 (0.0)</span>
              <span>平衡 (0.5)</span>
              <span>发散 (1.0)</span>
            </div>
            <p className="text-xs text-slate-400 bg-slate-800/50 p-2 rounded border border-slate-800">
              <span className="text-green-500 font-bold">建议:</span> 3D 打印参数通常需要较低的 Temperature (0.2 - 0.4) 以确保数据的准确性和一致性。
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-800 bg-slate-900/50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg border border-slate-700 transition-colors"
          >
            完成
          </button>
        </div>

      </div>
    </div>
  );
};

export default SettingsModal;
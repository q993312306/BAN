import React from 'react';
import { AnalysisResult } from '../types';
import { AlertTriangle, CheckCircle, AlertCircle, Info, Layers, Hammer, Wind, Gauge, Settings2 } from 'lucide-react';

interface AnalysisDisplayProps {
  result: AnalysisResult;
}

const CategoryIcon = ({ name }: { name: string }) => {
  const lower = name.toLowerCase();
  // Check for English or Chinese keywords
  if (lower.includes('quality') || name.includes('质量')) return <Layers className="w-5 h-5" />;
  if (lower.includes('strength') || name.includes('强度')) return <Hammer className="w-5 h-5" />;
  if (lower.includes('speed') || name.includes('速度')) return <Gauge className="w-5 h-5" />;
  if (lower.includes('cooling') || name.includes('冷却')) return <Wind className="w-5 h-5" />;
  if (lower.includes('support') || name.includes('支撑')) return <BoxIcon />;
  return <Settings2 className="w-5 h-5" />;
};

const BoxIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
);

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ result }) => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in">
      
      {/* Top Summary Card */}
      <div className={`p-6 rounded-xl border ${result.isFailedPrint ? 'bg-red-900/10 border-red-800/50' : 'bg-slate-800 border-slate-700'} shadow-lg`}>
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-full ${result.isFailedPrint ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
            {result.isFailedPrint ? <AlertCircle className="w-8 h-8" /> : <CheckCircle className="w-8 h-8" />}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white mb-1">
              {result.isFailedPrint ? '打印失败诊断' : '参数建议'}
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-3">
              {result.summary}
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300 border border-slate-600">
                模型：{result.modelName}
              </span>
              <span className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300 border border-slate-600">
                建议材料：<span className="font-semibold text-green-400">{result.materialSuggestion}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Warnings Section */}
      {result.warnings.length > 0 && (
        <div className="bg-amber-900/20 border border-amber-700/50 rounded-lg p-4">
          <h3 className="text-amber-400 font-semibold mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            关键注意事项
          </h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-amber-200/80">
            {result.warnings.map((warn, idx) => (
              <li key={idx}>{warn}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {result.categories.map((category, idx) => (
          <div key={idx} className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-sm hover:border-slate-600 transition-colors">
            <div className="bg-slate-900/50 px-4 py-3 border-b border-slate-700 flex items-center gap-2">
              <span className="text-green-500">
                <CategoryIcon name={category.categoryName} />
              </span>
              <h3 className="font-bold text-slate-100">{category.categoryName}</h3>
            </div>
            <div className="p-4 space-y-4">
              {category.settings.map((setting, sIdx) => (
                <div key={sIdx} className="group">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-sm font-medium text-slate-300">{setting.name}</span>
                    <span className="text-sm font-bold text-green-400 font-mono bg-green-500/10 px-2 py-0.5 rounded">
                      {setting.value}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-tight">
                    {setting.reason}
                  </p>
                  {sIdx < category.settings.length - 1 && (
                    <div className="h-px bg-slate-700/50 mt-3" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 text-xs text-slate-500 pt-4 pb-8">
        <Info className="w-4 h-4" />
        <p>打印前请务必在 Bambu Studio 预览中再次检查生成的参数。</p>
      </div>
    </div>
  );
};

export default AnalysisDisplay;
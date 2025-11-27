import React, { useState } from 'react';
import Header from './components/Header';
import ImageUpload from './components/ImageUpload';
import AnalysisDisplay from './components/AnalysisDisplay';
import SettingsModal from './components/SettingsModal';
import { analyzeImage } from './services/geminiService';
import { AnalysisResult, AnalysisStatus, AppSettings } from './types';
import { Sparkles, Spool, Phone } from 'lucide-react';

const FILAMENTS = [
  'PLA', 'PLA Matte', 'PETG', 'ABS', 'ASA', 'TPU', 'PC', 'PA-CF'
];

const App: React.FC = () => {
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // App Config State
  const [selectedFilament, setSelectedFilament] = useState<string>('PLA');
  const [showSettings, setShowSettings] = useState(false);
  const [appSettings, setAppSettings] = useState<AppSettings>({
    temperature: 0.3,
    modelDisplay: 'Qwen'
  });

  const handleImageSelected = async (base64: string, mimeType: string) => {
    setStatus(AnalysisStatus.ANALYZING);
    setErrorMsg(null);
    setResult(null);

    try {
      // Pass settings to service
      const data = await analyzeImage(base64, mimeType, selectedFilament, appSettings);
      setResult(data);
      setStatus(AnalysisStatus.SUCCESS);
    } catch (error) {
      console.error(error);
      setStatus(AnalysisStatus.ERROR);
      setErrorMsg("分析图片失败，请重试或使用更清晰的图片。");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans selection:bg-green-500/30">
      <Header onOpenSettings={() => setShowSettings(true)} />

      <SettingsModal 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={appSettings}
        onSettingsChange={setAppSettings}
      />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8">
        
        {/* Intro / Hero - Only show if no result yet */}
        {status === AnalysisStatus.IDLE && (
          <div className="text-center mb-10 space-y-4 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-sm font-medium border border-green-500/20">
              <Sparkles className="w-4 h-4" />
              <span>智能切片参数优化</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              完美的 Bambu Studio 参数，<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
                每一次打印。
              </span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              选择耗材，上传截图或照片，获取 Qwen (通义千问) 驱动的专业建议。
            </p>
          </div>
        )}

        {/* Configuration Section (Filament Only) */}
        <div className="w-full max-w-2xl mx-auto mb-8">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-3 text-slate-300 font-medium">
              <Spool className="w-5 h-5 text-green-500" />
              <span>选择耗材</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {FILAMENTS.map(f => (
                <button
                  key={f}
                  onClick={() => setSelectedFilament(f)}
                  className={`px-2 py-2 text-sm rounded-lg transition-all ${
                    selectedFilament === f 
                      ? 'bg-green-600 text-white shadow-lg shadow-green-900/20 font-medium' 
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <ImageUpload 
          onImageSelected={handleImageSelected} 
          isLoading={status === AnalysisStatus.ANALYZING} 
        />

        {/* Error State */}
        {status === AnalysisStatus.ERROR && (
          <div className="w-full max-w-md mx-auto p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-200 text-center mb-8">
            <p>{errorMsg}</p>
            <button 
              onClick={() => setStatus(AnalysisStatus.IDLE)}
              className="mt-2 text-sm underline hover:text-white"
            >
              重试
            </button>
          </div>
        )}

        {/* Results Section */}
        {status === AnalysisStatus.SUCCESS && result && (
          <AnalysisDisplay result={result} />
        )}
        
      </main>

      {/* Footer with Contact Info */}
      <footer className="py-8 border-t border-slate-800 bg-slate-900/50">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-sm">
            专为 Bambu Studio 用户设计。与 Bambu Lab 无官方关联。
          </p>
          
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-full border border-slate-700">
            <Phone className="w-4 h-4 text-green-500" />
            <span className="text-slate-300 text-sm font-medium">
              联系方式：陈文 <span className="text-slate-200 select-all">17875611750</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
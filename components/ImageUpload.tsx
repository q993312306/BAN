import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, X } from 'lucide-react';

interface ImageUploadProps {
  onImageSelected: (base64: string, mimeType: string) => void;
  isLoading: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelected, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('请上传图片文件 (PNG, JPG, WEBP)。');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreview(result);
      onImageSelected(result, file.type);
    };
    reader.readAsDataURL(file);
  };

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

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
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const clearImage = () => {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (preview) {
    return (
      <div className="w-full max-w-xl mx-auto mb-8 animate-fade-in">
        <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-800 shadow-2xl">
          <img 
            src={preview} 
            alt="Upload Preview" 
            className={`w-full h-auto max-h-[400px] object-contain bg-slate-900 ${isLoading ? 'opacity-50 grayscale' : ''}`}
          />
          {!isLoading && (
            <button
              onClick={clearImage}
              className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin"></div>
                <span className="text-green-400 font-medium animate-pulse">正在分析几何结构...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200
          ${isDragging 
            ? 'border-green-500 bg-green-500/10' 
            : 'border-slate-700 bg-slate-800/50 hover:border-slate-500 hover:bg-slate-800'
          }
        `}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={onSelectFile}
          accept="image/*"
          className="hidden"
        />
        <div className="flex flex-col items-center gap-4">
          <div className={`p-4 rounded-full ${isDragging ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-400'}`}>
            <UploadCloud className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">
              上传模型截图或打印照片
            </h3>
            <p className="text-sm text-slate-400 max-w-sm mx-auto">
              拖放您的 3D 模型截图或失败的打印照片。
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-500 mt-2">
            <span className="flex items-center gap-1"><ImageIcon className="w-3 h-3" /> 支持 JPG, PNG, WEBP</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
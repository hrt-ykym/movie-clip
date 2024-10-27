import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';

interface VideoUploaderProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

const VideoUploader: React.FC<VideoUploaderProps> = ({ onFileSelect, isProcessing }) => {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('video/')) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  return (
    <div
      className="w-full max-w-2xl p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        <Upload className="w-12 h-12 text-gray-400" />
        <p className="text-lg font-medium text-gray-700">
          {isProcessing ? '処理中...' : '動画ファイルをドラッグ＆ドロップ'}
        </p>
        <p className="text-sm text-gray-500">または</p>
        <label className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition-colors">
          ファイルを選択
          <input
            type="file"
            className="hidden"
            accept="video/*"
            onChange={handleFileInput}
            disabled={isProcessing}
          />
        </label>
      </div>
    </div>
  );
};

export default VideoUploader;
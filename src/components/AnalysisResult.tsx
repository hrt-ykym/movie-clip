import React from 'react';
import { Play, Download } from 'lucide-react';

interface AnalysisResultProps {
  clips: Array<{
    startTime: number;
    endTime: number;
    clipUrl: string;
  }>;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ clips }) => {
  return (
    <div className="w-full max-w-2xl mt-8">
      <h2 className="text-xl font-bold mb-4">検出されたクリップ</h2>
      <div className="space-y-4">
        {clips.map((clip, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <Play className="w-6 h-6 text-blue-500" />
              <div>
                <p className="font-medium">
                  クリップ {index + 1}
                </p>
                <p className="text-sm text-gray-500">
                  {Math.floor(clip.startTime)}秒 - {Math.floor(clip.endTime)}秒
                </p>
              </div>
            </div>
            <a
              href={clip.clipUrl}
              download={`clip-${index + 1}.mp4`}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>ダウンロード</span>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalysisResult;
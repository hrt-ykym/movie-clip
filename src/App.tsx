import axios from "axios";
import { useState } from "react";
import AnalysisResult from "./components/AnalysisResult";
import VideoUploader from "./components/VideoUploader";
// import { Waveform } from 'lucide-react';

function App() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [clips, setClips] = useState<
    Array<{
      startTime: number;
      endTime: number;
      clipUrl: string;
    }>
  >([]);

  const handleFileSelect = async (file: File) => {
    setIsProcessing(true);
    const formData = new FormData();
    formData.append("video", file);

    try {
      const response = await axios.post(
        "http://localhost:5000/analyze",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setClips(response.data.clips);
    } catch (error) {
      console.error("Error analyzing video:", error);
      alert("動画の分析中にエラーが発生しました。");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            {/* <Waveform className="w-8 h-8 text-blue-500" /> */}
            <h1 className="text-4xl font-extrabold text-gray-900 drop-shadow-lg">
              ☝️P1グランプリ2024動画クリップメーカー☝️
            </h1>
          </div>
          <p className="text-gray-700 text-lg">
            動画から音声の盛り上がりシーンを自動検出し、クリップを作成します
          </p>
          <p className="text-gray-700 mt-4 text-lg">
            さあ、あなたの動画を笑いの渦に巻き込みましょう！🎉
          </p>
          <p className="text-gray-600 mt-2 text-sm">
            ※アップロードする動画は5分以内にしてください。
          </p>
          <p className="text-gray-600 mt-2 text-sm">
            ※プライバシーを守るため、個人情報が含まれる動画はアップロードしないでください。
          </p>
        </div>

        <div className="flex flex-col items-center space-y-8">
          <VideoUploader
            onFileSelect={handleFileSelect}
            isProcessing={isProcessing}
          />
          {clips.length > 0 && (
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                クリップ結果
              </h2>
              <AnalysisResult clips={clips} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

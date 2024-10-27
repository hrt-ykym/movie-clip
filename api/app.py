import os
import tempfile

import numpy as np
from flask import Flask, jsonify, request
from flask_cors import CORS
from moviepy.editor import VideoFileClip
from scipy.io import wavfile

app = Flask(__name__)
CORS(app)

def detect_highlights(audio_data, sample_rate, window_size=0.5, top_n=5):
    # ウィンドウサイズをサンプル数に変換
    window_samples = int(window_size * sample_rate)
    
    # 音量の計算
    if len(audio_data.shape) > 1:
        audio_data = np.mean(audio_data, axis=1)  # ステレオの場合は平均を取る
    
    # RMSエネルギーの計算
    energy = np.array([
        np.sqrt(np.mean(audio_data[i:i+window_samples]**2))
        for i in range(0, len(audio_data)-window_samples, window_samples)
    ])
    
    # エネルギーの高い順にインデックスを取得
    top_indices = np.argsort(energy)[-top_n:]
    
    # 時間に変換
    highlights = [(i * window_size, (i + 1) * window_size) for i in sorted(top_indices)]
    
    # 重複するハイライトをマージ
    merged_highlights = []
    for start, end in highlights:
        if merged_highlights and merged_highlights[-1][1] >= start:
            merged_highlights[-1] = (merged_highlights[-1][0], end)
        else:
            merged_highlights.append((start, end))
    
    return merged_highlights

@app.route('/analyze', methods=['POST'])
def analyze_video():
    if 'video' not in request.files:
        return jsonify({'error': 'No video file provided'}), 400
    
    video_file = request.files['video']
    
    # 一時ファイルの作成
    with tempfile.NamedTemporaryFile(suffix='.mp4', delete=False) as temp_video:
        video_file.save(temp_video.name)
        video_path = temp_video.name
    
    try:
        # 動画から音声の抽出
        video = VideoFileClip(video_path)
        
        # 一時的な音声ファイルの作成
        with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as temp_audio:
            video.audio.write_audiofile(temp_audio.name)
            
            # 音声データの読み込み
            sample_rate, audio_data = wavfile.read(temp_audio.name)
            
            # ハイライトの検出
            highlights = detect_highlights(audio_data, sample_rate)
            
            # クリップの生成
            clips = []
            for i, (start, end) in enumerate(highlights):
                # 前後10秒を含める
                clip_start = max(0, start - 10)
                clip_end = min(video.duration, end + 10)
                
                # クリップの保存
                clip = video.subclip(clip_start, clip_end)
                clip_path = f'temp_clip_{i}.mp4'
                clip.write_videofile(clip_path)
                
                clips.append({
                    'startTime': clip_start,
                    'endTime': clip_end,
                    'clipUrl': f'/clips/temp_clip_{i}.mp4'
                })
            
            # 一時ファイルの削除
            os.unlink(temp_audio.name)
            video.close()
            
            return jsonify({'clips': clips})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    finally:
        # 一時ファイルの削除
        os.unlink(video_path)

if __name__ == '__main__':
    app.run(debug=True)

import { useState, useEffect } from 'react';
import Head from 'next/head';
import ytdlClient from '../ytdl';
import { CONFIG } from '../config';

export default function Home() {
  const [url, setUrl] = useState('');
  const [format, setFormat] = useState('mp4');
  const [quality, setQuality] = useState(CONFIG.DEFAULT_QUALITIES.MP4);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSubmit = async () => {
    if (!url.trim()) {
      setError('Masukkan URL YouTube');
      return;
    }
    
    if (!ytdlClient.validateYouTubeUrl(url)) {
      setError('URL YouTube tidak valid');
      return;
    }

    setError('');
    setLoading(true);
    setResult(null);
    setSearchResults([]);

    try {
      const response = format === 'mp3' 
        ? await ytdlClient.downloadMP3(url, quality)
        : await ytdlClient.downloadMP4(url, quality);
      
      setResult(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    if (!query.trim()) return;
    
    try {
      const response = await ytdlClient.search(query);
      setSearchResults(response.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDownload = (url) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = '';
    link.click();
  };

  const formatDuration = (isoDuration) => {
    const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const hours = (match[1] ? match[1].replace('H', '') : '0');
    const minutes = (match[2] ? match[2].replace('M', '') : '0');
    const seconds = (match[3] ? match[3].replace('S', '') : '0');
    return `${hours !== '0' ? hours + ':' : ''}${minutes}:${seconds.padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Head>
        <title>ytdl simpel by aka</title>
        <link rel="stylesheet" href="/css/home.css" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 via-blue-500 to-green-500 bg-clip-text text-transparent">
            ytdl simpel by aka
          </h1>
          <button 
            onClick={() => window.location.href = '/doc'}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
          >
            Doc
          </button>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-700 mb-6">
            <div className="space-y-4">
              <div>
                <input
                  type="url"
                  placeholder="Masukkan URL YouTube (Video/Shorts)"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <select
                    value={format}
                    onChange={(e) => {
                      setFormat(e.target.value);
                      setQuality(e.target.value === 'mp3' 
                        ? CONFIG.DEFAULT_QUALITIES.MP3 
                        : CONFIG.DEFAULT_QUALITIES.MP4
                      );
                    }}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                  >
                    <option value="mp4">MP4</option>
                    <option value="mp3">MP3</option>
                  </select>
                </div>

                <div>
                  <select
                    value={quality}
                    onChange={(e) => setQuality(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                  >
                    {format === 'mp3' 
                      ? CONFIG.MP3_QUALITIES.map(q => (
                          <option key={q} value={q}>{q}</option>
                        ))
                      : CONFIG.MP4_QUALITIES.map(q => (
                          <option key={q} value={q}>{q}</option>
                        ))
                    }
                  </select>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 disabled:opacity-50 px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Memproses...
                  </>
                ) : (
                  'Mulai'
                )}
              </button>

              {error && (
                <div className="text-red-400 text-sm">{error}</div>
              )}
            </div>
          </div>

          {result && (
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-700 mb-6">
              <div className="space-y-4">
                {result.thumbnail && (
                  <img 
                    src={result.thumbnail} 
                    alt="Thumbnail" 
                    className="w-full max-w-md mx-auto rounded-lg object-cover max-h-48"
                  />
                )}
                
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-green-400 line-clamp-2">{result.title}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <p className="text-gray-300">Channel: <span className="font-medium">{result.channel}</span></p>
                    <p className="text-gray-400">Durasi: <span className="font-medium">{result.duration}</span></p>
                    <p className="text-gray-400">Upload: <span className="font-medium">{result.uploadDate}</span></p>
                    <p className="text-gray-400">Views: <span className="font-medium">{result.views}</span></p>
                    <p className="text-gray-400">Likes: <span className="font-medium">{result.likes}</span></p>
                    <p className="text-gray-400">Quality: <span className="font-medium">{result.quality}</span></p>
                    <p className="text-gray-400">Format: <span className="font-medium">{result.format}</span></p>
                    <p className="text-gray-400">Size: <span className="font-medium">{result.size}</span></p>
                  </div>
                </div>

                <button
                  onClick={() => handleDownload(result.downloadUrl)}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 px-6 py-3 rounded-lg font-semibold transition-all"
                >
                  Download {result.format.toUpperCase()}
                </button>
              </div>
            </div>
          )}

          {searchResults.length > 0 && (
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Hasil Pencarian</h3>
              <div className="space-y-3">
                {searchResults.map((item, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 cursor-pointer"
                    onClick={() => setUrl(item.url)}
                  >
                    {item.thumbnail && (
                      <img 
                        src={item.thumbnail} 
                        alt={item.title} 
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm line-clamp-1">{item.title}</p>
                      <p className="text-gray-400 text-xs">{item.channel}</p>
                      <p className="text-gray-500 text-xs">{item.duration} • {item.views} views</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

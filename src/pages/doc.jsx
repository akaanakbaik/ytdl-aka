import { useState } from 'react';
import Head from 'next/head';
import { CONFIG } from '../config';

export default function Doc() {
  const [copied, setCopied] = useState('');

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(''), 2000);
  };

  const currentDomain = typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com';

  const apiEndpoints = [
    {
      method: 'GET',
      endpoint: CONFIG.API_ENDPOINTS.YTMP3,
      description: 'Download audio dari YouTube',
      example: `${currentDomain}${CONFIG.API_ENDPOINTS.YTMP3}?url=https://youtube.com/watch?v=VIDEO_ID&quality=320 kbps`
    },
    {
      method: 'GET',
      endpoint: CONFIG.API_ENDPOINTS.YTMP4,
      description: 'Download video dari YouTube',
      example: `${currentDomain}${CONFIG.API_ENDPOINTS.YTMP4}?url=https://youtube.com/watch?v=VIDEO_ID&quality=720p`
    },
    {
      method: 'GET',
      endpoint: CONFIG.API_ENDPOINTS.SEARCH,
      description: 'Cari video di YouTube',
      example: `${currentDomain}${CONFIG.API_ENDPOINTS.SEARCH}?query=cari+video`
    }
  ];

  const exampleOutput = {
    "status": true,
    "data": {
      "title": "Judul Video",
      "channel": "Nama Channel",
      "duration": "5:30",
      "uploadDate": "2024-01-01",
      "views": 1000000,
      "likes": 50000,
      "comments": 1000,
      "subscribers": "1M",
      "thumbnail": "https://i.ytimg.com/vi/VIDEO_ID/maxresdefault.jpg",
      "downloadUrl": "https://download-url.com/file.mp4",
      "quality": "720p",
      "format": "mp4",
      "size": "50MB"
    }
  };

  const waPlugin = `// File: plugins/ytdl.js
import { ytmp3, ytmp4 } from '../lib/ytdl.js'

export async function before(m, { conn, text, usedPrefix, command }) {
    if (!text) return m.reply(\`Contoh: \${usedPrefix + command} https://youtube.com/watch?v=VIDEO_ID\`)
    
    try {
        if (command === 'ytmp3') {
            let res = await ytmp3(text)
            await conn.sendFile(m.chat, res.downloadUrl, 'audio.mp3', '', m)
        } else if (command === 'ytmp4') {
            let res = await ytmp4(text)
            await conn.sendFile(m.chat, res.downloadUrl, 'video.mp4', '', m)
        }
    } catch (e) {
        m.reply('Error: ' + e.message)
    }
}

export const help = ['ytmp3', 'ytmp4']
export const tags = ['downloader']
export const command = /^(ytmp3|ytmp4)$/i
export const limit = true`;

  return (
    <div className="min-h-screen bg-black text-white">
      <Head>
        <title>Documentation - ytdl simpel by aka</title>
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-red-500 via-blue-500 to-green-500 bg-clip-text text-transparent">
            Documentation
          </h1>

          <div className="space-y-6">
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4 text-blue-400">API Endpoints</h2>
              <div className="space-y-4">
                {apiEndpoints.map((api, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        api.method === 'GET' ? 'bg-green-600' : 
                        api.method === 'POST' ? 'bg-blue-600' : 'bg-yellow-600'
                      }`}>
                        {api.method}
                      </span>
                      <code className="text-sm">{api.endpoint}</code>
                    </div>
                    <p className="text-gray-300 mb-2">{api.description}</p>
                    <div className="bg-gray-800 p-3 rounded-lg">
                      <code className="text-sm">{api.example}</code>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4 text-green-400">Example Output</h2>
              <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto">
                <code>{JSON.stringify(exampleOutput, null, 2)}</code>
              </pre>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4 text-red-400">WhatsApp Bot Plugin</h2>
              <div className="relative">
                <button
                  onClick={() => copyToClipboard(waPlugin)}
                  className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm"
                >
                  {copied === waPlugin ? '✓ Copied!' : 'Copy'}
                </button>
                <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto mt-8">
                  <code className="text-sm">{waPlugin}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
                      }

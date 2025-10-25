// Frontend Configuration
export const CONFIG = {
  BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'https://indraa.naell.my.id:2000',
  API_ENDPOINTS: {
    YTMP3: '/api/ytmp3',
    YTMP4: '/api/ytmp4',
    SEARCH: '/api/search'
  },
  DEFAULT_QUALITIES: {
    MP3: '320 kbps',
    MP4: '720p'
  },
  MP3_QUALITIES: [
    '8 kbps', '16 kbps', '24 kbps', '32 kbps', '40 kbps', '48 kbps',
    '56 kbps', '64 kbps', '80 kbps', '96 kbps', '112 kbps', '128 kbps',
    '160 kbps', '192 kbps', '224 kbps', '256 kbps', '320 kbps'
  ],
  MP4_QUALITIES: ['144p', '240p', '360p', '480p', '720p', '1080p', '1440p', '2160p', '4320p']
};

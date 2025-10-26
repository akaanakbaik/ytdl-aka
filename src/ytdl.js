// YTDl API Client
import axios from 'axios';
import { CONFIG } from './config';

class YTDlClient {
  constructor(baseURL = CONFIG.BACKEND_URL) {
    this.api = axios.create({
      baseURL,
      timeout: 60000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  async downloadMP3(url, quality = '320 kbps') {
    try {
      const response = await this.api.get(CONFIG.API_ENDPOINTS.YTMP3, {
        params: { url, quality }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to download MP3: ${error.response?.data?.error || error.message}`);
    }
  }

  async downloadMP4(url, quality = '720p') {
    try {
      const response = await this.api.get(CONFIG.API_ENDPOINTS.YTMP4, {
        params: { url, quality }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to download MP4: ${error.response?.data?.error || error.message}`);
    }
  }

  async search(query) {
    try {
      const response = await this.api.get(CONFIG.API_ENDPOINTS.SEARCH, {
        params: { query }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Search failed: ${error.response?.data?.error || error.message}`);
    }
  }

  validateYouTubeUrl(url) {
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/)|youtu\.be\/)[\w-]+/;
    return regex.test(url);
  }

  getVideoId(url) {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }
}

export default new YTDlClient();

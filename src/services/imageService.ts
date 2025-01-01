// services/imageService.ts
import api from './api';

class ImageService {
 async getImage(fileName: string): Promise<Blob> {
   const response = await api.get(`/images/${fileName}`, {
     responseType: 'blob'
   });
   return response.data;
 }

 getImageUrl(fileName: string): string {
   return `${api.defaults.baseURL}/images/${fileName}`;
 }
}

export default new ImageService();
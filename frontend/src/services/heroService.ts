// Service for hero section API calls

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface HeroData {
  dateText: string;
  mainTitle: string;
  eventDate: string;
  backgroundImage: string;
  eventDateInfo: string;
  location: string;
  audience: string;
  duration: string;
}

export const heroService = {
  // Get hero data
  async getHeroData(): Promise<HeroData> {
    try {
      const res = await fetch(`${API_URL}/hero`);
      const data = await res.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch hero data');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error fetching hero data:', error);
      throw error;
    }
  },
  
  // Update hero data
  async updateHeroData(heroData: HeroData): Promise<HeroData> {
    try {
      const res = await fetch(`${API_URL}/hero`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(heroData)
      });
      
      const data = await res.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to update hero data');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error updating hero data:', error);
      throw error;
    }
  },
  
  // Upload image
  async uploadImage(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const res = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData
      });
      
      const data = await res.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to upload image');
      }
      
      return data.url;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }
};
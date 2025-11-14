import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface GalleryImage {
  id: string;
  url: string;
  alt: string | null;
  caption: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Fetch all gallery images from the API
 * @returns Array of images or empty array if error
 */
export const fetchGalleryImages = async (): Promise<GalleryImage[]> => {
    try {
        const response = await axios.get(`${API_URL}/gallery`);
        return response.data;
    } catch (error) {
        console.error('Error fetching gallery images:', error);
        return [];
    }
}

/**
 * Create a new gallery image
 * @param image Image file to upload
 * @param alt Optional alt text for accessibility
 * @param caption Optional caption text
 * @returns Created gallery image or null if error
 */

export const createGalleryImage = async (
    image: File,
    alt?: string,
    caption?: string
): Promise<GalleryImage | null> => {
    try {
        const formData = new FormData();

        //adding the image file
        formData.append('image', image);

        //add optional fields if provided
        if (alt) {
            formData.append('alt', alt);
        }

        if (caption) {
            formData.append('caption', caption);
        }

        const response = await axios.post(`${API_URL}/gallery`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data.galleryImage;
    } catch (error) {
        console.error('Error creating gallery image:', error);
        return null;
    }
}

/**
 * Delete a gallery image
 * @param id Gallery image ID to delete
 * @returns True if successful, false if error
 */
export const deleteGalleryImage = async (id: string): Promise<boolean> => {
  try {
    await axios.delete(`${API_URL}/gallery/${id}`);
    return true;
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    return false;
  }
};
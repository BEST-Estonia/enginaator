import axios from 'axios';

//Define the API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface Sponsor {
    id: string;
    name: string;
    imageUrl: string;
    website?: string | null;
    tier?: string | null;
    createdAt: string;
    updatedAt: string;
}

/**
 * Fetch all sponsors from the API
 * @returns Array of sponsors or empty array if error
 */
export const fetchSponsors = async (): Promise<Sponsor[]> => {
  try {
    const response = await axios.get(`${API_URL}/sponsors`);
    return response.data;
  } catch (error) {
    console.error('Error fetching sponsors:', error);
    return [];
  }
};

/**
 * Create a new sponsor
 * @param name Sponsor name
 * @param image Sponsor image file
 * @param website Optional website URL
 * @param tier Optional sponsor tier
 * @returns Created sponsor or null if error
 */

export const createSponsor = async (
    name: string,
    image: File,
    website?: string,
    tier?: string
): Promise<Sponsor | null> => {
    try {
        // Create form data for file upload
        const formData = new FormData();
        formData.append('name', name);
        formData.append('image', image);

        // Add optional fields if provided
        if (website) formData.append('website', website);
        if (tier) formData.append('tier', tier);

        // Send POST request with form data
        const response = await axios.post(`${API_URL}/sponsors`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error creating sponsor:', error);
        return null;
    }
};

/**
 * Delete a sponsor by ID
 * @param id Sponsor ID
 * @returns true if successful, false if error
 */
export const deleteSponsor = async (id: string): Promise<boolean> => {
  try {
    await axios.delete(`${API_URL}/sponsors/${id}`);
    return true;
  } catch (error) {
    console.error('Error deleting sponsor:', error);
    return false;
  }
};
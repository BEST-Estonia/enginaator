const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface MainSponsor {
  id: string;
  sponsorName: string;
  sponsorText: string;
  imageUrl: string;
  website?: string;
  createdAt?: string;
  updatedAt?: string;
}

//Fetch all main sponsors
export async function getMainSponsors(): Promise<MainSponsor[]> {
    const response = await fetch(`${API_URL}/mainSponsors`);
    if (!response.ok) throw new Error('Failed to fetch main sponsors');
    return response.json();
}

// Create a new main sponsor
export async function createMainSponsor(data: Omit<MainSponsor, 'id' | 'createdAt' | 'updatedAt'>): Promise<MainSponsor> {
  const response = await fetch(`${API_URL}/mainSponsors`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to create main sponsor');
  return response.json();
}

// Update a main sponsor
export async function updateMainSponsor(id: string, data: Partial<MainSponsor>): Promise<MainSponsor> {
  const response = await fetch(`${API_URL}/mainSponsors/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to update main sponsor');
  return response.json();
}

// Delete a main sponsor
export async function deleteMainSponsor(id: string): Promise<{ message: string }> {
  const response = await fetch(`${API_URL}/mainSponsors/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Failed to delete main sponsor');
  return response.json();
}
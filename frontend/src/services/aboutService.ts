const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface About {
    id: number,
    kusContent: string,
    osalejadContent: string,
    auhinnadContent: string,
}

// Fetch about data from the backend
export async function getAbout(): Promise<About> {
    const response = await fetch(`${API_URL}/api/aboutSection`);

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('ABOUT_CONTENT_NOT_FOUND');
        }
        throw new Error('Failed to fetch ABOUT content');
    }

    return response.json();
}

// Update about data in the backend
export async function updateAbout(data: About): Promise<About> {
    const response = await fetch(`${API_URL}/api/aboutSection`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Failed to update about content');
    }

    return response.json();
}

// Create default about data in the backend
export async function createDefaultAbout(): Promise<About> {
    const response = await fetch(`${API_URL}/api/aboutSection`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    });
  
    if (!response.ok) {
        throw new Error('Failed to create default about content');
    }
  
    return response.json();
}
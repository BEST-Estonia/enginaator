const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function getAdminAuthHeaders(): HeadersInit {
  if (typeof window === 'undefined') {
    return { 'Content-Type': 'application/json' };
  }

  const token = localStorage.getItem('adminToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export interface AboutSection {
  id: string;
  kusContent: string;
  osalejadContent: string;
  auhinnadContent: string;
  createdAt?: string;
  updatedAt?: string;
}

export async function getAboutSection(): Promise<AboutSection> {
  const response = await fetch(`${API_URL}/about`, { cache: 'no-store' });
  if (!response.ok) throw new Error('Failed to fetch about section');
  return response.json();
}

export async function updateAboutSection(
  data: Pick<AboutSection, 'kusContent' | 'osalejadContent' | 'auhinnadContent'>
): Promise<AboutSection> {
  const response = await fetch(`${API_URL}/about`, {
    method: 'PUT',
    headers: getAdminAuthHeaders(),
    body: JSON.stringify(data)
  });

  if (!response.ok) throw new Error('Failed to update about section');
  return response.json();
}

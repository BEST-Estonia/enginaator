const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface AboutSectionData {
  id: string;
  kusContent: string;
  osalejadContent: string;
  auhinnadContent: string;
}

export async function getAboutSection(): Promise<AboutSectionData> {
  const res = await fetch(`${API_URL}/about`);
  if (!res.ok) throw new Error('Failed to fetch about section');
  return res.json();
}

export async function updateAboutSection(data: AboutSectionData): Promise<AboutSectionData> {
  const res = await fetch(`${API_URL}/about`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update about section');
  return res.json();
}

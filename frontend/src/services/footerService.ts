import { getAdminRequestInit } from '@/lib/adminAuth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface FooterSection {
  id: string;
  logoUrl: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  facebookUrl: string;
  instagramUrl: string;
  linkedinUrl: string;
  partner1Name: string;
  partner1LogoUrl: string;
  partner2Name: string;
  partner2LogoUrl: string;
  copyrightText: string;
  createdAt?: string;
  updatedAt?: string;
}

export type FooterPayload = Omit<FooterSection, 'id' | 'createdAt' | 'updatedAt'>;

export async function getFooterSection(): Promise<FooterSection> {
  const response = await fetch(`${API_URL}/footer`, { cache: 'no-store' });
  if (!response.ok) throw new Error('Failed to fetch footer section');
  return response.json();
}

export async function updateFooterSection(data: FooterPayload): Promise<FooterSection> {
  const response = await fetch(
    `${API_URL}/footer`,
    getAdminRequestInit({ method: 'PUT', body: JSON.stringify(data) }, true),
  );

  if (!response.ok) throw new Error('Failed to update footer section');
  return response.json();
}

export async function uploadFooterImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(
    `${API_URL}/upload`,
    getAdminRequestInit({ method: 'POST', body: formData }, false),
  );

  const data = await response.json();
  if (!response.ok || !data?.success || !data?.url) {
    throw new Error(data?.error || 'Failed to upload image');
  }

  return data.url as string;
}

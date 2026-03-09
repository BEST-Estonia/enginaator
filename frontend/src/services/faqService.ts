import { getAdminRequestInit } from '@/lib/adminAuth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export type FaqPayload = Omit<FaqItem, 'id' | 'createdAt' | 'updatedAt'>;

export async function getFaqItems(): Promise<FaqItem[]> {
  const response = await fetch(`${API_URL}/faqs`, { cache: 'no-store' });
  if (!response.ok) throw new Error('Failed to fetch FAQ items');
  return response.json();
}

export async function createFaqItem(data: FaqPayload): Promise<FaqItem> {
  const response = await fetch(
    `${API_URL}/faqs`,
    getAdminRequestInit({ method: 'POST', body: JSON.stringify(data) }, true),
  );
  if (!response.ok) throw new Error('Failed to create FAQ item');
  return response.json();
}

export async function updateFaqItem(id: string, data: Partial<FaqPayload>): Promise<FaqItem> {
  const response = await fetch(
    `${API_URL}/faqs/${id}`,
    getAdminRequestInit({ method: 'PUT', body: JSON.stringify(data) }, true),
  );
  if (!response.ok) throw new Error('Failed to update FAQ item');
  return response.json();
}

export async function deleteFaqItem(id: string): Promise<{ message: string }> {
  const response = await fetch(
    `${API_URL}/faqs/${id}`,
    getAdminRequestInit({ method: 'DELETE' }, false),
  );
  if (!response.ok) throw new Error('Failed to delete FAQ item');
  return response.json();
}

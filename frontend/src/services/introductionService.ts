import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface Feature {
  id: number;
  title: string;
  description: string;
  iconPath: string;
  introductionId: number;
}

export interface Introduction {
    id: number;
    title: string;
    description: string;
    features: Feature[];
}

//Fetch introduction data from the backend
export async function getIntroduction(): Promise<Introduction> {
    const response = await fetch(`${API_URL}/api/introduction`);

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('INTRODUCTION_NOT_FOUND');
        }
        throw new Error('Failed to fetch introduction content');
    }

    return response.json();
}

// Update introduction data in the backend
export async function updateIntroduction(data: Introduction): Promise<Introduction> {
    const response = await fetch(`${API_URL}/introduction`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Failed to update introduction content');
    }

    return response.json();
}

// Create default introduction data in the backend
export async function createDefaultIntroduction(): Promise<Introduction> {
    console.log(`${API_URL}/introduction/default`)
    const response = await fetch(`${API_URL}/introduction/default`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    });
  
    if (!response.ok) {
        throw new Error('Failed to create default introduction content');
    }
  
    return response.json();
}
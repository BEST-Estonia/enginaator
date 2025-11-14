const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface Field {
  id: string;
  name: string;
  description: string;
  icon: string;
  createdAt?: string;
  updatedAt?: string;
}

//Get all fields
export async function getFields(): Promise<Field[]> {
    const response = await fetch(`${API_URL}/fields`);
    if (!response.ok) throw new Error('Failed to fetch fields');
    return response.json();
}

// Create a new field
export async function createField(data: Omit<Field, 'id' | 'createdAt' | 'updatedAt'>): Promise<Field> {
  const response = await fetch(`${API_URL}/fields`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to create field');
  return response.json();
}

// Update a field
export async function updateField(id: string, data: Partial<Field>): Promise<Field> {
  const response = await fetch(`${API_URL}/fields/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to update field');
  return response.json();
}

// Delete a field
export async function deleteField(id: string): Promise<{ message: string }> {
  const response = await fetch(`${API_URL}/fields/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Failed to delete field');
  return response.json();
}
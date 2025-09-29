const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface ProjectMember {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  imageUrl: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

// Get all project members
export async function getProjectMembers(): Promise<ProjectMember[]> {
  const res = await fetch(`${API_URL}/projectMembers`);
  if (!res.ok) throw new Error('Failed to fetch project members');
  return res.json();
}

// Create a new project member (with image upload)
export async function createProjectMember(
  data: Omit<ProjectMember, 'id' | 'createdAt' | 'updatedAt'>,
  image?: File
): Promise<ProjectMember> {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => formData.append(key, value));
  if (image) formData.append('image', image);
  const res = await fetch(`${API_URL}/projectMembers`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to create project member');
  return res.json();
}

// Update a project member (with optional image upload)
export async function updateProjectMember(
  id: string,
  data: Partial<ProjectMember>,
  image?: File
): Promise<ProjectMember> {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => formData.append(key, value as string));
  if (image) formData.append('image', image);
  const res = await fetch(`${API_URL}/projectMembers/${id}`, {
    method: 'PUT',
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to update project member');
  return res.json();
}

// Delete a project member
export async function deleteProjectMember(id: string): Promise<{ message: string }> {
  const res = await fetch(`${API_URL}/projectMembers/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete project member');
  return res.json();
}
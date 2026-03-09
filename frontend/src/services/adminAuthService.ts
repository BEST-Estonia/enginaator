import { getAdminRequestInit } from '@/lib/adminAuth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function changeAdminPassword(currentPassword: string, newPassword: string): Promise<void> {
  const response = await fetch(
    `${API_URL}/admin/change-password`,
    getAdminRequestInit(
      {
        method: 'PUT',
        body: JSON.stringify({ currentPassword, newPassword }),
      },
      true,
    ),
  );

  if (!response.ok) {
    let errorMessage = 'Failed to change password';
    try {
      const data = await response.json();
      if (data?.error) {
        errorMessage = data.error;
      }
    } catch {
      // ignore response parse errors
    }
    throw new Error(errorMessage);
  }
}

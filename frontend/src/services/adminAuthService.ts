const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function getAdminAuthHeaders(): HeadersInit {
  if (typeof window === 'undefined') {
    return { 'Content-Type': 'application/json' };
  }

  const token = localStorage.getItem('adminToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function changeAdminPassword(currentPassword: string, newPassword: string): Promise<void> {
  const response = await fetch(`${API_URL}/admin/change-password`, {
    method: 'PUT',
    headers: getAdminAuthHeaders(),
    body: JSON.stringify({ currentPassword, newPassword }),
  });

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

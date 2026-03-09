const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export type RegistrationQuestionType = 'text' | 'textarea' | 'email' | 'number' | 'select' | 'checkbox';

export interface RegistrationQuestion {
  id: string;
  label: string;
  fieldKey: string;
  type: RegistrationQuestionType;
  required: boolean;
  placeholder?: string | null;
  options?: string[] | null;
  order: number;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface RegistrationFormConfig {
  fields: string[];
  questions: RegistrationQuestion[];
}

export interface RegistrationQuestionPayload {
  label: string;
  fieldKey: string;
  type: RegistrationQuestionType;
  required: boolean;
  placeholder?: string | null;
  options?: string[] | null;
  order: number;
  active: boolean;
}

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

export async function getRegistrationFormConfig(): Promise<RegistrationFormConfig> {
  const response = await fetch(`${API_URL}/registration-form/config`, { cache: 'no-store' });
  const payload = await response.json();

  if (!response.ok || !payload?.success) {
    throw new Error(payload?.error || 'Failed to fetch registration form config');
  }

  return payload.data;
}

export async function getRegistrationQuestionsAdmin(): Promise<RegistrationQuestion[]> {
  const response = await fetch(`${API_URL}/registration-form/questions`, {
    headers: getAdminAuthHeaders(),
    cache: 'no-store'
  });
  const payload = await response.json();

  if (!response.ok || !payload?.success) {
    throw new Error(payload?.error || 'Failed to fetch registration questions');
  }

  return payload.data;
}

export async function createRegistrationQuestion(payloadData: RegistrationQuestionPayload): Promise<RegistrationQuestion> {
  const response = await fetch(`${API_URL}/registration-form/questions`, {
    method: 'POST',
    headers: getAdminAuthHeaders(),
    body: JSON.stringify(payloadData)
  });

  const payload = await response.json();
  if (!response.ok || !payload?.success) {
    throw new Error(payload?.error || 'Failed to create registration question');
  }

  return payload.data;
}

export async function updateRegistrationQuestion(
  id: string,
  payloadData: Partial<RegistrationQuestionPayload>
): Promise<RegistrationQuestion> {
  const response = await fetch(`${API_URL}/registration-form/questions/${id}`, {
    method: 'PUT',
    headers: getAdminAuthHeaders(),
    body: JSON.stringify(payloadData)
  });

  const payload = await response.json();
  if (!response.ok || !payload?.success) {
    throw new Error(payload?.error || 'Failed to update registration question');
  }

  return payload.data;
}

export async function deleteRegistrationQuestion(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/registration-form/questions/${id}`, {
    method: 'DELETE',
    headers: getAdminAuthHeaders()
  });

  const payload = await response.json();
  if (!response.ok || !payload?.success) {
    throw new Error(payload?.error || 'Failed to delete registration question');
  }
}

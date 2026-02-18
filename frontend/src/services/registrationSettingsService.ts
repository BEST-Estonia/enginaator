const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface RegistrationSettings {
  registrationOpen: boolean;
}

export const registrationSettingsService = {
  async getRegistrationSettings(): Promise<RegistrationSettings> {
    try {
      const res = await fetch(`${API_URL}/settings/registration`, {
        cache: 'no-store'
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch registration settings');
      }

      return data.data;
    } catch (error) {
      console.error('Error fetching registration settings:', error);
      throw error;
    }
  },

  async updateRegistrationSettings(settings: RegistrationSettings): Promise<RegistrationSettings> {
    try {
      const res = await fetch(`${API_URL}/settings/registration`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to update registration settings');
      }

      return data.data;
    } catch (error) {
      console.error('Error updating registration settings:', error);
      throw error;
    }
  }
};

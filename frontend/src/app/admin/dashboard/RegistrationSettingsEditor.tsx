"use client"

import React, { useEffect, useState } from 'react';
import { registrationSettingsService } from '@/services/registrationSettingsService';
import { Button } from '@/app/components/ui/button';
import { Checkbox } from '@/app/components/ui/checkbox';

const RegistrationSettingsEditor = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [registrationOpen, setRegistrationOpen] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await registrationSettingsService.getRegistrationSettings();
        setRegistrationOpen(Boolean(data.registrationOpen));
      } catch (e) {
        setError('Failed to load registration settings.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const data = await registrationSettingsService.updateRegistrationSettings({
        registrationOpen
      });
      setRegistrationOpen(Boolean(data.registrationOpen));
      setSaved(true);
    } catch (e) {
      setError('Failed to update registration settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Registration Visibility</h2>
        <p className="text-sm text-gray-600 mt-1">
          Control whether the registration button is visible in the navbar.
        </p>
      </div>

      {loading ? (
        <div className="text-sm text-gray-500">Loading settings...</div>
      ) : (
        <div className="space-y-4">
          <Checkbox
            id="registration-open"
            checked={registrationOpen}
            onCheckedChange={(checked) => {
              setRegistrationOpen(Boolean(checked));
              setSaved(false);
            }}
            label={registrationOpen ? 'Registration button is visible' : 'Registration button is hidden'}
          />

          {error ? (
            <div className="text-sm text-red-600">{error}</div>
          ) : null}
          {saved ? (
            <div className="text-sm text-green-600">Saved.</div>
          ) : null}

          <div>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {saving ? 'Saving...' : 'Save changes'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationSettingsEditor;

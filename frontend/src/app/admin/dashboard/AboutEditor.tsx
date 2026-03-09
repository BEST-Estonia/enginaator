"use client";

import React, { useEffect, useState } from 'react';
import { getAboutSection, updateAboutSection } from '@/services/aboutService';

const AboutEditor: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [form, setForm] = useState({
    kusContent: '',
    osalejadContent: '',
    auhinnadContent: ''
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getAboutSection();
        setForm({
          kusContent: data.kusContent,
          osalejadContent: data.osalejadContent,
          auhinnadContent: data.auhinnadContent
        });
      } catch {
        setError('Failed to load Üritusest content.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await updateAboutSection(form);
      setSuccess('Üritusest section updated successfully.');
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError('Failed to save Üritusest content.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <p className="text-sm text-gray-600">Loading Üritusest content...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Üritusest Editor</h2>
        <p className="text-sm text-gray-600 mt-1">Muuda “Kus”, “Osalejad” ja “Auhinnad” sisu avalehel.</p>
      </div>

      <form onSubmit={handleSave} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Kus</label>
          <textarea
            name="kusContent"
            value={form.kusContent}
            onChange={handleChange}
            rows={5}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Osalejad</label>
          <textarea
            name="osalejadContent"
            value={form.osalejadContent}
            onChange={handleChange}
            rows={5}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Auhinnad</label>
          <textarea
            name="auhinnadContent"
            value={form.auhinnadContent}
            onChange={handleChange}
            rows={5}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            required
          />
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {success ? <p className="text-sm text-green-600">{success}</p> : null}

        <div>
          <button
            type="submit"
            disabled={saving}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg disabled:opacity-70"
          >
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AboutEditor;

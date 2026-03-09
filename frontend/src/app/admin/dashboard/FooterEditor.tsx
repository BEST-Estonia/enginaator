"use client";

import React, { useEffect, useState } from 'react';
import { FooterPayload, getFooterSection, updateFooterSection } from '@/services/footerService';

const initialForm: FooterPayload = {
  logoUrl: '/enginaator.png',
  tagline: '',
  contactEmail: '',
  contactPhone: '',
  contactAddress: '',
  facebookUrl: '',
  instagramUrl: '',
  linkedinUrl: '',
  partner1Name: '',
  partner1LogoUrl: '',
  partner2Name: '',
  partner2LogoUrl: '',
  copyrightText: ''
};

const FooterEditor: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [form, setForm] = useState<FooterPayload>(initialForm);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getFooterSection();
        setForm({
          logoUrl: data.logoUrl,
          tagline: data.tagline,
          contactEmail: data.contactEmail,
          contactPhone: data.contactPhone,
          contactAddress: data.contactAddress,
          facebookUrl: data.facebookUrl,
          instagramUrl: data.instagramUrl,
          linkedinUrl: data.linkedinUrl,
          partner1Name: data.partner1Name,
          partner1LogoUrl: data.partner1LogoUrl,
          partner2Name: data.partner2Name,
          partner2LogoUrl: data.partner2LogoUrl,
          copyrightText: data.copyrightText
        });
      } catch {
        setError('Failed to load footer content.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await updateFooterSection(form);
      setSuccess('Footer updated successfully.');
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError('Failed to save footer content.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <p className="text-sm text-gray-600">Loading footer content...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Footer Editor</h2>
        <p className="text-sm text-gray-600 mt-1">Muuda footeri tekste, kontakte, sotsiaalmeediat ja partnerlogosid.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
          <input name="logoUrl" value={form.logoUrl} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
          <textarea name="tagline" value={form.tagline} onChange={handleChange} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2" required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
            <input name="contactEmail" value={form.contactEmail} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
            <input name="contactPhone" value={form.contactPhone} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" required />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contact Address</label>
          <input name="contactAddress" value={form.contactAddress} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
            <input name="facebookUrl" value={form.facebookUrl} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
            <input name="instagramUrl" value={form.instagramUrl} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
            <input name="linkedinUrl" value={form.linkedinUrl} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" required />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Partner 1 Name</label>
            <input name="partner1Name" value={form.partner1Name} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Partner 1 Logo URL</label>
            <input name="partner1LogoUrl" value={form.partner1LogoUrl} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Partner 2 Name</label>
            <input name="partner2Name" value={form.partner2Name} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Partner 2 Logo URL</label>
            <input name="partner2LogoUrl" value={form.partner2LogoUrl} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" required />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Copyright Text</label>
          <input name="copyrightText" value={form.copyrightText} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" required />
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {success ? <p className="text-sm text-green-600">{success}</p> : null}

        <div>
          <button type="submit" disabled={saving} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg disabled:opacity-70">
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FooterEditor;

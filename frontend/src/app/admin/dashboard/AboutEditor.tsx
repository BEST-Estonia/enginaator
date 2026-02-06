"use client";

import { useEffect, useState } from "react";
import { getAboutSection, updateAboutSection, type AboutSectionData } from "@/services/aboutService";

interface AboutEditorProps {
  setActiveSection: (section: string) => void;
}

const AboutEditor = ({ setActiveSection }: AboutEditorProps) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [about, setAbout] = useState<AboutSectionData | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setError(null);
        const data = await getAboutSection();
        setAbout(data);
      } catch (err) {
        console.error("Failed to load about section:", err);
        setError("Failed to load about section");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleChange = (field: keyof AboutSectionData, value: string) => {
    if (!about) return;
    setAbout({ ...about, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!about) return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      const updated = await updateAboutSection(about);
      setAbout(updated);
      setSuccess("About section updated successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Failed to update about section:", err);
      setError("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Üritusest Section Editor</h2>
        <button
          onClick={() => setActiveSection("dashboard")}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Back to Dashboard
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      ) : about ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kus</label>
            <textarea
              value={about.kusContent}
              onChange={(e) => handleChange("kusContent", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Osalejad</label>
            <textarea
              value={about.osalejadContent}
              onChange={(e) => handleChange("osalejadContent", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Auhinnad</label>
            <textarea
              value={about.auhinnadContent}
              onChange={(e) => handleChange("auhinnadContent", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="flex justify-end mt-8">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 font-medium"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      ) : null}
    </div>
  );
};

export default AboutEditor;

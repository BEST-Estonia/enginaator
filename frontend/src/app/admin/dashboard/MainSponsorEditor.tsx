"use client";
import React, { useEffect, useState } from "react";
import {
  getMainSponsors,
  createMainSponsor,
  createMainSponsorWithImage,
  updateMainSponsor,
  deleteMainSponsor,
  MainSponsor,
} from "@/services/mainSponsorService";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const IMAGE_BASE_URL = BACKEND_URL.replace('/api', '');

interface MainSponsorEditorProps {
  setActiveSection: (section: string) => void;
}

const MainSponsorEditor: React.FC<MainSponsorEditorProps> = ({ setActiveSection }) => {
  const [sponsors, setSponsors] = useState<MainSponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Omit<MainSponsor, "id" | "createdAt" | "updatedAt">>({
    sponsorName: "",
    sponsorText: "",
    imageUrl: "",
    website: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  // Fetch sponsors on mount
  useEffect(() => {
    getMainSponsors()
      .then(setSponsors)
      .finally(() => setLoading(false));
  }, []);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add or update sponsor
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      const updated = await updateMainSponsor(editingId, form);
      setSponsors(sponsors.map(s => (s.id === editingId ? updated : s)));
      setEditingId(null);
    } else {
      if (!selectedImage) {
        // Show error: image required
        return;
      }
      const created = await createMainSponsorWithImage(
        form.sponsorName,
        form.sponsorText,
        selectedImage,
        form.website
      );
      if (created) setSponsors([...sponsors, created]);
    }
    setForm({ sponsorName: "", sponsorText: "", imageUrl: "", website: "" });
    setSelectedImage(null);
  };

  // Edit sponsor
  const handleEdit = (sponsor: MainSponsor) => {
    setEditingId(sponsor.id);
    setForm({
      sponsorName: sponsor.sponsorName,
      sponsorText: sponsor.sponsorText,
      imageUrl: sponsor.imageUrl,
      website: sponsor.website || "",
    });
  };

  // Delete sponsor
  const handleDelete = async (id: string) => {
    await deleteMainSponsor(id);
    setSponsors(sponsors.filter(s => s.id !== id));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Main Sponsors Editor</h2>
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <input
          name="sponsorName"
          value={form.sponsorName}
          onChange={handleChange}
          placeholder="Sponsor Name"
          className="border p-2 rounded w-full"
          required
        />
        <textarea
          name="sponsorText"
          value={form.sponsorText}
          onChange={handleChange}
          placeholder="Sponsor Description"
          className="border p-2 rounded w-full"
          required
        />
    
        <input
          name="website"
          value={form.website}
          onChange={handleChange}
          placeholder="Website (optional)"
          className="border p-2 rounded w-full"
        />
        {/* Sponsor Logo Upload */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Sponsor Logo
          </label>
          <div className="space-y-3">
            {/* Custom styled file input */}
            <div className="relative">
              <label
                htmlFor="main-sponsor-logo-upload"
                className="flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition-colors group"
              >
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2 group-hover:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-600 group-hover:text-gray-700">
                    {selectedImage ? 'Change Logo Image' : 'Select Logo Image'}
                  </span>
                </span>
              </label>
              <input
                id="main-sponsor-logo-upload"
                type='file'
                accept='image/*'
                onChange={e => setSelectedImage(e.target.files?.[0] || null)}
                className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
              />
            </div>

            {/* Preview selected image */}
            {selectedImage && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-2">Preview:</p>
                <div className="h-20 flex items-center justify-center">
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    alt="Preview"
                    className="max-h-16 object-contain"
                    style={{ width: 160, height: 64 }}
                  />
                </div>
              </div>
            )}

            <p className="text-sm text-gray-500 mt-1">Upload JPG, PNG, or WebP. Max size: 5MB</p>
          </div>
        </div>
        <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded">
          {editingId ? "Update Sponsor" : "Add Sponsor"}
        </button>
        {editingId && (
          <button
            type="button"
            className="ml-2 px-4 py-2 rounded bg-gray-300"
            onClick={() => {
              setEditingId(null);
              setForm({ sponsorName: "", sponsorText: "", imageUrl: "", website: "" });
            }}
          >
            Cancel
          </button>
        )}
      </form>
      {loading ? (
        <div>Loading sponsors...</div>
      ) : (
        <ul className="space-y-4">
          {sponsors.map(sponsor => (
            <li key={sponsor.id} className="border p-4 rounded flex flex-col gap-2">
              <div className="font-bold">{sponsor.sponsorName}</div>
              <div>{sponsor.sponsorText}</div>
              {sponsor.imageUrl && (
                <img
                  src={sponsor.imageUrl}
                  alt={sponsor.sponsorName}
                  className="h-24 w-auto max-w-xs rounded object-contain mx-auto"
                />
              )}
              {sponsor.website && (
                <a href={sponsor.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  {sponsor.website}
                </a>
              )}
              <div className="flex gap-2 mt-2">
                <button
                  className="bg-yellow-400 px-3 py-1 rounded"
                  onClick={() => handleEdit(sponsor)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-400 px-3 py-1 rounded text-white"
                  onClick={() => handleDelete(sponsor.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MainSponsorEditor;
"use client";
import React, { useEffect, useState } from "react";
import {
  getMainSponsors,
  createMainSponsor,
  updateMainSponsor,
  deleteMainSponsor,
  MainSponsor,
} from "@/services/mainSponsorService";

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
      const created = await createMainSponsor(form);
      setSponsors([...sponsors, created]);
    }
    setForm({ sponsorName: "", sponsorText: "", imageUrl: "", website: "" });
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
          name="imageUrl"
          value={form.imageUrl}
          onChange={handleChange}
          placeholder="Image URL"
          className="border p-2 rounded w-full"
        />
        <input
          name="website"
          value={form.website}
          onChange={handleChange}
          placeholder="Website (optional)"
          className="border p-2 rounded w-full"
        />
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
                <img src={sponsor.imageUrl} alt={sponsor.sponsorName} className="h-16 w-auto rounded" />
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
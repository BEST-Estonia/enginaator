"use client";
import React, { useEffect, useState } from "react";
import {
  getProjectMembers,
  createProjectMember,
  updateProjectMember,
  deleteProjectMember,
  ProjectMember,
} from "@/services/projectMemberService";

const ProjectMemberEditor: React.FC = () => {
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Omit<ProjectMember, "id" | "createdAt" | "updatedAt">>({
    name: "",
    role: "",
    phone: "",
    email: "",
    imageUrl: "",
    description: "",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    getProjectMembers()
      .then(setMembers)
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      const updated = await updateProjectMember(editingId, form, selectedImage || undefined);
      setMembers(members.map(m => (m.id === editingId ? updated : m)));
      setEditingId(null);
    } else {
      const created = await createProjectMember(form, selectedImage || undefined);
      setMembers([...members, created]);
    }
    setForm({ name: "", role: "", phone: "", email: "", imageUrl: "", description: "" });
    setSelectedImage(null);
  };

  const handleEdit = (member: ProjectMember) => {
    setEditingId(member.id);
    setForm({
      name: member.name,
      role: member.role,
      phone: member.phone,
      email: member.email,
      imageUrl: member.imageUrl,
      description: member.description,
    });
  };

  const handleDelete = async (id: string) => {
    await deleteProjectMember(id);
    setMembers(members.filter(m => m.id !== id));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Project Team Editor</h2>
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          className="border p-2 rounded w-full"
          required
        />
        <input
          name="role"
          value={form.role}
          onChange={handleChange}
          placeholder="Role"
          className="border p-2 rounded w-full"
          required
        />
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="border p-2 rounded w-full"
        />
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="border p-2 rounded w-full"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="border p-2 rounded w-full"
        />
        {/* Project Member Image Upload */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Member Photo
          </label>
          <div className="space-y-3">
            {/* Custom styled file input */}
            <div className="relative">
              <label
                htmlFor="project-member-photo-upload"
                className="flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition-colors group"
              >
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2 group-hover:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-600 group-hover:text-gray-700">
                    {selectedImage ? 'Change Photo' : 'Select Photo'}
                  </span>
                </span>
              </label>
              <input
                id="project-member-photo-upload"
                type='file'
                accept='image/*'
                onChange={handleImageChange}
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
                    style={{ width: 80, height: 80, borderRadius: "50%" }}
                  />
                </div>
              </div>
            )}

            <p className="text-sm text-gray-500 mt-1">Upload JPG, PNG, or WebP. Max size: 5MB</p>
          </div>
        </div>
        <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded">
          {editingId ? "Update Member" : "Add Member"}
        </button>
        {editingId && (
          <button
            type="button"
            className="ml-2 px-4 py-2 rounded bg-gray-300"
            onClick={() => {
              setEditingId(null);
              setForm({ name: "", role: "", phone: "", email: "", imageUrl: "", description: "" });
              setSelectedImage(null);
            }}
          >
            Cancel
          </button>
        )}
      </form>
      {loading ? (
        <div>Loading members...</div>
      ) : (
        <ul className="space-y-4">
          {members.map(member => (
            <li key={member.id} className="border p-4 rounded flex flex-col gap-2">
              <div className="flex items-center gap-4">
                {member.imageUrl && (
                  <img src={member.imageUrl} alt={member.name} className="h-16 w-16 object-cover rounded-full" />
                )}
                <div>
                  <div className="font-bold">{member.name}</div>
                  <div className="text-sm text-gray-500">{member.role}</div>
                  <div className="text-sm">{member.email}</div>
                  <div className="text-sm">{member.phone}</div>
                </div>
              </div>
              <div>{member.description}</div>
              <div className="flex gap-2 mt-2">
                <button
                  className="bg-yellow-400 px-3 py-1 rounded"
                  onClick={() => handleEdit(member)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-400 px-3 py-1 rounded text-white"
                  onClick={() => handleDelete(member.id)}
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

export default ProjectMemberEditor;
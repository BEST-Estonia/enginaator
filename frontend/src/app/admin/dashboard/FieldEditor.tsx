"use client";
import React, { useEffect, useState } from "react";
import { getFields, createField, updateField, deleteField, Field } from "@/services/fieldService";

interface FieldEditorProps {
  setActiveSection: (section: string) => void;
}

const FieldEditor: React.FC<FieldEditorProps> = ({ setActiveSection }) => {
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Omit<Field, "id" | "createdAt" | "updatedAt">>({
    name: "",
    description: "",
    icon: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    getFields()
      .then(setFields)
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      const updated = await updateField(editingId, form);
      setFields(fields.map(f => (f.id === editingId ? updated : f)));
      setEditingId(null);
    } else {
      const created = await createField(form);
      setFields([...fields, created]);
    }
    setForm({ name: "", description: "", icon: "" });
  };

  const handleEdit = (field: Field) => {
    setEditingId(field.id);
    setForm({
      name: field.name,
      description: field.description,
      icon: field.icon,
    });
  };

  const handleDelete = async (id: string) => {
    await deleteField(id);
    setFields(fields.filter(f => f.id !== id));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Fields Editor</h2>
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Field Name"
          className="border p-2 rounded w-full"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Field Description"
          className="border p-2 rounded w-full"
          required
        />
        <input
          name="icon"
          value={form.icon}
          onChange={handleChange}
          placeholder="Icon name (e.g. Cpu, Cog, Building, Code)"
          className="border p-2 rounded w-full"
          required
        />
        <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded">
          {editingId ? "Update Field" : "Add Field"}
        </button>
        {editingId && (
          <button
            type="button"
            className="ml-2 px-4 py-2 rounded bg-gray-300"
            onClick={() => {
              setEditingId(null);
              setForm({ name: "", description: "", icon: "" });
            }}
          >
            Cancel
          </button>
        )}
      </form>
      {loading ? (
        <div>Loading fields...</div>
      ) : (
        <ul className="space-y-4">
          {fields.map(field => (
            <li key={field.id} className="border p-4 rounded flex flex-col gap-2">
              <div className="font-bold">{field.name}</div>
              <div>{field.description}</div>
              <div className="text-sm text-gray-500">Icon: {field.icon}</div>
              <div className="flex gap-2 mt-2">
                <button
                  className="bg-yellow-400 px-3 py-1 rounded"
                  onClick={() => handleEdit(field)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-400 px-3 py-1 rounded text-white"
                  onClick={() => handleDelete(field.id)}
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

export default FieldEditor;
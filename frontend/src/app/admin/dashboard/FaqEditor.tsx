"use client";

import React, { useEffect, useMemo, useState } from 'react';
import {
  FaqItem,
  createFaqItem,
  deleteFaqItem,
  getFaqItems,
  updateFaqItem
} from '@/services/faqService';

interface FaqEditorProps {
  setActiveSection: (section: string) => void;
}

const emptyForm = {
  category: 'Küsimused',
  question: '',
  answer: '',
  order: 0
};

const FaqEditor: React.FC<FaqEditorProps> = () => {
  const [items, setItems] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const sortedItems = useMemo(
    () => [...items].sort((a, b) => a.category.localeCompare(b.category) || a.order - b.order),
    [items]
  );

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getFaqItems();
        setItems(data);
      } catch (e) {
        setError('Failed to load FAQ items.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'order') {
      setForm((prev) => ({ ...prev, order: Number(value) || 0 }));
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (editingId) {
        const updated = await updateFaqItem(editingId, form);
        setItems((prev) => prev.map((item) => (item.id === editingId ? updated : item)));
      } else {
        const created = await createFaqItem(form);
        setItems((prev) => [...prev, created]);
      }
      resetForm();
    } catch (err) {
      setError('Failed to save FAQ item.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item: FaqItem) => {
    setEditingId(item.id);
    setForm({
      category: item.category,
      question: item.question,
      answer: item.answer,
      order: item.order
    });
    setError(null);
  };

  const handleDelete = async (id: string) => {
    setError(null);
    try {
      await deleteFaqItem(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      if (editingId === id) {
        resetForm();
      }
    } catch (err) {
      setError('Failed to delete FAQ item.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">FAQ Management</h2>
        <p className="text-sm text-gray-600">Lisa, muuda ja kustuta korduma kippuvaid küsimusi.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
            <input
              name="order"
              type="number"
              min={0}
              value={form.order}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
          <input
            name="question"
            value={form.question}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Answer</label>
          <textarea
            name="answer"
            value={form.answer}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            required
          />
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg disabled:opacity-70"
          >
            {saving ? 'Saving...' : editingId ? 'Update FAQ' : 'Add FAQ'}
          </button>
          {editingId ? (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
          ) : null}
        </div>
      </form>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current FAQ Items</h3>
        {loading ? (
          <p className="text-sm text-gray-600">Loading FAQ items...</p>
        ) : sortedItems.length === 0 ? (
          <p className="text-sm text-gray-600">No FAQ items yet.</p>
        ) : (
          <ul className="space-y-3">
            {sortedItems.map((item) => (
              <li key={item.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 mb-1">{item.category} • order {item.order}</p>
                    <p className="font-semibold text-gray-900 break-words">{item.question}</p>
                    <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">{item.answer}</p>
                  </div>
                  <div className="flex items-start gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleEdit(item)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-3 py-1.5 rounded"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FaqEditor;

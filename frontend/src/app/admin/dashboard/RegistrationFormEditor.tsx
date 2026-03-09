"use client";

import React, { useEffect, useMemo, useState } from 'react';
import {
  RegistrationQuestion,
  RegistrationQuestionPayload,
  RegistrationQuestionType,
  createRegistrationQuestion,
  deleteRegistrationQuestion,
  getRegistrationQuestionsAdmin,
  updateRegistrationQuestion
} from '@/services/registrationFormService';

const QUESTION_TYPES: RegistrationQuestionType[] = ['text', 'textarea', 'email', 'number', 'select', 'checkbox'];

const emptyForm: RegistrationQuestionPayload = {
  label: '',
  fieldKey: '',
  type: 'text',
  required: false,
  placeholder: '',
  options: [],
  order: 0,
  active: true
};

const RegistrationFormEditor: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [questions, setQuestions] = useState<RegistrationQuestion[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [optionsInput, setOptionsInput] = useState('');
  const [form, setForm] = useState<RegistrationQuestionPayload>(emptyForm);

  const sortedQuestions = useMemo(
    () => [...questions].sort((a, b) => a.order - b.order || a.label.localeCompare(b.label)),
    [questions]
  );

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getRegistrationQuestionsAdmin();
        setQuestions(data);
      } catch {
        setError('Failed to load registration form questions.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setOptionsInput('');
  };

  const toPayload = (): RegistrationQuestionPayload => ({
    ...form,
    placeholder: form.placeholder || null,
    options:
      form.type === 'select'
        ? optionsInput
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean)
        : null
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = toPayload();
      if (payload.type === 'select' && (!payload.options || payload.options.length === 0)) {
        setError('Select type question needs at least one option.');
        setSaving(false);
        return;
      }

      if (editingId) {
        const updated = await updateRegistrationQuestion(editingId, payload);
        setQuestions((prev) => prev.map((item) => (item.id === editingId ? updated : item)));
        setSuccess('Question updated.');
      } else {
        const created = await createRegistrationQuestion(payload);
        setQuestions((prev) => [...prev, created]);
        setSuccess('Question added.');
      }

      resetForm();
      setTimeout(() => setSuccess(null), 2500);
    } catch {
      setError('Failed to save question.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (question: RegistrationQuestion) => {
    setEditingId(question.id);
    setForm({
      label: question.label,
      fieldKey: question.fieldKey,
      type: question.type,
      required: question.required,
      placeholder: question.placeholder || '',
      options: question.options || [],
      order: question.order,
      active: question.active
    });
    setOptionsInput((question.options || []).join(', '));
    setError(null);
    setSuccess(null);
  };

  const handleDelete = async (id: string) => {
    setError(null);
    setSuccess(null);
    try {
      await deleteRegistrationQuestion(id);
      setQuestions((prev) => prev.filter((item) => item.id !== id));
      if (editingId === id) {
        resetForm();
      }
      setSuccess('Question deleted.');
      setTimeout(() => setSuccess(null), 2500);
    } catch {
      setError('Failed to delete question.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Registration Form Editor</h2>
        <p className="text-sm text-gray-600 mt-1">
          Halda lisaküsimusi, mida registreerimisel küsitakse. Valdkonnad hallatakse “Fields Management” alt.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
            <input
              value={form.label}
              onChange={(e) => setForm((prev) => ({ ...prev, label: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Field key</label>
            <input
              value={form.fieldKey}
              onChange={(e) => setForm((prev) => ({ ...prev, fieldKey: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="nt emergencyContact"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value as RegistrationQuestionType }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              {QUESTION_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
            <input
              type="number"
              min={0}
              value={form.order}
              onChange={(e) => setForm((prev) => ({ ...prev, order: Number(e.target.value) || 0 }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Placeholder</label>
          <input
            value={form.placeholder || ''}
            onChange={(e) => setForm((prev) => ({ ...prev, placeholder: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        {form.type === 'select' ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Options (comma separated)</label>
            <input
              value={optionsInput}
              onChange={(e) => setOptionsInput(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="option1, option2, option3"
            />
          </div>
        ) : null}

        <div className="flex items-center gap-6">
          <label className="inline-flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.required}
              onChange={(e) => setForm((prev) => ({ ...prev, required: e.target.checked }))}
            />
            Required
          </label>

          <label className="inline-flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm((prev) => ({ ...prev, active: e.target.checked }))}
            />
            Active
          </label>
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {success ? <p className="text-sm text-green-600">{success}</p> : null}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg disabled:opacity-70"
          >
            {saving ? 'Saving...' : editingId ? 'Update question' : 'Add question'}
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
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current custom questions</h3>
        {loading ? (
          <p className="text-sm text-gray-600">Loading questions...</p>
        ) : sortedQuestions.length === 0 ? (
          <p className="text-sm text-gray-600">No custom questions yet.</p>
        ) : (
          <ul className="space-y-3">
            {sortedQuestions.map((question) => (
              <li key={question.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900">{question.label}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      key: {question.fieldKey} • type: {question.type} • order: {question.order} • {question.required ? 'required' : 'optional'} • {question.active ? 'active' : 'inactive'}
                    </p>
                    {question.type === 'select' && Array.isArray(question.options) ? (
                      <p className="text-xs text-gray-600 mt-1">options: {question.options.join(', ')}</p>
                    ) : null}
                  </div>
                  <div className="flex items-start gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleEdit(question)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-3 py-1.5 rounded"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(question.id)}
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

export default RegistrationFormEditor;

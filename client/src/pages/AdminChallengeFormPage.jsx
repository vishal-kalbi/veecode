import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function AdminChallengeFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({
    title: '', slug: '', description: '', examples: '[]',
    constraints_text: '', difficulty: 'easy', topic: 'arrays', starter_code: '{}',
  });
  const [testCases, setTestCases] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    Promise.all([
      api.get(`/admin/challenges`),
      api.get(`/admin/challenges/${id}/test-cases`),
    ]).then(([chalRes, tcRes]) => {
      const ch = chalRes.data.find((c) => c.id === parseInt(id));
      if (ch) {
        setForm({
          title: ch.title, slug: ch.slug, description: ch.description,
          examples: typeof ch.examples === 'string' ? ch.examples : JSON.stringify(ch.examples, null, 2),
          constraints_text: ch.constraints_text || '',
          difficulty: ch.difficulty, topic: ch.topic,
          starter_code: typeof ch.starter_code === 'string' ? ch.starter_code : JSON.stringify(ch.starter_code, null, 2),
        });
      }
      setTestCases(tcRes.data);
    }).catch(() => toast.error('Failed to load')).finally(() => setLoading(false));
  }, [id]);

  const handleChange = (key, value) => {
    setForm((prev) => {
      const updated = { ...prev, [key]: value };
      if (key === 'title' && !isEdit) updated.slug = slugify(value);
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        examples: JSON.parse(form.examples),
        starter_code: JSON.parse(form.starter_code),
      };
      if (isEdit) {
        await api.put(`/admin/challenges/${id}`, payload);
        toast.success('Challenge updated');
      } else {
        await api.post('/admin/challenges', payload);
        toast.success('Challenge created');
      }
      navigate('/admin/challenges');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const addTestCase = async () => {
    if (!isEdit) return;
    try {
      const res = await api.post(`/admin/challenges/${id}/test-cases`, {
        input: '', expected_output: '', is_sample: false, order_index: testCases.length + 1,
      });
      setTestCases((prev) => [...prev, res.data]);
    } catch { toast.error('Failed to add test case'); }
  };

  const updateTestCase = async (tcId, field, value) => {
    const tc = testCases.find((t) => t.id === tcId);
    if (!tc) return;
    const updated = { ...tc, [field]: value };
    try {
      await api.put(`/admin/test-cases/${tcId}`, updated);
      setTestCases((prev) => prev.map((t) => t.id === tcId ? updated : t));
    } catch { toast.error('Failed to update'); }
  };

  const deleteTestCase = async (tcId) => {
    try {
      await api.delete(`/admin/test-cases/${tcId}`);
      setTestCases((prev) => prev.filter((t) => t.id !== tcId));
    } catch { toast.error('Failed to delete'); }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-400"></div></div>;
  }

  const inputClass = 'w-full bg-gray-700 text-white px-4 py-2.5 rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
      <h1 className="text-2xl font-bold text-white mb-6">{isEdit ? 'Edit Challenge' : 'Create Challenge'}</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 text-sm mb-1">Title</label>
            <input type="text" value={form.title} onChange={(e) => handleChange('title', e.target.value)} required className={inputClass} />
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-1">Slug</label>
            <input type="text" value={form.slug} onChange={(e) => handleChange('slug', e.target.value)} required className={inputClass} />
          </div>
        </div>

        <div>
          <label className="block text-gray-300 text-sm mb-1">Description (Markdown)</label>
          <textarea value={form.description} onChange={(e) => handleChange('description', e.target.value)} rows={8} required className={inputClass} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 text-sm mb-1">Difficulty</label>
            <select value={form.difficulty} onChange={(e) => handleChange('difficulty', e.target.value)} className={inputClass}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-1">Topic</label>
            <input type="text" value={form.topic} onChange={(e) => handleChange('topic', e.target.value)} required className={inputClass} />
          </div>
        </div>

        <div>
          <label className="block text-gray-300 text-sm mb-1">Examples (JSON array)</label>
          <textarea value={form.examples} onChange={(e) => handleChange('examples', e.target.value)} rows={4} className={`${inputClass} font-mono text-xs`} />
        </div>

        <div>
          <label className="block text-gray-300 text-sm mb-1">Constraints</label>
          <textarea value={form.constraints_text} onChange={(e) => handleChange('constraints_text', e.target.value)} rows={3} className={inputClass} />
        </div>

        <div>
          <label className="block text-gray-300 text-sm mb-1">Starter Code (JSON object)</label>
          <textarea value={form.starter_code} onChange={(e) => handleChange('starter_code', e.target.value)} rows={4} className={`${inputClass} font-mono text-xs`} />
        </div>

        <button type="submit" disabled={saving} className="bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white px-6 py-2.5 rounded-lg transition font-medium">
          {saving ? 'Saving...' : isEdit ? 'Update Challenge' : 'Create Challenge'}
        </button>
      </form>

      {/* Test Cases (only when editing) */}
      {isEdit && (
        <div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Test Cases</h2>
            <button onClick={addTestCase} className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded-lg text-sm transition">+ Add Test Case</button>
          </div>
          <div className="space-y-3">
            {testCases.map((tc) => (
              <div key={tc.id} className="bg-gray-800 rounded-lg p-4 space-y-2">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-gray-400 text-xs">Input</label>
                    <textarea value={tc.input} onChange={(e) => updateTestCase(tc.id, 'input', e.target.value)}
                      rows={2} className={`${inputClass} text-xs font-mono mt-1`} />
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs">Expected Output</label>
                    <textarea value={tc.expected_output} onChange={(e) => updateTestCase(tc.id, 'expected_output', e.target.value)}
                      rows={2} className={`${inputClass} text-xs font-mono mt-1`} />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-gray-400 text-xs">
                    <input type="checkbox" checked={tc.is_sample} onChange={(e) => updateTestCase(tc.id, 'is_sample', e.target.checked)} />
                    Sample (visible to users)
                  </label>
                  <input type="number" value={tc.order_index} onChange={(e) => updateTestCase(tc.id, 'order_index', parseInt(e.target.value))}
                    className="bg-gray-700 text-white px-2 py-1 rounded text-xs w-16 border border-gray-600" placeholder="Order" />
                  <button onClick={() => deleteTestCase(tc.id)} className="text-red-400 hover:underline text-xs ml-auto">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

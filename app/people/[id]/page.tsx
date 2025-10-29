'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PersonWithSignals, Signal } from '@/lib/types';

export default function EditPersonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [person, setPerson] = useState<PersonWithSignals | null>(null);
  const [showAddSignal, setShowAddSignal] = useState(false);
  const [newSignal, setNewSignal] = useState({
    signal_type: 'other' as const,
    title: '',
    description: '',
    url: '',
    source: 'manual',
  });

  useEffect(() => {
    fetchPerson();
  }, [id]);

  async function fetchPerson() {
    try {
      const res = await fetch(`/api/people/${id}`);
      const data = await res.json();
      setPerson(data);
    } catch (error) {
      console.error('Failed to fetch person:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!person) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/people/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(person),
      });

      if (!res.ok) throw new Error('Failed to update person');
      router.push('/people');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to update person');
    } finally {
      setSaving(false);
    }
  }

  async function addSignal() {
    if (!newSignal.title) {
      alert('Please enter a signal title');
      return;
    }

    try {
      const res = await fetch('/api/signals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newSignal,
          person_id: id,
        }),
      });

      if (!res.ok) throw new Error('Failed to add signal');

      // Reset form and refresh
      setNewSignal({
        signal_type: 'other',
        title: '',
        description: '',
        url: '',
        source: 'manual',
      });
      setShowAddSignal(false);
      fetchPerson();
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add signal');
    }
  }

  async function generateMessageNow() {
    if (!confirm('Generate a message draft for this person now?')) return;

    try {
      const res = await fetch('/api/messages/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ person_id: id }),
      });

      if (!res.ok) throw new Error('Failed to generate message');

      alert('Message draft created! Check your dashboard.');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate message');
    }
  }

  if (loading || !person) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href="/people" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to People
        </Link>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Edit Person</h1>
          <button
            onClick={generateMessageNow}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Generate Message Now
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Same form fields as new page */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name *</label>
                <input
                  type="text"
                  required
                  value={person.name}
                  onChange={(e) => setPerson({ ...person, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={person.email || ''}
                  onChange={(e) => setPerson({ ...person, email: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Role</label>
                  <input
                    type="text"
                    value={person.role || ''}
                    onChange={(e) => setPerson({ ...person, role: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Company</label>
                  <input
                    type="text"
                    value={person.company || ''}
                    onChange={(e) => setPerson({ ...person, company: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={person.tags.join(', ')}
                  onChange={(e) =>
                    setPerson({
                      ...person,
                      tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Relationship</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Priority: {person.priority}/10
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={person.priority}
                  onChange={(e) =>
                    setPerson({ ...person, priority: parseInt(e.target.value) })
                  }
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Temperature</label>
                <select
                  value={person.relationship_temperature}
                  onChange={(e) =>
                    setPerson({
                      ...person,
                      relationship_temperature: e.target.value as 'hot' | 'warm' | 'cold',
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="hot">Hot</option>
                  <option value="warm">Warm</option>
                  <option value="cold">Cold</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Interests (comma-separated)
                </label>
                <input
                  type="text"
                  value={person.interests.join(', ')}
                  onChange={(e) =>
                    setPerson({
                      ...person,
                      interests: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Notes</label>
                <textarea
                  value={person.notes || ''}
                  onChange={(e) => setPerson({ ...person, notes: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  rows={4}
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Links to Monitor</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">LinkedIn URL</label>
                <input
                  type="url"
                  value={person.linkedin_url || ''}
                  onChange={(e) => setPerson({ ...person, linkedin_url: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Twitter Handle</label>
                <input
                  type="text"
                  value={person.twitter_handle || ''}
                  onChange={(e) => setPerson({ ...person, twitter_handle: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  placeholder="@username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Company Domain</label>
                <input
                  type="text"
                  value={person.company_domain || ''}
                  onChange={(e) => setPerson({ ...person, company_domain: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  placeholder="company.com"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <Link
              href="/people"
              className="px-8 py-3 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>

        {/* Signals Section */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Signals</h2>
            <button
              onClick={() => setShowAddSignal(!showAddSignal)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {showAddSignal ? 'Cancel' : '+ Add Signal'}
            </button>
          </div>

          {showAddSignal && (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select
                    value={newSignal.signal_type}
                    onChange={(e) =>
                      setNewSignal({ ...newSignal, signal_type: e.target.value as any })
                    }
                    className="w-full px-3 py-2 border rounded dark:bg-gray-600 dark:border-gray-500"
                  >
                    <option value="article">Article</option>
                    <option value="press">Press</option>
                    <option value="job_change">Job Change</option>
                    <option value="funding">Funding</option>
                    <option value="speaking">Speaking</option>
                    <option value="social_post">Social Post</option>
                    <option value="product_launch">Product Launch</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Title *</label>
                  <input
                    type="text"
                    value={newSignal.title}
                    onChange={(e) => setNewSignal({ ...newSignal, title: e.target.value })}
                    className="w-full px-3 py-2 border rounded dark:bg-gray-600 dark:border-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={newSignal.description}
                    onChange={(e) =>
                      setNewSignal({ ...newSignal, description: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded dark:bg-gray-600 dark:border-gray-500"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">URL</label>
                  <input
                    type="url"
                    value={newSignal.url}
                    onChange={(e) => setNewSignal({ ...newSignal, url: e.target.value })}
                    className="w-full px-3 py-2 border rounded dark:bg-gray-600 dark:border-gray-500"
                  />
                </div>
                <button
                  onClick={addSignal}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Add Signal
                </button>
              </div>
            </div>
          )}

          {person.signals && person.signals.length > 0 ? (
            <div className="space-y-3">
              {person.signals.map((signal: Signal) => (
                <div
                  key={signal.id}
                  className="p-4 border dark:border-gray-600 rounded-lg"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-semibold">{signal.title}</div>
                    <div className="flex gap-2 items-center">
                      <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded">
                        {signal.signal_type}
                      </span>
                      <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                        {signal.relevance_score}% relevant
                      </span>
                    </div>
                  </div>
                  {signal.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {signal.description}
                    </p>
                  )}
                  {signal.url && (
                    <a
                      href={signal.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View source →
                    </a>
                  )}
                  <div className="text-xs text-gray-500 mt-2">
                    {new Date(signal.detected_at).toLocaleDateString()} • {signal.source}
                    {signal.used_in_message && ' • Used in message'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No signals yet. Add one manually or wait for automatic detection.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

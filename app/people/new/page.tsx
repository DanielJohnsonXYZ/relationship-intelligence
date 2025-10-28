'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewPersonPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    company: string;
    role: string;
    tags: string;
    priority: number;
    linkedin_url: string;
    twitter_handle: string;
    company_domain: string;
    personal_website: string;
    relationship_temperature: 'hot' | 'warm' | 'cold';
    notes: string;
    interests: string;
  }>({
    name: '',
    email: '',
    company: '',
    role: '',
    tags: '',
    priority: 5,
    linkedin_url: '',
    twitter_handle: '',
    company_domain: '',
    personal_website: '',
    relationship_temperature: 'warm',
    notes: '',
    interests: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
        interests: formData.interests.split(',').map((t) => t.trim()).filter(Boolean),
      };

      const res = await fetch('/api/people', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to create person');

      router.push('/people');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to create person');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Link href="/people" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to People
        </Link>

        <h1 className="text-4xl font-bold mb-8">Add New Person</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Basic Information</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Jane Smith"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  placeholder="jane@company.com"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Role</label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    placeholder="CEO"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Company</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Acme Inc"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  placeholder="investor, founder, operator"
                />
              </div>
            </div>
          </div>

          {/* Relationship */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Relationship</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Priority: {formData.priority}/10
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: parseInt(e.target.value) })
                  }
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Temperature</label>
                <select
                  value={formData.relationship_temperature}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
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
                  value={formData.interests}
                  onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  placeholder="AI, startups, climate tech"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Notes (context for AI)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  rows={4}
                  placeholder="Met at conference 2024. Working on climate tech. Interested in..."
                />
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Links to Monitor</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">LinkedIn URL</label>
                <input
                  type="url"
                  value={formData.linkedin_url}
                  onChange={(e) =>
                    setFormData({ ...formData, linkedin_url: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  placeholder="https://linkedin.com/in/janesmith"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Twitter Handle</label>
                <input
                  type="text"
                  value={formData.twitter_handle}
                  onChange={(e) =>
                    setFormData({ ...formData, twitter_handle: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  placeholder="@janesmith"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Company Domain</label>
                <input
                  type="text"
                  value={formData.company_domain}
                  onChange={(e) =>
                    setFormData({ ...formData, company_domain: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  placeholder="acme.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Personal Website</label>
                <input
                  type="url"
                  value={formData.personal_website}
                  onChange={(e) =>
                    setFormData({ ...formData, personal_website: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  placeholder="https://janesmith.com"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Person'}
            </button>
            <Link
              href="/people"
              className="px-8 py-3 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Person } from '@/lib/types';

export default function PeoplePage() {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchPeople();
  }, []);

  async function fetchPeople() {
    try {
      const res = await fetch('/api/people');
      const data = await res.json();
      setPeople(data);
    } catch (error) {
      console.error('Failed to fetch people:', error);
    } finally {
      setLoading(false);
    }
  }

  async function deletePerson(id: string) {
    if (!confirm('Are you sure you want to delete this person?')) return;

    try {
      await fetch(`/api/people/${id}`, { method: 'DELETE' });
      setPeople(people.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Failed to delete person:', error);
      alert('Failed to delete person');
    }
  }

  const filteredPeople = people.filter((p) => {
    if (filter === 'all') return true;
    if (filter === 'high-priority') return p.priority >= 7;
    if (filter === 'due-soon') {
      const daysUntil = Math.ceil(
        (new Date(p.next_contact_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );
      return daysUntil <= 7;
    }
    return p.relationship_temperature === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link href="/" className="text-blue-600 hover:underline mb-2 inline-block">
              ← Home
            </Link>
            <h1 className="text-4xl font-bold">People</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {people.length} people in your network
            </p>
          </div>
          <Link
            href="/people/new"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Add Person
          </Link>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { value: 'all', label: 'All' },
            { value: 'high-priority', label: 'High Priority' },
            { value: 'due-soon', label: 'Due Soon' },
            { value: 'hot', label: 'Hot' },
            { value: 'warm', label: 'Warm' },
            { value: 'cold', label: 'Cold' },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === f.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* People List */}
        {filteredPeople.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center">
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
              No people found
            </p>
            <Link
              href="/people/new"
              className="text-blue-600 hover:underline"
            >
              Add your first person
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredPeople.map((person) => {
              const daysUntil = Math.ceil(
                (new Date(person.next_contact_date).getTime() - Date.now()) /
                  (1000 * 60 * 60 * 24)
              );
              const isDue = daysUntil <= 0;

              return (
                <div
                  key={person.id}
                  className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold">{person.name}</h3>
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            person.relationship_temperature === 'hot'
                              ? 'bg-red-100 text-red-700'
                              : person.relationship_temperature === 'warm'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {person.relationship_temperature}
                        </span>
                        <span className="text-sm text-gray-500">
                          Priority: {person.priority}/10
                        </span>
                      </div>

                      {(person.role || person.company) && (
                        <p className="text-gray-600 dark:text-gray-400 mb-2">
                          {person.role}
                          {person.role && person.company && ' at '}
                          {person.company}
                        </p>
                      )}

                      {person.tags.length > 0 && (
                        <div className="flex gap-2 mb-3">
                          {person.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <span className={isDue ? 'text-red-600 font-semibold' : ''}>
                          {isDue
                            ? `Due ${Math.abs(daysUntil)} days ago`
                            : `Next contact in ${daysUntil} days`}
                        </span>
                        {person.last_contact_date && (
                          <span className="ml-4">
                            Last: {new Date(person.last_contact_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        href={`/people/${person.id}`}
                        className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => deletePerson(person.id)}
                        className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

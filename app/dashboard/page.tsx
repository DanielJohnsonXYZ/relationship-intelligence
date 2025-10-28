'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MessageWithPerson } from '@/lib/types';

export default function DashboardPage() {
  const [messages, setMessages] = useState<MessageWithPerson[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedDraft, setEditedDraft] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    try {
      const res = await fetch('/api/messages');
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateMessage(id: string, updates: Partial<MessageWithPerson>) {
    try {
      await fetch(`/api/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      setMessages(messages.filter((m) => m.id !== id));
      setEditingId(null);
    } catch (error) {
      console.error('Failed to update message:', error);
      alert('Failed to update message');
    }
  }

  function startEditing(message: MessageWithPerson) {
    setEditingId(message.id);
    setEditedDraft(message.draft);
  }

  function saveEdit(id: string) {
    updateMessage(id, { final_sent: editedDraft, status: 'sent' });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:underline mb-2 inline-block">
            ← Home
          </Link>
          <h1 className="text-4xl font-bold">Message Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {messages.length} messages ready for review
          </p>
        </div>

        {/* Messages */}
        {messages.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
              No messages ready to review
            </p>
            <p className="text-gray-500 dark:text-gray-500 mb-6">
              Messages will appear here when it's time to reach out to someone
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/people"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Manage People
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md"
              >
                {/* Person Info */}
                <div className="mb-4 pb-4 border-b dark:border-gray-700">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-bold mb-1">
                        {message.person?.name}
                      </h3>
                      {(message.person?.role || message.person?.company) && (
                        <p className="text-gray-600 dark:text-gray-400">
                          {message.person?.role}
                          {message.person?.role && message.person?.company && ' at '}
                          {message.person?.company}
                        </p>
                      )}
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <div>Channel: {message.channel}</div>
                      {message.person?.last_contact_date && (
                        <div>
                          Last contact:{' '}
                          {new Date(message.person.last_contact_date).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* AI Reasoning */}
                {message.ai_reasoning && (
                  <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-1">
                      Why now:
                    </div>
                    <div className="text-sm text-blue-800 dark:text-blue-300">
                      {message.ai_reasoning}
                    </div>
                  </div>
                )}

                {/* Message Draft */}
                <div className="mb-4">
                  <div className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                    Draft message:
                  </div>
                  {editingId === message.id ? (
                    <textarea
                      value={editedDraft}
                      onChange={(e) => setEditedDraft(e.target.value)}
                      className="w-full px-4 py-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 font-sans"
                      rows={6}
                    />
                  ) : (
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg whitespace-pre-wrap font-sans">
                      {message.draft}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 flex-wrap">
                  {editingId === message.id ? (
                    <>
                      <button
                        onClick={() => saveEdit(message.id)}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        ✓ Save & Send
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-6 py-2 bg-gray-300 dark:bg-gray-600 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => updateMessage(message.id, { status: 'sent', final_sent: message.draft })}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        ✓ Send as-is
                      </button>
                      <button
                        onClick={() => startEditing(message)}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => updateMessage(message.id, { status: 'skipped' })}
                        className="px-6 py-2 bg-gray-300 dark:bg-gray-600 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                      >
                        ⏭️ Skip
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

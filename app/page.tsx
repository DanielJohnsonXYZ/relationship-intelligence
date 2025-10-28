import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Relationship Intelligence
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Stay thoughtfully connected with the people who matter
            </p>
          </div>

          {/* Quick Nav */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Link
              href="/dashboard"
              className="group p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-blue-500"
            >
              <div className="text-4xl mb-4">📬</div>
              <h2 className="text-2xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                Review Messages
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                See AI-drafted messages ready to send
              </p>
            </Link>

            <Link
              href="/people"
              className="group p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-indigo-500"
            >
              <div className="text-4xl mb-4">👥</div>
              <h2 className="text-2xl font-bold mb-2 group-hover:text-indigo-600 transition-colors">
                Manage People
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Add and update your relationship network
              </p>
            </Link>
          </div>

          {/* Features */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold mb-6">How it works</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="text-2xl">🎯</div>
                <div>
                  <h4 className="font-semibold mb-1">Smart Signal Detection</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Monitors LinkedIn, Twitter, news, and more for meaningful updates from your network
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-2xl">🤖</div>
                <div>
                  <h4 className="font-semibold mb-1">AI Message Drafts</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Claude crafts thoughtful messages in your voice, referencing specific details
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-2xl">📅</div>
                <div>
                  <h4 className="font-semibold mb-1">Adaptive Timing</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Smart scheduling based on signals, priority, and relationship health
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-2xl">💌</div>
                <div>
                  <h4 className="font-semibold mb-1">Review & Send</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Edit, approve, or skip each message before it goes out
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Setup CTA */}
          <div className="mt-12 text-center">
            <Link
              href="/people/new"
              className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
            >
              Add Your First Person
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

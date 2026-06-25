'use client';
import { useState } from 'react';

const languages = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' }
];

const sampleCode: Record<string, string> = {
  javascript: `function getUserData(id) {
  fetch('/api/users/' + id)
    .then(res => res.json())
    .then(data => {
      document.getElementById('name').innerHTML = data.name;
    });
}

getUserData(1);`,
  typescript: `interface User {
  id: string;
  role: 'admin' | 'user';
}

function deleteUser(user: User) {
  if (user.role == 'admin') {
    console.log("Cannot delete admin user");
    return;
  }
  // Perform action without checking auth state
  fetch(\`/api/users/\${user.id}\`, { method: 'DELETE' });
}`,
  python: `def divide_numbers(a, b):
    return a / b

def process_list(items):
    for i in range(len(items)):
        items[i] = items[i] * 2
    return items`,
  rust: `fn main() {
    let mut num = 5;
    let r1 = &num;
    let r2 = &mut num; // Potential borrow checker conflict
    println!("Values: {}, {}", r1, r2);
}`
};

export default function CodeReviewer() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleReview = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setError('');
    setReview('');

    try {
      const res = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to process the review request.');
      }
      setReview(data.review);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadSample = () => {
    setCode(sampleCode[language] || '');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md sticky top-0 z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/10">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-white flex items-center gap-2">
                Sentinel Code Reviewer
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">Beta</span>
              </h1>
              <p className="text-xs text-slate-400">Generative AI static analysis environment</p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-slate-900 text-slate-200 text-sm rounded-lg px-3 py-2 border border-slate-800 focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer w-full sm:w-auto"
            >
              {languages.map(l => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
            <button
              onClick={loadSample}
              className="text-xs text-slate-300 hover:text-white px-3 py-2 border border-slate-800 hover:bg-slate-900 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Load Sample
            </button>
          </div>
        </div>
      </header>

      {/* Main Panel */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side: Input code */}
        <div className="flex flex-col h-full min-h-[500px] bg-slate-900/40 rounded-2xl border border-slate-800/80 overflow-hidden backdrop-blur-sm">
          <div className="px-5 py-3 border-b border-slate-800/80 bg-slate-950/30 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-500/60" />
              <span className="h-3 w-3 rounded-full bg-yellow-500/60" />
              <span className="h-3 w-3 rounded-full bg-green-500/60" />
              <span className="text-xs text-slate-400 font-mono ml-2">Editor ({language})</span>
            </div>
            <button
              onClick={() => setCode('')}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
              disabled={!code}
            >
              Clear
            </button>
          </div>

          <div className="relative flex-1">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={`// Write or paste your ${language} code here...`}
              className="absolute inset-0 w-full h-full p-5 bg-transparent text-slate-300 font-mono text-sm leading-relaxed focus:outline-none resize-none overflow-y-auto placeholder:text-slate-600"
              spellCheck={false}
            />
          </div>

          <div className="p-4 border-t border-slate-800/60 bg-slate-950/20">
            <button
              onClick={handleReview}
              disabled={loading || !code.trim()}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 text-white rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/10 disabled:shadow-none"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Analyzing Code Environment...</span>
                </>
              ) : (
                <>
                  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                  </svg>
                  <span>Trigger Analysis</span>
                </>
              )}
            </button>

            {error && (
              <div className="mt-3 p-3 bg-red-950/40 border border-red-900/50 rounded-lg flex gap-2 items-start text-xs text-red-300">
                <svg className="w-4 h-4 text-red-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Analysis report */}
        <div className="flex flex-col h-full bg-slate-900/40 rounded-2xl border border-slate-800/80 overflow-hidden backdrop-blur-sm">
          <div className="px-5 py-3 border-b border-slate-800/80 bg-slate-950/30 flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Analysis Assessment</h2>
            {review && (
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            )}
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            {review ? (
              <div className="space-y-6 text-sm text-slate-300 font-sans leading-relaxed">
                {/* Parse key headings to provide custom rendering if available, otherwise fallback to raw formatted markdown */}
                <div className="prose prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-slate-300 text-sm leading-relaxed overflow-x-auto bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                    {review}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 my-auto">
                <div className="h-12 w-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-4 text-slate-500">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-slate-200 mb-1">Waiting for code submission</h3>
                <p className="text-xs text-slate-500 max-w-xs">
                  Provide blocks of raw code inside the source environment editor and execute review.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { login, isLoggedIn } from '../lib/storage';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (isLoggedIn()) router.replace('/dashboard');
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (username === 'admin' && password === '123456') {
      setLoading(true);
      login();
      setTimeout(() => router.replace('/dashboard'), 400);
    } else {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative blobs adjusted for layout */}
      <div 
        className="absolute top-0 right-0 w-[40vw] h-[40vw] rounded-full opacity-30 blur-[80px] pointer-events-none"
        style={{ background: '#D9A441', transform: 'translate(20%, -20%)' }}
      />
      <div 
        className="absolute bottom-0 left-0 w-[50vw] h-[50vw] rounded-full opacity-30 blur-[100px] pointer-events-none"
        style={{ background: '#6EC1C3', transform: 'translate(-20%, 20%)' }}
      />

      <div className="glass relative w-full max-w-md rounded-3xl p-8 sm:p-10 z-10 transition-all duration-300">
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black neu-btn-primary shadow-lg">
            GG
          </div>
          <div className="text-center mt-2">
            <h1 className="text-2xl font-bold text-[#1F2A2E]">
              Golden Goals
            </h1>
            <p className="text-sm mt-1 text-[#5F6B6F]">
              Admin Portal
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#1F2A2E] ml-1">
              Username
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9AA5A9]">
                <User size={18} />
              </span>
              <input
                id="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                required
                className="neu-inset w-full pl-10 pr-4 py-3.5 text-sm cursor-text text-[#1F2A2E]"
                autoFocus
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#1F2A2E] ml-1">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9AA5A9]">
                <Lock size={18} />
              </span>
              <input
                id="password"
                type={showPass ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                required
                className="neu-inset w-full pl-10 pr-12 py-3.5 text-sm cursor-text text-[#1F2A2E]"
              />
              <button
                type="button"
                onClick={() => setShowPass((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9AA5A9] hover:text-[#5AB0B2] transition-colors outline-none cursor-pointer p-1"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-sm px-4 py-3 rounded-xl bg-red-50 text-red-600 border border-red-200 flex items-center gap-2">
              <AlertCircle size={16} /> <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="neu-btn-primary w-full py-4 mt-2 font-bold text-sm"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-xs mt-8 text-[#5F6B6F]">
          Use <strong className="font-semibold text-[#1F2A2E]">admin</strong> / <strong className="font-semibold text-[#1F2A2E]">123456</strong>
        </p>
      </div>
    </div>
  );
}

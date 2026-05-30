import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Terminal } from 'lucide-react';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    const result = await signup(name, email, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-app-bg flex flex-col items-center pt-24 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm flex flex-col items-center">
        {/* Logo and Title */}
        <div className="mb-6 flex flex-col items-center">
          <Terminal className="w-12 h-12 text-app-text mb-6" />
          <h1 className="text-2xl font-light text-app-text tracking-tight">Create your account</h1>
        </div>

        {/* Error Message */}
        {error && (
          <div className="w-full mb-4 px-4 py-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Signup Card */}
        <div className="w-full bg-app-bg-subtle border border-app-border rounded-md p-4 shadow-sm mb-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-app-text mb-1" htmlFor="name">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-1.5 bg-app-bg border border-app-border rounded-md text-app-text text-sm focus:outline-none focus:ring-2 focus:ring-app-accent focus:border-transparent transition-shadow"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-app-text mb-1" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-1.5 bg-app-bg border border-app-border rounded-md text-app-text text-sm focus:outline-none focus:ring-2 focus:ring-app-accent focus:border-transparent transition-shadow"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-app-text mb-1" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-1.5 bg-app-bg border border-app-border rounded-md text-app-text text-sm focus:outline-none focus:ring-2 focus:ring-app-accent focus:border-transparent transition-shadow"
              />
              <p className="text-xs text-app-text-muted mt-2">
                Make sure it's at least 6 characters.
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-app-btn-primary hover:bg-app-btn-primary-hover text-white font-medium py-1.5 px-4 rounded-md text-sm transition-colors border border-[rgba(27,31,36,0.15)] shadow-sm mt-4"
            >
              Sign up
            </button>
          </form>
        </div>

        {/* Login prompt */}
        <div className="w-full border border-app-border rounded-md p-4 text-center text-sm text-app-text mt-2">
          Already have an account?{' '}
          <Link to="/login" className="text-app-accent hover:underline">
            Sign in
          </Link>
          .
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Terminal } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const result = await login(email, password);
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
          <h1 className="text-2xl font-light text-app-text tracking-tight">Sign in to AI Chat</h1>
        </div>

        {/* Error Message */}
        {error && (
          <div className="w-full mb-4 px-4 py-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Login Card */}
        <div className="w-full bg-app-bg-subtle border border-app-border rounded-md p-4 shadow-sm mb-4">
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-app-text" htmlFor="password">
                  Password
                </label>
                {/* <a href="#" className="text-xs text-app-accent hover:underline">Forgot password?</a> */}
              </div>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-1.5 bg-app-bg border border-app-border rounded-md text-app-text text-sm focus:outline-none focus:ring-2 focus:ring-app-accent focus:border-transparent transition-shadow"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-app-btn-primary hover:bg-app-btn-primary-hover text-white font-medium py-1.5 px-4 rounded-md text-sm transition-colors border border-[rgba(27,31,36,0.15)] shadow-sm"
            >
              Sign in
            </button>
          </form>
        </div>

        {/* Sign up prompt */}
        <div className="w-full border border-app-border rounded-md p-4 text-center text-sm text-app-text mt-2">
          New to AI Chat?{' '}
          <Link to="/signup" className="text-app-accent hover:underline">
            Create an account
          </Link>
          .
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

export default function PasswordResetPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      );

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password-confirm`,
      });

      if (resetError) {
        setError(resetError.message);
        return;
      }

      setSent(true);
      setMessage(
        'Password reset link sent! Check your email for instructions. The link expires in 24 hours.'
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy to-forest flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-navy mb-2">Check Your Email</h1>
          <p className="text-gray-600 mb-6">
            We've sent a password reset link to <strong>{email}</strong>
          </p>

          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-6">
            {message}
          </div>

          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              The reset link will expire in 24 hours. If you don't receive the email, check your
              spam folder.
            </p>

            <Link
              href="/auth/login"
              className="block w-full bg-forest text-white font-semibold py-2 rounded-lg hover:bg-opacity-90 transition text-center"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy to-forest flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-navy mb-2">Reset Password</h1>
        <p className="text-gray-600 mb-6">Enter your email to receive a password reset link</p>

        <form onSubmit={handleResetRequest} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest"
              placeholder="you@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-forest text-white font-semibold py-2 rounded-lg hover:bg-opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Remember your password?{' '}
          <Link href="/auth/login" className="text-forest font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

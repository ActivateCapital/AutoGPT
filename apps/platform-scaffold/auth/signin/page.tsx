'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { Bot, Github, Mail } from 'lucide-react';
import Link from 'next/link';

export default function SignInPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const error = searchParams.get('error');

  const handleSignIn = (provider: string) => {
    signIn(provider, { callbackUrl });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <Bot className="w-12 h-12 text-purple-400" />
            <span className="text-3xl font-bold text-white">CreAI</span>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Sign in to your account to continue</p>
        </div>

        {/* Sign In Card */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-8 backdrop-blur-sm">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
              <p className="text-red-400 text-sm">
                {error === 'OAuthSignin' && 'Error occurred during sign in. Please try again.'}
                {error === 'OAuthCallback' && 'Error occurred during authentication callback.'}
                {error === 'OAuthCreateAccount' && 'Could not create account. Please try again.'}
                {error === 'EmailCreateAccount' && 'Could not create account. Please try again.'}
                {error === 'Callback' && 'Error occurred during sign in. Please try again.'}
                {error === 'OAuthAccountNotLinked' &&
                  'This email is already associated with another account.'}
                {error === 'EmailSignin' && 'Error sending sign in email. Please try again.'}
                {error === 'CredentialsSignin' && 'Sign in failed. Please check your credentials.'}
                {error === 'SessionRequired' && 'Please sign in to access this page.'}
                {!['OAuthSignin', 'OAuthCallback', 'OAuthCreateAccount', 'EmailCreateAccount', 'Callback', 'OAuthAccountNotLinked', 'EmailSignin', 'CredentialsSignin', 'SessionRequired'].includes(error) &&
                  'An error occurred. Please try again.'}
              </p>
            </div>
          )}

          {/* Sign In Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => handleSignIn('google')}
              className="w-full px-6 py-3 bg-white hover:bg-gray-100 text-gray-900 font-semibold rounded-lg transition-all flex items-center justify-center gap-3"
            >
              <Mail className="w-5 h-5" />
              Continue with Google
            </button>

            <button
              onClick={() => handleSignIn('github')}
              className="w-full px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-3 border border-white/20"
            >
              <Github className="w-5 h-5" />
              Continue with GitHub
            </button>
          </div>

          {/* Terms */}
          <p className="mt-6 text-center text-xs text-gray-400">
            By signing in, you agree to our{' '}
            <Link href="/terms" className="text-purple-400 hover:text-purple-300">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-purple-400 hover:text-purple-300">
              Privacy Policy
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

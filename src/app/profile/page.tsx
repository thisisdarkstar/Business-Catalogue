'use client';

import { useAuth } from '@/components/AuthProvider';
import { Loader2, LogIn } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, loading, signIn } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">My Profile</h1>
          
          <div className="text-center py-20 bg-card rounded-2xl border border-border">
            <LogIn className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Sign in to view your profile</h2>
            <p className="text-muted-foreground mb-6">Track orders, manage favorites, and more</p>
            <button
              onClick={signIn}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-bg text-white font-semibold hover:opacity-90 transition-all"
            >
              Sign In with Google
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        
        <div className="bg-card rounded-2xl border border-border p-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="h-24 w-24 rounded-full gradient-bg flex items-center justify-center">
              <span className="text-white text-3xl font-bold">
                {user.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user.email?.split('@')[0]}</h2>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={user.email || ''}
                disabled
                className="w-full px-4 py-3 rounded-xl bg-secondary border border-border cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">User ID</label>
              <input
                type="text"
                value={user.id}
                disabled
                className="w-full px-4 py-3 rounded-xl bg-secondary border border-border cursor-not-allowed text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { BookOpen, LogOut } from 'lucide-react';

export default function Layout() {
  const { isAuthenticated, signOut, profile } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex items-center">
                <BookOpen className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">Viversed</span>
              </Link>
            </div>
            
            <div className="flex items-center">
              {isAuthenticated ? (
                <>
                  <span className="mr-4 text-gray-700">
                    Welcome, {profile?.full_name}
                  </span>
                  {profile?.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="mr-4 text-gray-600 hover:text-gray-900"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => signOut()}
                    className="flex items-center text-gray-600 hover:text-gray-900"
                  >
                    <LogOut className="h-5 w-5 mr-1" />
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/"
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../stores/authStore';
import { BookOpen } from 'lucide-react';

type AuthMode = 'login' | 'signup';

export default function Home() {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<AuthMode>('login');
  const [formData, setFormData] = useState({
    rollNumber: '',
    fullName: '',
    password: '',
  });

  const validateRollNumber = (rollNumber: string) => {
    const regex = /^[0-9]{5}[A-Z][0-9]{4}$/;
    return regex.test(rollNumber);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!validateRollNumber(formData.rollNumber)) {
        toast.error('Invalid roll number format (e.g., 23331A0501)');
        return;
      }

      if (mode === 'login') {
        try {
          await signIn(formData.rollNumber, formData.password);
          toast.success('Welcome back!');
          navigate('/dashboard');
        } catch (error: any) {
          if (error.message === 'USER_NOT_FOUND') {
            toast.error('User not found. Please sign up first.');
            setMode('signup');
          } else {
            toast.error('Invalid credentials');
          }
        }
      } else {
        if (formData.fullName.length < 2 || formData.fullName.length > 50) {
          toast.error('Full name must be between 2 and 50 characters');
          return;
        }

        await signUp(formData.rollNumber, formData.fullName, formData.password);
        toast.success('Account created successfully!');
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast.error(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-center mb-6">
          <BookOpen className="h-12 w-12 text-indigo-600" />
        </div>
        <h1 className="text-2xl font-bold text-center mb-2 text-gray-800">Welcome to Viversed</h1>
        <p className="text-center text-gray-600 mb-6">
          {mode === 'login' ? 'Sign in to access your account' : 'Create a new account'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="rollNumber" className="block text-sm font-medium text-gray-700">
              Roll Number
            </label>
            <input
              type="text"
              id="rollNumber"
              placeholder="e.g., 23331A0501"
              value={formData.rollNumber}
              onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value.toUpperCase() })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          {mode === 'signup' && (
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required={mode === 'signup'}
              />
            </div>
          )}

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password (Optional)
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              Leave blank to use your roll number as password
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="text-sm text-indigo-600 hover:text-indigo-500"
          >
            {mode === 'login' 
              ? "Don't have an account? Sign Up" 
              : 'Already have an account? Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
}
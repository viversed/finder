import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  profile: any | null;
  signIn: (rollNumber: string, password?: string) => Promise<void>;
  signUp: (rollNumber: string, fullName: string, password?: string) => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: any) => void;
  setProfile: (profile: any) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  profile: null,
  signIn: async (rollNumber: string, password?: string) => {
    try {
      // First, check if the user exists
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .eq('student_id', rollNumber)
        .single();

      if (!profiles) {
        throw new Error('USER_NOT_FOUND');
      }

      // If user exists, proceed with authentication
      const email = `${rollNumber}@viversed.edu`; // Using a consistent email format
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: password || rollNumber // Use roll number as password if none provided
      });

      if (error) throw error;

      // Fetch profile after successful login
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      set({ isAuthenticated: true, user: data.user, profile });
    } catch (error: any) {
      if (error.message === 'USER_NOT_FOUND') {
        throw new Error('USER_NOT_FOUND');
      }
      throw error;
    }
  },
  signUp: async (rollNumber: string, fullName: string, password?: string) => {
    try {
      // Validate roll number format
      const rollNumberRegex = /^[0-9]{5}[A-Z][0-9]{4}$/;
      if (!rollNumberRegex.test(rollNumber)) {
        throw new Error('Invalid roll number format');
      }

      // Validate full name
      if (fullName.length < 2 || fullName.length > 50) {
        throw new Error('Full name must be between 2 and 50 characters');
      }

      const email = `${rollNumber}@viversed.edu`;
      const finalPassword = password || rollNumber; // Use roll number as password if none provided

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: finalPassword,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Failed to create user');

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            student_id: rollNumber,
            full_name: fullName,
            role: 'student'
          }
        ]);

      if (profileError) throw profileError;

      set({ 
        isAuthenticated: true, 
        user: authData.user,
        profile: {
          id: authData.user.id,
          student_id: rollNumber,
          full_name: fullName,
          role: 'student'
        }
      });
    } catch (error: any) {
      throw error;
    }
  },
  signOut: async () => {
    await supabase.auth.signOut();
    set({ isAuthenticated: false, user: null, profile: null });
  },
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setProfile: (profile) => set({ profile }),
}));
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          student_id: string;
          full_name: string;
          role: 'student' | 'admin';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          student_id: string;
          full_name: string;
          role?: 'student' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          full_name?: string;
          role?: 'student' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
      };
      documents: {
        Row: {
          id: string;
          title: string;
          subject: string;
          course_code: string;
          language: 'Telugu' | 'Hindi' | 'English';
          drive_link: string;
          video_link: string | null;
          uploaded_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          subject: string;
          course_code: string;
          language: 'Telugu' | 'Hindi' | 'English';
          drive_link: string;
          video_link?: string | null;
          uploaded_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          subject?: string;
          course_code?: string;
          language?: 'Telugu' | 'Hindi' | 'English';
          drive_link?: string;
          video_link?: string | null;
          uploaded_by?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      analytics: {
        Row: {
          id: string;
          document_id: string;
          user_id: string;
          action: 'view' | 'download' | 'search';
          created_at: string;
        };
        Insert: {
          id?: string;
          document_id: string;
          user_id: string;
          action: 'view' | 'download' | 'search';
          created_at?: string;
        };
        Update: {
          id?: string;
          document_id?: string;
          user_id?: string;
          action?: 'view' | 'download' | 'search';
          created_at?: string;
        };
      };
    };
  };
}
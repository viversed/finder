/*
  # Initial Viversed Platform Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key)
      - `student_id` (text, unique)
      - `full_name` (text)
      - `role` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `documents`
      - `id` (uuid, primary key)
      - `title` (text)
      - `subject` (text)
      - `course_code` (text)
      - `language` (text)
      - `drive_link` (text)
      - `video_link` (text)
      - `uploaded_by` (uuid, references profiles)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `analytics`
      - `id` (uuid, primary key)
      - `document_id` (uuid, references documents)
      - `user_id` (uuid, references profiles)
      - `action` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Add admin-specific policies
*/

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  student_id text UNIQUE CHECK (student_id ~ '^[0-9]{5}[A-Z][0-9]{4}$'),
  full_name text NOT NULL CHECK (char_length(full_name) BETWEEN 2 AND 50),
  role text NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create documents table
CREATE TABLE documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subject text NOT NULL,
  course_code text NOT NULL,
  language text NOT NULL CHECK (language IN ('Telugu', 'Hindi', 'English')),
  drive_link text NOT NULL,
  video_link text,
  uploaded_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create analytics table
CREATE TABLE analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid REFERENCES documents(id),
  user_id uuid REFERENCES profiles(id),
  action text NOT NULL CHECK (action IN ('view', 'download', 'search')),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Documents policies
CREATE POLICY "Anyone can view documents"
  ON documents FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can insert documents"
  ON documents FOR INSERT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  ));

CREATE POLICY "Only admins can update documents"
  ON documents FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  ));

-- Analytics policies
CREATE POLICY "Users can view their own analytics"
  ON analytics FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own analytics"
  ON analytics FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Create indexes
CREATE INDEX idx_documents_subject ON documents(subject);
CREATE INDEX idx_documents_course_code ON documents(course_code);
CREATE INDEX idx_documents_language ON documents(language);
CREATE INDEX idx_analytics_document_id ON analytics(document_id);
CREATE INDEX idx_analytics_user_id ON analytics(user_id);
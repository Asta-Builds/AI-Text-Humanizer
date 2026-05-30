-- Create user_history table
CREATE TABLE IF NOT EXISTS public.user_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  original_text TEXT NOT NULL,
  humanized_text TEXT NOT NULL,
  options JSONB NOT NULL,
  metrics JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_history ENABLE ROW LEVEL SECURITY;

-- Enable SELECT policy for authenticated users owning the data
CREATE POLICY "Allow authenticated users to read their own history"
ON public.user_history
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Enable INSERT policy for authenticated users owning the data
CREATE POLICY "Allow authenticated users to insert their own history"
ON public.user_history
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Enable DELETE policy for authenticated users owning the data
CREATE POLICY "Allow authenticated users to delete their own history"
ON public.user_history
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Create a table for user resumes
create table resumes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  content jsonb default '{}'::jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table resumes enable row level security;

-- Policies
create policy "Users can view their own resumes."
  on resumes for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own resumes."
  on resumes for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own resumes."
  on resumes for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own resumes."
  on resumes for delete
  using ( auth.uid() = user_id );

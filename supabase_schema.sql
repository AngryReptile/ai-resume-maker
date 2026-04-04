-- 1. Create a table for user profiles
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  role text default 'user' check (role in ('user', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create a table for user resumes
create table if not exists resumes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  content jsonb default '{}'::jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Set up Row Level Security (RLS)
alter table profiles enable row level security;
alter table resumes enable row level security;

-- 4. Clean up existing objects (to prevent "already exists" errors)
drop policy if exists "Public profiles are viewable by everyone." on profiles;
drop policy if exists "Users can update their own profiles." on profiles;
drop policy if exists "Admins can update all profiles." on profiles;
drop policy if exists "Users can view their own resumes." on resumes;
drop policy if exists "Admins can view all resumes." on resumes;
drop policy if exists "Users can insert their own resumes." on resumes;
drop policy if exists "Users can update their own resumes." on resumes;
drop policy if exists "Users can delete their own resumes." on resumes;
drop trigger if exists on_auth_user_created on auth.users;

-- 5. Create RLS Policies
-- Profiles: Select is public, update is owner only
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can update their own profiles." on profiles for update using (auth.uid() = id);
create policy "Admins can update all profiles." on profiles for update using ((select role from profiles where id = auth.uid()) = 'admin');

-- Resumes: Owners can do anything, admins can see everything
create policy "Users can view their own resumes." on resumes for select using (auth.uid() = user_id);
create policy "Admins can view all resumes." on resumes for select using ((select role from profiles where id = auth.uid()) = 'admin');
create policy "Users can insert their own resumes." on resumes for insert with check (auth.uid() = user_id);
create policy "Users can update their own resumes." on resumes for update using (auth.uid() = user_id);
create policy "Users can delete their own resumes." on resumes for delete using (auth.uid() = user_id);

-- 6. Create New User Trigger Function
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'User'),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', 'https://api.dicebear.com/7.x/initials/svg?seed=' || new.email),
    'user'
  )
  on conflict (id) do update
  set email = excluded.email,
      full_name = case when excluded.full_name is not null then excluded.full_name else profiles.full_name end,
      avatar_url = case when excluded.avatar_url is not null then excluded.avatar_url else profiles.avatar_url end;
  return new;
end;
$$ language plpgsql security definer;

-- 7. Attach Trigger to auth.users
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

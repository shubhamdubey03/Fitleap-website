-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users Table
create table public.users (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text not null,
  role text check (role in ('Member', 'Trainer', 'Admin')) default 'Member',
  status text check (status in ('Active', 'Inactive', 'Pending')) default 'Active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Vendors Table
create table public.vendors (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  category text not null,
  rating float default 0,
  revenue float default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Clients Table
create table public.clients (
  id uuid default uuid_generate_v4() primary key,
  company_name text not null,
  contact_person text not null,
  plan_tier text check (plan_tier in ('Startup', 'Professional', 'Enterprise')) default 'Startup',
  users_count int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS) - Optional: Enable if you want to restrict direct access
alter table public.users enable row level security;
alter table public.vendors enable row level security;
alter table public.clients enable row level security;

-- Open access policy (for dev purposes, tighten this for production)
create policy "Public Access" on public.users for all using (true);
create policy "Public Access" on public.vendors for all using (true);
create policy "Public Access" on public.clients for all using (true);

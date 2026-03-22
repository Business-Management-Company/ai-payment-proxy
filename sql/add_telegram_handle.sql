-- Run this in Supabase SQL Editor:
alter table public.customers add column if not exists telegram_handle text default '';

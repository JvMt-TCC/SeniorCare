-- Add trusted contact fields to profiles table
ALTER TABLE public.profiles
ADD COLUMN trusted_contact_name text,
ADD COLUMN trusted_contact_phone text,
ADD COLUMN trusted_contact_address text;
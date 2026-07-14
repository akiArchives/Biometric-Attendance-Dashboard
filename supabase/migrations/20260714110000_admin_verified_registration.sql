-- Create enum type for registration status
CREATE TYPE registration_status AS ENUM ('pending', 'approved', 'rejected');

-- Add status column defaulting to 'approved' for existing users (so current admin is safe)
ALTER TABLE public.profiles ADD COLUMN status registration_status DEFAULT 'approved';

-- Set default status to 'pending' for all future signups
ALTER TABLE public.profiles ALTER COLUMN status SET DEFAULT 'pending';

-- Enforce NOT NULL constraint
ALTER TABLE public.profiles ALTER COLUMN status SET NOT NULL;

-- Drop the insecure update policy that allows self-promotion and self-approval
DROP POLICY "Allow update profile for own user" ON public.profiles;

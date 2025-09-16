-- Add PayPal subscription fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN paypal_subscription_id TEXT,
ADD COLUMN paypal_subscription_status TEXT,
ADD COLUMN payment_method TEXT DEFAULT 'stripe';

-- Create tips table for tracking supporter contributions
CREATE TABLE public.tips (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  supporter_name TEXT,
  supporter_email TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'GBP',
  message TEXT,
  payment_method TEXT NOT NULL DEFAULT 'paypal',
  paypal_order_id TEXT,
  stripe_payment_intent_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on tips table
ALTER TABLE public.tips ENABLE ROW LEVEL SECURITY;

-- Create policies for tips table
CREATE POLICY "Tips are viewable by the artist" 
ON public.tips 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Anyone can create tips" 
ON public.tips 
FOR INSERT 
WITH CHECK (true);

-- Create function and trigger for tips updated_at
CREATE TRIGGER update_tips_updated_at
BEFORE UPDATE ON public.tips
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
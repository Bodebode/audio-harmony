-- Fix function search path security issue

CREATE OR REPLACE FUNCTION public.is_payment_field_update()
RETURNS BOOLEAN 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- This function will be used to detect if someone is trying to update payment fields
  -- For now, we'll allow all updates but this can be enhanced with triggers
  RETURN FALSE;
END;
$$;
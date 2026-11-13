DROP POLICY IF EXISTS "Anyone can create support submissions" ON public.support_submissions;

CREATE POLICY "Supporters can create submissions for themselves"
ON public.support_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (
  ((SELECT auth.uid()) = user_id)
  OR ((SELECT auth.uid()) IS NULL AND user_id IS NULL)
);
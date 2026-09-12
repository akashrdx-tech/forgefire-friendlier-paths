-- Remove direct public/anon access to the SECURITY DEFINER helper used inside RLS policies.
REVOKE EXECUTE ON FUNCTION public.are_friends(uuid, uuid) FROM PUBLIC;

-- Add a restrictive policy to the gate config table (only service_role uses it).
CREATE POLICY "no direct access" ON public.gate_config FOR ALL TO authenticated, anon USING (false) WITH CHECK (false);
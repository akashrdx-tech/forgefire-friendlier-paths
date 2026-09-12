CREATE TABLE public.chat_vault (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  pin_hash text NOT NULL,
  hint text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.chat_vault TO authenticated;
GRANT ALL ON public.chat_vault TO service_role;

ALTER TABLE public.chat_vault ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own vault select" ON public.chat_vault FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "own vault insert" ON public.chat_vault FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own vault update" ON public.chat_vault FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own vault delete" ON public.chat_vault FOR DELETE TO authenticated
  USING (auth.uid() = user_id);
/**
 * Shared placeholder for scaffolded routes (ARCHITECTURE.md §3).
 * Real implementations land in later phases; these stubs keep the app
 * compilable and navigable for Phase 1 verification.
 */
export function RouteStub({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-start justify-center gap-3 px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
        Route placeholder
      </p>
      <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
        {title}
      </h1>
      <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">{description}</p>
    </main>
  );
}
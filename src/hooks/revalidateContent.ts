import { revalidatePath } from 'next/cache'

export function revalidateContent({ context }: { context: Record<string, unknown> }) {
  if (!context.skipRevalidate) {
    // CLI seed/migrations have no Next request context. Public pages also render dynamically.
    try { revalidatePath('/', 'layout') } catch { /* No page cache exists in CLI processes. */ }
  }
}

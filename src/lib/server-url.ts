/** Use Vercel's assigned production domain for server actions and CSRF checks. */
export function resolveServerURL(
  env: Record<string, string | undefined> = process.env,
): string {
  const productionHost =
    env.VERCEL_ENV === "production"
      ? env.VERCEL_PROJECT_PRODUCTION_URL
      : undefined;
  return new URL(
    productionHost
      ? `https://${productionHost}`
      : env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000",
  ).origin;
}

import test from "node:test";
import assert from "node:assert/strict";
import { resolveServerURL } from "../src/lib/server-url";

test("production server actions trust the assigned Vercel domain when an imported URL is stale", () => {
  assert.equal(
    resolveServerURL({
      VERCEL_ENV: "production",
      VERCEL_PROJECT_PRODUCTION_URL: "portfolio-kappa.vercel.app",
      NEXT_PUBLIC_SERVER_URL: "https://old-portfolio.vercel.app",
    }),
    "https://portfolio-kappa.vercel.app",
  );
});
test("local and self-hosted origins stay explicit and omit trailing paths", () => {
  assert.equal(
    resolveServerURL({ NEXT_PUBLIC_SERVER_URL: "https://portfolio.example/" }),
    "https://portfolio.example",
  );
  assert.equal(resolveServerURL({}), "http://localhost:3000");
  assert.equal(
    resolveServerURL({
      VERCEL_ENV: "development",
      VERCEL_PROJECT_PRODUCTION_URL: "portfolio.example",
      NEXT_PUBLIC_SERVER_URL: "http://localhost:3001",
    }),
    "http://localhost:3001",
  );
});

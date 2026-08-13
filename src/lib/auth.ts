import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { Pool } from "pg";
/**
 * Better Auth server instance — ARCHITECTURE.md §4.
 *
 * The JWT plugin is enabled so the frontend can attach a short-lived signed
 * bearer token to every call to the separate Express backend, which verifies
 * it independently (no shared session store between the two services).
 *
 * Google OAuth is enabled for "Continue with Google" (FR-1 social option).
 * Configure GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET in .env.local.
 */
export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.POSTGRESQL_URI,
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  plugins: [jwt()],
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // refresh sliding window every 24h
  },
  user: {
    additionalFields: {
      // Role-aware UI (FR-3). Stored on the user record so session claims carry
      // `role` for middleware/proxy route protection (ARCHITECTURE.md §4 step 5).
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
       //ettable from the client — admin-managed only
      },
    },
  },
});
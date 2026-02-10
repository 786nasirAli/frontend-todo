import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { jwt } from "better-auth/plugins";

// Debugging logs to check if env vars are loaded on server
console.log("--- Auth Config Debug ---");
console.log("BETTER_AUTH_URL:", process.env.BETTER_AUTH_URL);
console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID ? "Loaded" : "Missing");
console.log("GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET ? "Loaded" : "Missing");
console.log("DATABASE_URL:", process.env.DATABASE_URL ? "Loaded" : "Missing");

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.error("CRITICAL: Google Credentials are missing in auth.ts");
}

export const auth = betterAuth({
    database: new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    }),
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL,
    trustedOrigins: [
        "http://localhost:3000",
        "https://sikandarali-your-todo-backend.hf.space"
    ],
    emailAndPassword: {
        enabled: true
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
    // Enable account linking to allow Google login for existing email users
    account: {
        accountLinking: {
            enabled: true,
            trustedProviders: ["google"], // Trust Google verified emails
        }
    },
    plugins: [
        jwt({
            jwt: {
                secret: process.env.JWT_SECRET
            }
        })
    ]
});
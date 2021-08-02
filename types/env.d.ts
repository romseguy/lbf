declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test";
    DATABASE_URL: string;
    NEXT_PUBLIC_IS_TEST?: boolean;
    NEXT_PUBLIC_URL: string;
    NEXT_PUBLIC_API: string;
    NEXT_PUBLIC_GOOGLE_PLACES_API_KEY: string;
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    NEXTAUTH_URL: string;
    SECRET: string;
    EMAIL_SERVER: string;
    EMAIL_API_KEY: string;
    EMAIL_FROM: string;
    EMAIL_ADMIN: string;
  }
}

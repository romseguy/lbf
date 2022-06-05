import type { MongoClient, Db } from "mongodb";

declare global {
  namespace NodeJS {
    interface Global {
      _mongoClientPromise: Promise<MongoClient>; //next-auth
      mongo: {
        conn: {
          client: MongoClient;
          db: Db;
        } | null;
        promise: Promise<{
          client: MongoClient;
          db: Db;
        }> | null;
      };
    }
    interface ProcessEnv {
      NODE_ENV: "development" | "production" | "test";
      NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY: string;
      NEXT_PUBLIC_TITLE: string;
      NEXT_PUBLIC_SHORT_URL: string;
      NEXT_PUBLIC_URL: string;
      NEXT_PUBLIC_API: string;
      NEXT_PUBLIC_API2: string;
      NEXT_PUBLIC_GOOGLE_ENABLED: string;
      NEXT_PUBLIC_GOOGLE_PLACES_API_KEY: string;
      NEXTAUTH_URL: string;
      SECRET: string;
      EMAIL_SERVER: string;
      EMAIL_API_KEY: string;
      EMAIL_FROM: string;
      EMAIL_ADMIN: string;
      NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY: string;
      WEB_PUSH_PRIVATE_KEY: string;
      DATABASE_URL: string;
    }
  }
}

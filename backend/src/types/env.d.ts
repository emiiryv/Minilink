declare namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      JWT_SECRET: string;
      BASE_URL?: string;
      PORT?: string;
    }
  }
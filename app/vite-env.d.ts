/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_CLIENT_ID: string;
  readonly VITE_GEMINI_API_KEY?: string;
  // Stats Configuration
  readonly VITE_INITIAL_RECAPS_COUNT?: string;
  readonly VITE_INITIAL_ACTIVE_USERS?: string;
  readonly VITE_RATING_DEFAULT?: string;
  readonly VITE_UPTIME_PERCENTAGE?: string;
  readonly VITE_ADMIN_OVERRIDE_RECAPS?: string;
  readonly VITE_ADMIN_OVERRIDE_USERS?: string;
  readonly VITE_ADMIN_OVERRIDE_RATING?: string;
  readonly VITE_ADMIN_OVERRIDE_UPTIME?: string;
  readonly VITE_ENABLE_STATS_TRACKING?: string;
  readonly VITE_ENABLE_USER_RATING?: string;
  readonly VITE_ENABLE_DYNAMIC_UPDATES?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

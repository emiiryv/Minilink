export interface LinkStats {
    id: number;
    original_url: string;
    short_code: string;
    click_count: number;
    created_at: string;
    expires_at: string | null;
    short_url: string;
  }
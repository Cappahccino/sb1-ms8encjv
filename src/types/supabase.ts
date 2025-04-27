export interface Database {
  public: {
    Tables: {
      files: {
        Row: {
          id: string;
          name: string;
          path: string;
          mime_type: string | null;
          size: number | null;
          created_at: string | null;
          updated_at: string | null;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          path: string;
          mime_type?: string | null;
          size?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          path?: string;
          mime_type?: string | null;
          size?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
          created_by?: string | null;
        };
      };
    };
  };
}
// Database types matching Supabase schema
import { Mode, Difficulty, Duration } from "./types";

export interface Database {
  public: {
    Tables: {
      sessions: {
        Row: SessionRow;
        Insert: SessionInsert;
        Update: SessionUpdate;
      };
    };
  };
}

// Session record from database (includes id and created_at)
export interface SessionRow {
  id: string;
  user_id: string;
  mode: Mode;
  difficulty: Difficulty;
  duration: Duration;
  correct: number;
  total: number;
  accuracy: number;
  ppm: number;
  skipped?: boolean;
  created_at: string;
}

// Data required to insert a new session
export interface SessionInsert {
  user_id: string;
  mode: Mode;
  difficulty: Difficulty;
  duration: Duration;
  correct: number;
  total: number;
  accuracy: number;
  ppm: number;
  skipped?: boolean;
}

// Data that can be updated (typically none for immutable sessions)
export interface SessionUpdate {
  // Sessions are immutable once created
}

// Client-side session data (before saving to DB)
export interface SessionData {
  mode: Mode;
  difficulty: Difficulty;
  duration: Duration;
  correct: number;
  total: number;
  accuracy: string; // From utils, needs parsing
  ppm: string; // From utils, needs parsing
  skipped: boolean; // Whether user pressed F to finish early
}

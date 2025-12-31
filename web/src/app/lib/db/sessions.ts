// Data access layer - isolates all database operations
import { createClient } from "../supabase/client";
import { SessionInsert, SessionRow, SessionData } from "../database.types";

/**
 * Save a completed session to the database
 * Only call this when gameState transitions to "finished"
 */
export async function saveSession(data: SessionData): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      // Guest mode - don't save
      return { success: false, error: "Not authenticated" };
    }

    // Parse string values to numbers
    const accuracy = parseFloat(data.accuracy);
    const ppm = parseFloat(data.ppm);

    // Prepare session data
    const sessionInsert: SessionInsert = {
      user_id: user.id,
      mode: data.mode,
      difficulty: data.difficulty,
      duration: data.duration,
      correct: data.correct,
      total: data.total,
      accuracy: isNaN(accuracy) ? 0 : accuracy,
      ppm: isNaN(ppm) ? 0 : ppm,
      skipped: data.skipped || false,
    };

    // Insert into database
    const { error } = await supabase
      .from("sessions")
      .insert(sessionInsert as any);

    if (error) {
      console.error("Failed to save session:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Unexpected error saving session:", error);
    return { success: false, error: "Unexpected error" };
  }
}

/**
 * Fetch recent sessions for the current user
 * @param limit Number of sessions to fetch (default: 10)
 */
export async function getRecentSessions(limit: number = 10): Promise<{
  sessions: SessionRow[];
  error?: string;
}> {
  try {
    const supabase = createClient();
    
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { sessions: [], error: "Not authenticated" };
    }

    // Fetch sessions ordered by most recent
    const { data, error } = await supabase
      .from("sessions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Failed to fetch sessions:", error);
      return { sessions: [], error: error.message };
    }

    return { sessions: (data || []) as SessionRow[] };
  } catch (error) {
    console.error("Unexpected error fetching sessions:", error);
    return { sessions: [], error: "Unexpected error" };
  }
}

/**
 * Fetch all sessions for the current user
 */
export async function getAllSessions(): Promise<{
  sessions: SessionRow[];
  error?: string;
}> {
  try {
    const supabase = createClient();
    
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { sessions: [], error: "Not authenticated" };
    }

    // Fetch all sessions ordered by most recent
    const { data, error } = await supabase
      .from("sessions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch all sessions:", error);
      return { sessions: [], error: error.message };
    }

    return { sessions: (data || []) as SessionRow[] };
  } catch (error) {
    console.error("Unexpected error fetching all sessions:", error);
    return { sessions: [], error: "Unexpected error" };
  }
}

/**
 * Get summary statistics for the current user
 */
export async function getUserStats(): Promise<{
  totalSessions: number;
  averageAccuracy: number;
  averagePPM: number;
  error?: string;
}> {
  try {
    const supabase = createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { totalSessions: 0, averageAccuracy: 0, averagePPM: 0, error: "Not authenticated" };
    }

    const { data, error } = await supabase
      .from("sessions")
      .select("accuracy, ppm")
      .eq("user_id", user.id);

    if (error) {
      return { totalSessions: 0, averageAccuracy: 0, averagePPM: 0, error: error.message };
    }

    if (!data || data.length === 0) {
      return { totalSessions: 0, averageAccuracy: 0, averagePPM: 0 };
    }

    const typedData = data as Array<{ accuracy: number; ppm: number }>;
    const totalSessions = typedData.length;
    const averageAccuracy = typedData.reduce((sum, s) => sum + s.accuracy, 0) / totalSessions;
    const averagePPM = typedData.reduce((sum, s) => sum + s.ppm, 0) / totalSessions;

    return {
      totalSessions,
      averageAccuracy: Math.round(averageAccuracy * 10) / 10,
      averagePPM: Math.round(averagePPM * 10) / 10,
    };
  } catch (error) {
    return { totalSessions: 0, averageAccuracy: 0, averagePPM: 0, error: "Unexpected error" };
  }
}

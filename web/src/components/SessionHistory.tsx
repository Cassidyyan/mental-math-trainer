"use client";

import { useState, useEffect } from "react";
import { getRecentSessions, getUserStats } from "@/app/lib/db/sessions";
import type { SessionRow } from "@/app/lib/database.types";
import { createClient } from "@/app/lib/supabase/client";

export function SessionHistory() {
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [stats, setStats] = useState<{
    totalSessions: number;
    averageAccuracy: number;
    averagePPM: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);

      // Check auth
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      setIsAuthenticated(true);

      // Load sessions
      const { sessions: recentSessions, error: sessionsError } = await getRecentSessions(10);
      if (sessionsError) {
        setError(sessionsError);
        setLoading(false);
        return;
      }

      setSessions(recentSessions || []);

      // Load stats
      const { totalSessions, averageAccuracy, averagePPM, error: statsError } = await getUserStats();
      if (statsError) {
        setError(statsError);
        setLoading(false);
        return;
      }

      setStats({
        totalSessions: totalSessions || 0,
        averageAccuracy: averageAccuracy || 0,
        averagePPM: averagePPM || 0,
      });

      setLoading(false);
    }

    loadData();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      loadData();
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  if (loading) {
    return (
      <div className="text-center text-[#a1a3a4] opacity-50 text-sm py-8">
        Loading history...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="text-center text-[#a1a3a4] opacity-50 text-sm py-8">
        Sign in to view your session history
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-[#ca4754] text-sm py-8">
        Error loading history: {error}
      </div>
    );
  }

  if (!sessions || sessions.length === 0) {
    return (
      <div className="text-center text-[#a1a3a4] opacity-50 text-sm py-8">
        No sessions yet. Complete a test to see your history!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Stats */}
      {stats && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-[#2a2c2e] rounded-lg p-4 border border-[#a1a3a4]/10">
            <div className="text-xs uppercase text-[#a1a3a4] opacity-50 mb-1">
              Total Sessions
            </div>
            <div className="text-2xl text-[#a1a3a4] font-mono">
              {stats.totalSessions}
            </div>
          </div>
          <div className="bg-[#2a2c2e] rounded-lg p-4 border border-[#a1a3a4]/10">
            <div className="text-xs uppercase text-[#a1a3a4] opacity-50 mb-1">
              Avg Accuracy
            </div>
            <div className="text-2xl text-[#a1a3a4] font-mono">
              {stats.averageAccuracy.toFixed(1)}%
            </div>
          </div>
          <div className="bg-[#2a2c2e] rounded-lg p-4 border border-[#a1a3a4]/10">
            <div className="text-xs uppercase text-[#a1a3a4] opacity-50 mb-1">
              Avg PPM
            </div>
            <div className="text-2xl text-[#a1a3a4] font-mono">
              {stats.averagePPM.toFixed(1)}
            </div>
          </div>
        </div>
      )}

      {/* Recent Sessions */}
      <div>
        <h3 className="text-sm uppercase text-[#a1a3a4] opacity-50 mb-4">
          Recent Sessions
        </h3>
        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
        {sessions.map((session) => {
          const accuracy = session.accuracy || 0;
          const accuracyColor =
            accuracy >= 90
              ? "#7cb342"
              : accuracy >= 70
              ? "#e2b714"
              : "#ca4754";

          return (
            <div
              key={session.id}
              className="bg-[#2a2c2e] rounded-lg p-4 border border-[#a1a3a4]/10 hover:border-[#a1a3a4]/20 transition-colors"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="space-y-1">
                  <div className="text-xs text-[#a1a3a4] opacity-70">
                    {new Date(session.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </div>
                  <div className="text-sm text-[#a1a3a4]">
                    <span className="capitalize">{session.mode}</span>
                    {" • "}
                    <span className="capitalize">{session.difficulty}</span>
                    {" • "}
                    {session.duration}s
                    {session.skipped && (
                      <span className="ml-2 text-xs text-[#e2b714] opacity-70">
                        (skipped)
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className="text-2xl font-mono mb-1"
                    style={{ color: accuracyColor }}
                  >
                    {accuracy.toFixed(1)}%
                  </div>
                  <div className="text-xs text-[#a1a3a4] opacity-50">
                    {session.ppm.toFixed(1)} PPM
                  </div>
                </div>
              </div>
              <div className="flex gap-4 text-xs text-[#a1a3a4] opacity-50">
                <span>
                  {session.correct} / {session.total} correct
                </span>
              </div>
            </div>
          );
        })}
        </div>
      </div>
    </div>
  );
}

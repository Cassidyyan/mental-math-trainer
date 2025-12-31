"use client";

import { useState, useEffect } from "react";
import { getAllSessions, getUserStats } from "@/app/lib/db/sessions";
import type { SessionRow } from "@/app/lib/database.types";
import { createClient } from "@/app/lib/supabase/client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

type TimeFilter = "7days" | "30days" | "all";
type DifficultyFilter = "all" | "easy" | "medium" | "hard";

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
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>("all");
  
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

      // Load all sessions
      const { sessions: allSessions, error: sessionsError } = await getAllSessions();
      if (sessionsError) {
        setError(sessionsError);
        setLoading(false);
        return;
      }

      setSessions(allSessions || []);

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

  // Filter sessions based on time and difficulty
  const filteredSessions = sessions.filter((session) => {
    // Time filter
    const sessionDate = new Date(session.created_at);
    const now = new Date();
    const daysDiff = (now.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24);
    
    if (timeFilter === "7days" && daysDiff > 7) return false;
    if (timeFilter === "30days" && daysDiff > 30) return false;
    
    // Difficulty filter
    if (difficultyFilter !== "all" && session.difficulty !== difficultyFilter) return false;
    
    return true;
  });

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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-[#2a2c2e] rounded-lg p-3 sm:p-4 border border-[#a1a3a4]/10">
            <div className="text-xs uppercase text-[#a1a3a4] opacity-50 mb-1">
              Total Sessions
            </div>
            <div className="text-xl sm:text-2xl text-[#a1a3a4] font-mono">
              {stats.totalSessions}
            </div>
          </div>
          <div className="bg-[#2a2c2e] rounded-lg p-3 sm:p-4 border border-[#a1a3a4]/10">
            <div className="text-xs uppercase text-[#a1a3a4] opacity-50 mb-1">
              Avg Accuracy
            </div>
            <div className="text-xl sm:text-2xl text-[#a1a3a4] font-mono">
              {stats.averageAccuracy.toFixed(1)}%
            </div>
          </div>
          <div className="bg-[#2a2c2e] rounded-lg p-3 sm:p-4 border border-[#a1a3a4]/10">
            <div className="text-xs uppercase text-[#a1a3a4] opacity-50 mb-1">
              Avg PPM
            </div>
            <div className="text-xl sm:text-2xl text-[#a1a3a4] font-mono">
              {stats.averagePPM.toFixed(1)}
            </div>
          </div>
        </div>
      )}

      {/* Recent Sessions */}
      <div>
        <h3 className="text-sm uppercase text-[#a1a3a4] opacity-50 mb-4">
          Recent Sessions {filteredSessions.length !== sessions.length && `(${filteredSessions.length} of ${sessions.length})`}
        </h3>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 sm:gap-4 justify-center items-center mb-4">
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="text-xs text-[#a1a3a4] opacity-50 uppercase">Time:</span>
            <div className="flex gap-1 sm:gap-2">
              {(["7days", "30days", "all"] as TimeFilter[]).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTimeFilter(filter)}
                  className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded text-xs transition-colors ${
                    timeFilter === filter
                      ? "bg-[#a1a3a4] text-[#1e2022]"
                      : "bg-[#2a2c2e] text-[#a1a3a4] hover:bg-[#3a3c3e]"
                  }`}
                >
                  {filter === "7days" ? "7 Days" : filter === "30days" ? "30 Days" : "All Time"}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="text-xs text-[#a1a3a4] opacity-50 uppercase">Difficulty:</span>
            <div className="flex gap-1 sm:gap-2">
              {(["all", "easy", "medium", "hard"] as DifficultyFilter[]).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setDifficultyFilter(filter)}
                  className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded text-xs capitalize transition-colors ${
                    difficultyFilter === filter
                      ? "bg-[#a1a3a4] text-[#1e2022]"
                      : "bg-[#2a2c2e] text-[#a1a3a4] hover:bg-[#3a3c3e]"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2 sm:space-y-3 max-h-[400px] sm:max-h-[600px] overflow-y-auto pr-1 sm:pr-2">
        {filteredSessions.slice(0, 10).map((session) => {
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
              className="bg-[#2a2c2e] rounded-lg p-3 sm:p-4 border border-[#a1a3a4]/10 hover:border-[#a1a3a4]/20 transition-colors"
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
                    className="text-xl sm:text-2xl font-mono mb-1"
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

      {/* Graph */}
      {filteredSessions.length > 1 && (
        <div className="mt-4 sm:mt-6 bg-[#2a2c2e] rounded-lg p-3 sm:p-6 border border-[#a1a3a4]/10">
          <h3 className="text-sm uppercase text-[#a1a3a4] opacity-50 mb-6 text-center">
            Accuracy vs Speed Over Time ({filteredSessions.length} sessions)
          </h3>
          <ResponsiveContainer width="100%" height={300} className="sm:h-[400px]">
            <LineChart
              data={filteredSessions.slice().reverse().map((session, index) => ({
                session: `#${index + 1}`,
                accuracy: session.accuracy,
                ppm: session.ppm,
                date: new Date(session.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                }),
              }))}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#a1a3a4" opacity={0.1} />
              <XAxis 
                dataKey="session" 
                stroke="#a1a3a4" 
                opacity={0.5}
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                yAxisId="left"
                stroke="#7cb342" 
                opacity={0.7}
                label={{ value: 'Accuracy (%)', angle: -90, position: 'insideLeft', fill: '#7cb342', opacity: 0.7 }}
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                stroke="#e2b714" 
                opacity={0.7}
                label={{ value: 'PPM', angle: 90, position: 'insideRight', fill: '#e2b714', opacity: 0.7 }}
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e2022', 
                  border: '1px solid #a1a3a4',
                  borderRadius: '8px',
                  opacity: 0.95,
                }}
                labelStyle={{ color: '#a1a3a4' }}
                itemStyle={{ color: '#a1a3a4' }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="line"
              />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="accuracy" 
                stroke="#7cb342" 
                strokeWidth={2}
                dot={{ fill: '#7cb342', r: 4 }}
                activeDot={{ r: 6 }}
                name="Accuracy (%)"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="ppm" 
                stroke="#e2b714" 
                strokeWidth={2}
                dot={{ fill: '#e2b714', r: 4 }}
                activeDot={{ r: 6 }}
                name="PPM"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

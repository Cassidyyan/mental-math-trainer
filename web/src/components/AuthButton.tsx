"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/app/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // Get initial session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  if (loading) {
    return (
      <div className="text-xs text-[#a1a3a4] opacity-50">
        Loading...
      </div>
    );
  }

  if (user) {
    // Try to get name from Google metadata, fallback to email
    const displayName = user.user_metadata?.full_name || 
                       user.user_metadata?.name || 
                       user.email?.split('@')[0] || 
                       'User';
    
    return (
      <div className="flex items-center gap-3">
        <span className="text-xs text-[#a1a3a4] opacity-70">
          {displayName}
        </span>
        <button
          onClick={signOut}
          className="text-xs px-3 py-1.5 bg-transparent border border-[#a1a3a4]/20 text-[#a1a3a4] rounded hover:border-[#a1a3a4]/40 hover:bg-[#a1a3a4]/5 transition-all duration-200"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={signInWithGoogle}
      className="text-xs px-3 py-1.5 bg-transparent border border-[#a1a3a4]/20 text-[#a1a3a4] rounded hover:border-[#a1a3a4]/40 hover:bg-[#a1a3a4]/5 transition-all duration-200"
    >
      Sign In with Google
    </button>
  );
}

"use client";

import React from "react";
import { logout } from "@/src/lib/api/auth";
import Link from "next/link";
import { ArrowLeft, LogOut } from "lucide-react";
import { Button } from "@/src/components/ui/button";

export default function SettingsPage() {
  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        throw new Error("No refresh token found");
      }
      await logout(refreshToken);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/";
    } catch (err) {
      const message = err instanceof Error ? err.message : "Logout failed";
      alert(message);
    }
  };

  return (
    <main className="justify-center py-10 px-4">
      <div className="max-w-2xl mx-auto w-full gap-2 flex flex-col">
        <Button
          asChild
          variant="outline"
          className="w-fit border-cyan-500/30 bg-slate-900/50 text-cyan-200 hover:bg-cyan-500/10 hover:text-cyan-100"
        >
          <Link href="/dashboard" className="inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>

        <div className="text-center py-10">
          <h1 className="text-3xl font-bold text-cyan-300 mb-4">Settings</h1>
          <p className="text-sky-200/60">Feature coming soon...</p>
        </div>

        <Button
          variant="destructive"
          className="mt-1 h-10 w-full border border-red-400/40 bg-red-600/90 text-sm font-semibold text-white hover:bg-red-600"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </main>
  );
}

"use client";

import { InputPane } from "@/components/profiler/InputPane";
import { DashboardPane } from "@/components/profiler/DashboardPane";
import { useSearchParams } from "next/navigation";
import { useEffect, Suspense, useState } from "react";
import { useProfilerStore } from "@/lib/store";
import { EXAMPLES } from "@/lib/examples";
import { Layout, BarChart } from "lucide-react";
import { cn } from "@/lib/utils";

function ProfilerContent() {
  const searchParams = useSearchParams();
  const loadExample = useProfilerStore((state) => state.loadExample);
  const [activeTab, setActiveTab] = useState<"editor" | "dashboard">("editor");

  useEffect(() => {
    const exIdx = searchParams.get("example");
    if (exIdx !== null) {
      const idx = parseInt(exIdx);
      if (EXAMPLES[idx]) {
        loadExample(EXAMPLES[idx].json);
      }
    }
  }, [searchParams, loadExample]);

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden flex-col md:flex-row">
      {/* Mobile Tabs */}
      <div className="flex md:hidden bg-zinc-950 border-b border-white/5 p-1 gap-1">
        <button
          onClick={() => setActiveTab("editor")}
          className={cn("flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all", activeTab === "editor" ? "bg-white/5 text-white" : "text-zinc-500")}
        >
          <Layout className="h-4 w-4" /> Editor
        </button>
        <button
          onClick={() => setActiveTab("dashboard")}
          className={cn("flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all", activeTab === "dashboard" ? "bg-white/5 text-white" : "text-zinc-500")}
        >
          <BarChart className="h-4 w-4" /> Dashboard
        </button>
      </div>

      {/* Left panel: Input/Editor */}
      <div className={cn(
        "w-full md:w-[400px] flex-shrink-0 border-r border-white/5",
        activeTab === "editor" ? "block" : "hidden md:block"
      )}>
        <InputPane />
      </div>

      {/* Right panel: Results Dashboard */}
      <div className={cn(
        "flex-1 bg-black/40 backdrop-blur-sm overflow-hidden",
        activeTab === "dashboard" ? "block" : "hidden md:block"
      )}>
        <DashboardPane />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading Profiler...</div>}>
      <ProfilerContent />
    </Suspense>
  );
}

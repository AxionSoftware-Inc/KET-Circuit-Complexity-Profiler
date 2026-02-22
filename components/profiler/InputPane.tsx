"use client";

import { useProfilerStore } from "@/lib/store";
import { Play, Info, Settings2, Trash2, Cpu, Zap, XCircle } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { EXAMPLES } from "@/lib/examples";

export function InputPane() {
    const {
        code,
        setCode,
        runProfile,
        cancelProfile,
        isProfiling,
        progress,
        computeMode,
        setComputeMode,
        maxQubits,
        setMaxQubits,
        maxSteps,
        setMaxSteps,
        error,
        loadExample
    } = useProfilerStore();

    const [showSettings, setShowSettings] = useState(false);

    return (
        <div className="flex flex-col h-full overflow-hidden border-r border-white/5 bg-zinc-950">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 px-4 py-3 bg-zinc-900/40">
                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <Cpu className="h-4 w-4 text-indigo-400" />
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">Workspace</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {isProfiling ? (
                        <button
                            onClick={cancelProfile}
                            className="flex items-center gap-2 rounded-full bg-rose-500/10 border border-rose-500/20 px-4 py-1.5 text-xs font-bold text-rose-400 transition-all hover:bg-rose-500/20"
                        >
                            <XCircle className="h-4 w-4" />
                            Cancel
                        </button>
                    ) : (
                        <button
                            onClick={runProfile}
                            className="group flex items-center gap-2 rounded-full bg-indigo-500 px-6 py-1.5 text-sm font-bold text-white transition-all shadow-lg shadow-indigo-500/20 hover:bg-indigo-600 hover:scale-105 active:scale-95"
                        >
                            <Play className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                            Profile
                        </button>
                    )}
                </div>
            </div>

            {/* Progress Bar (Visible during profiling) */}
            {isProfiling && (
                <div className="h-1 w-full bg-zinc-900">
                    <div
                        className="h-full bg-indigo-500 transition-all duration-300 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}

            {/* Tabs / Sub-header */}
            <div className="flex items-center justify-between border-b border-white/5 px-4 py-2 bg-black/20">
                <div className="flex gap-3">
                    <button className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 border-b-2 border-indigo-400 pb-1">Gate JSON</button>
                    <button className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-300 pb-1 transition-colors">OpenQASM</button>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setCode("")}
                        className="p-1 text-zinc-600 hover:text-rose-400 transition-colors"
                        title="Clear Editor"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className={cn("p-1 transition-colors", showSettings ? "text-indigo-400" : "text-zinc-600 hover:text-indigo-400")}
                        title="Compute Settings"
                    >
                        <Settings2 className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>

            {/* Settings Overlay */}
            {showSettings && (
                <div className="bg-zinc-900/90 backdrop-blur-md border-b border-white/5 p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Mode</label>
                            <div className="flex rounded-lg bg-black/40 p-1">
                                <button
                                    onClick={() => setComputeMode("local")}
                                    className={cn("flex-1 rounded-md py-1 text-[10px] font-bold uppercase transition-all", computeMode === "local" ? "bg-indigo-500 text-white" : "text-zinc-600 hover:text-zinc-400")}
                                >
                                    Local
                                </button>
                                <button
                                    onClick={() => setComputeMode("mock")}
                                    className={cn("flex-1 rounded-md py-1 text-[10px] font-bold uppercase transition-all", computeMode === "mock" ? "bg-indigo-500 text-white" : "text-zinc-600 hover:text-zinc-400")}
                                >
                                    Demo
                                </button>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Max Qubits</label>
                            <input
                                type="number"
                                value={maxQubits}
                                onChange={(e) => setMaxQubits(parseInt(e.target.value))}
                                className="w-full rounded-md bg-black/40 border border-white/5 px-2 py-1 text-xs text-indigo-400 outline-none focus:border-indigo-500/50"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-indigo-500/5 border border-indigo-500/10 p-2">
                        <Info className="h-3 w-3 text-indigo-400" />
                        <p className="text-[10px] text-indigo-400/80 leading-tight">Local mode runs 100% in your browser using Web Workers.</p>
                    </div>
                </div>
            )}

            {/* Editor Area */}
            <div className="flex-1 relative group">
                <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className={cn(
                        "absolute inset-0 w-full h-full bg-transparent p-4 font-mono text-sm outline-none resize-none transition-colors",
                        error ? "text-rose-400" : "text-zinc-300",
                        isProfiling ? "opacity-50 pointer-events-none" : ""
                    )}
                    placeholder='{ "qubits": 2, "ops": [...] }'
                    spellCheck={false}
                />

                {/* Error Overlay */}
                {error && (
                    <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 backdrop-blur-sm">
                        <div className="flex gap-2">
                            <Info className="h-3.5 w-3.5 text-rose-500 mt-0.5" />
                            <p className="text-xs text-rose-400 font-medium">{error}</p>
                        </div>
                    </div>
                )}

                {/* Local running badge */}
                {!isProfiling && !error && (
                    <div className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-white/5 border border-white/5 px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-zinc-600 group-hover:text-zinc-400 transition-colors">
                        <Zap className="h-2.5 w-2.5" />
                        Runs Locally
                    </div>
                )}
            </div>

            {/* Examples Library */}
            <div className="border-t border-white/5 p-4 bg-zinc-900/30">
                <h4 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3">
                    <Zap className="h-3 w-3 text-indigo-400" />
                    Quick Load Examples
                </h4>
                <div className="grid grid-cols-2 gap-2">
                    {EXAMPLES.map((ex) => (
                        <button
                            key={ex.name}
                            onClick={() => loadExample(ex.json)}
                            className="group flex flex-col items-start rounded-xl border border-white/5 bg-zinc-900/50 p-2 text-left transition-all hover:bg-zinc-800 hover:border-indigo-500/20 active:scale-95"
                        >
                            <span className="text-[10px] font-bold text-white group-hover:text-indigo-400 transition-colors">{ex.name}</span>
                            <span className="text-[8px] text-zinc-600 line-clamp-1">{ex.description}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

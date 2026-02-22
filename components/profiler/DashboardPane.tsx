"use client";

import { useProfilerStore } from "@/lib/store";
import { OverviewCards } from "./OverviewCards";
import { TimelineChart } from "./TimelineChart";
import { EntanglementHeatmap } from "./EntanglementHeatmap";
import { HotspotsTable } from "./HotspotsTable";
import {
    BarChart3,
    Layers,
    Network,
    AlertCircle,
    Clock,
    Download,
    Activity,
    Sparkles,
    ChevronRight,
    Search
} from "lucide-react";
import { motion } from "framer-motion";

export function DashboardPane() {
    const { result, isProfiling, progress } = useProfilerStore();

    if (isProfiling) {
        return (
            <div className="flex flex-col items-center justify-center h-full space-y-6 bg-black/20 backdrop-blur-sm">
                <div className="relative">
                    <div className="h-20 w-20 animate-spin rounded-full border-4 border-indigo-500/10 border-t-indigo-500" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Activity className="h-6 w-6 text-indigo-400 animate-pulse" />
                    </div>
                </div>
                <div className="text-center space-y-2">
                    <p className="text-lg font-bold text-white tracking-tight">Profiling Quantum State...</p>
                    <p className="text-xs text-zinc-500 font-medium uppercase tracking-widest">{Math.round(progress)}% Complete</p>
                </div>
                <div className="w-64 h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                    <motion.div
                        className="h-full bg-indigo-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        );
    }

    if (!result) {
        return (
            <div className="flex flex-col h-full overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800">
                {/* Hero Section */}
                <section className="relative px-8 py-20 text-center overflow-hidden">
                    <div className="absolute top-0 left-1/2 -z-10 h-72 w-[800px] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-[100px]" />

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mx-auto max-w-2xl"
                    >
                        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/5 px-3 py-1 mb-6">
                            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 font-mono">Quantum-Local Analysis</span>
                        </div>
                        <h1 className="text-5xl font-extrabold tracking-tight text-white mb-6">
                            Profile <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Quantum Circuits</span> 100% locally.
                        </h1>
                        <p className="text-lg text-zinc-400 leading-relaxed mb-10">
                            Identify entanglement bottlenecks and simulation hotspots in your browser using high-performance Web Workers.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                            {[
                                { step: "01", title: "Input JSON", desc: "Define your circuit with H, X, RZ, and CX gates." },
                                { step: "02", title: "Analyze", desc: "Local engine computes entropy for every cut." },
                                { step: "03", title: "Insights", desc: "Visualize hotspots and classical simulation hardness." },
                            ].map((s, idx) => (
                                <div key={idx} className="relative p-5 rounded-3xl border border-white/5 bg-zinc-900/40 backdrop-blur-sm">
                                    <span className="text-3xl font-black text-indigo-500/10 absolute top-2 right-4">{s.step}</span>
                                    <h3 className="font-bold text-white text-sm mb-1">{s.title}</h3>
                                    <p className="text-[11px] text-zinc-500 leading-normal">{s.desc}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </section>

                <div className="flex-1 flex flex-col items-center justify-center p-8 border-t border-white/5 bg-zinc-950/20">
                    <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-zinc-900 border border-white/5 ring-8 ring-indigo-500/5 mb-6">
                        <Layers className="h-8 w-8 text-indigo-500" />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-600 mb-6">Ready to profile? Paste code & hit play.</p>
                    <button
                        onClick={() => { }} // Could trigger demo/examples
                        className="group flex items-center gap-3 rounded-2xl bg-white px-8 py-3 text-sm font-bold text-black transition-all hover:bg-zinc-200 active:scale-95 shadow-xl shadow-white/5"
                    >
                        Browse Examples
                        <Search className="h-4 w-4 transition-transform group-hover:scale-110" />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 space-y-8 overflow-y-auto h-full scrollbar-thin scrollbar-thumb-zinc-800"
        >
            {/* Header section */}
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold text-white tracking-tight">Circuit Analytics Dash</h2>
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                            <Clock className="h-3.5 w-3.5" />
                            {new Date(result.meta.createdAt).toLocaleTimeString()}
                        </span>
                        <div className="h-4 w-px bg-white/5" />
                        <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-indigo-400">
                            <Network className="h-3.5 w-3.5" />
                            {result.meta.qubits} Qubits • {result.meta.steps} Ops
                        </span>
                        <div className="h-4 w-px bg-white/5" />
                        <span className="rounded-full bg-white/5 border border-white/5 px-2 py-0.5 text-[9px] font-black text-zinc-500">
                            {result.meta.compute.toUpperCase()} ENGINE
                        </span>
                    </div>
                </div>

                <button className="flex items-center gap-2 rounded-xl border border-white/5 bg-zinc-900/50 px-4 py-2 text-xs font-bold text-zinc-300 transition-all hover:bg-zinc-800 hover:text-white">
                    <Download className="h-4 w-4" />
                    Report PDF
                </button>
            </div>

            {/* Overview Cards */}
            <OverviewCards summary={result.summary as any} />

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Timeline Chart */}
                <div className="rounded-3xl border border-white/5 bg-zinc-900/30 p-6 flex flex-col backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-indigo-400" />
                            <h3 className="text-lg font-bold text-white tracking-tight">Complexity Timeline</h3>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-1.5">
                                <div className="h-2 w-2 rounded-full bg-indigo-500" />
                                <span className="text-[10px] text-zinc-500 font-bold uppercase">Entropy</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="h-2 w-2 rounded-full bg-purple-500" />
                                <span className="text-[10px] text-zinc-500 font-bold uppercase">Hardness</span>
                            </div>
                        </div>
                    </div>
                    <TimelineChart data={result.timeline as any} />
                </div>

                {/* Entanglement Explorer (Heatmap) */}
                <div className="rounded-3xl border border-white/5 bg-zinc-900/30 p-6 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-6">
                        <Activity className="h-5 w-5 text-purple-400" />
                        <h3 className="text-lg font-bold text-white tracking-tight">Entanglement Heatmap</h3>
                    </div>
                    <EntanglementHeatmap cuts={result.entanglement.cuts} data={result.entanglement.entropyByCut} />
                </div>
            </div>

            {/* Recommendations & Hotspots */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 space-y-4">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-zinc-500" />
                        <h3 className="text-lg font-bold text-white tracking-tight">Optimization Hotspots</h3>
                    </div>
                    <HotspotsTable hotspots={result.hotspots} />
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-indigo-400" />
                        <h3 className="text-lg font-bold text-white tracking-tight">Heuristic Insights</h3>
                    </div>
                    <div className="rounded-3xl border border-indigo-500/10 bg-indigo-500/5 p-6 border-l-4 border-l-indigo-500/50 space-y-4">
                        <div>
                            <h4 className="font-bold text-indigo-400 text-xs mb-1 uppercase tracking-widest">Efficiency Scan</h4>
                            <p className="text-xs text-zinc-400 leading-relaxed">
                                {result.summary.hardnessScore > 50
                                    ? "Classical simulation complexity scales exponentially here. Suggest reducing CX depth or grouping local gates."
                                    : "Circuit remains within low-complexity bounds. Good for near-term simulators."}
                            </p>
                        </div>

                        <div className="pt-4 border-t border-indigo-500/10">
                            <h4 className="font-bold text-indigo-400 text-xs mb-1 uppercase tracking-widest">Privacy Note</h4>
                            <p className="text-[10px] text-zinc-500 leading-relaxed italic">
                                All computations were performed on your machine. Your circuit code never left this browser.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

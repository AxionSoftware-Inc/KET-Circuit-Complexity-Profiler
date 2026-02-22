"use client";

import { useProfilerStore } from "@/lib/store";
import { cn } from "@/lib/utils";

interface EntanglementHeatmapProps {
    cuts: number[];
    data: number[][]; // [cutIndex][step]
}

export function EntanglementHeatmap({ cuts, data }: EntanglementHeatmapProps) {
    const { currentStep } = useProfilerStore();
    const steps = data[0]?.length || 0;

    return (
        <div className="flex flex-col space-y-4">
            <div className="relative overflow-hidden rounded-xl border border-white/5 bg-zinc-950 p-4">
                <div className="flex">
                    {/* Y-axis labels */}
                    <div className="mr-2 flex flex-col justify-between text-[10px] font-mono text-zinc-500">
                        {cuts.map((cut) => (
                            <span key={cut} className="h-6 leading-6">Cut {cut}</span>
                        ))}
                    </div>

                    {/* Grid */}
                    <div className="flex-1 overflow-x-auto no-scrollbar">
                        <div
                            className="grid gap-px"
                            style={{
                                gridTemplateColumns: `repeat(${steps}, 1fr)`,
                                gridTemplateRows: `repeat(${cuts.length}, 1fr)`
                            }}
                        >
                            {cuts.map((_, cutIdx) => (
                                Array.from({ length: steps }).map((_, stepIdx) => {
                                    const val = data[cutIdx][stepIdx];
                                    // Color interpolation from zinc-900 to indigo-500
                                    const opacity = Math.min(1, Math.max(0.1, val));

                                    return (
                                        <div
                                            key={`${cutIdx}-${stepIdx}`}
                                            className={cn(
                                                "h-6 min-w-[12px] transition-all duration-300",
                                                stepIdx === currentStep ? "ring-2 ring-white z-10 scale-110" : ""
                                            )}
                                            style={{
                                                backgroundColor: `rgba(99, 102, 241, ${opacity})`,
                                                borderRadius: "1px"
                                            }}
                                            title={`Step ${stepIdx}, Cut ${cuts[cutIdx]}: ${val.toFixed(3)}`}
                                        />
                                    );
                                })
                            ))}
                        </div>
                    </div>
                </div>

                {/* X-axis labels */}
                <div className="mt-2 flex justify-between ml-[40px] text-[10px] font-mono text-zinc-600">
                    <span>Step 0</span>
                    <span>Step {Math.floor(steps / 2)}</span>
                    <span>Step {steps - 1}</span>
                </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-zinc-500">
                <div className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded-sm bg-indigo-500/10" />
                    <span>Low Entanglement</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded-sm bg-indigo-500" />
                    <span>High Entanglement</span>
                </div>
            </div>
        </div>
    );
}

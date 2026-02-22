import { Summary } from "@/lib/types";
import { Zap, Activity, Hash, AlertTriangle, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface OverviewCardsProps {
    summary: Summary;
}

export function OverviewCards({ summary }: OverviewCardsProps) {
    const cards = [
        {
            title: "Hardness Score",
            value: `${summary.hardnessScore}/100`,
            subtext: "Est. simulation difficulty",
            icon: Zap,
            color: "text-amber-400",
            bg: "bg-amber-400/10",
        },
        {
            title: "Peak Entanglement",
            value: summary.peakEntropy.value.toFixed(3),
            subtext: `Max S(A) at step ${summary.peakEntropy.step}`,
            icon: Activity,
            color: "text-indigo-400",
            bg: "bg-indigo-400/10",
        },
        {
            title: "Peak Mutual Info",
            value: summary.peakMI.value.toFixed(3),
            subtext: `Qubits ${summary.peakMI.i}↔${summary.peakMI.j}`,
            icon: Hash,
            color: "text-purple-400",
            bg: "bg-purple-400/10",
        },
        {
            title: "Complexity Risk",
            value: summary.warnings.length > 0 ? "High" : "Low",
            subtext: `${summary.warnings.length} architectural warnings`,
            icon: AlertTriangle,
            color: "text-rose-400",
            bg: "bg-rose-400/10",
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((card, idx) => (
                <div
                    key={idx}
                    className="group relative overflow-hidden rounded-2xl border border-white/5 bg-zinc-900/50 p-5 transition-all hover:bg-zinc-900 hover:shadow-2xl hover:shadow-indigo-500/10"
                >
                    <div className="flex items-center justify-between">
                        <div className={cn("rounded-lg p-2", card.bg)}>
                            <card.icon className={cn("h-5 w-5", card.color)} />
                        </div>
                        <ChevronRight className="h-4 w-4 text-zinc-600 transition-transform group-hover:translate-x-1" />
                    </div>
                    <div className="mt-4">
                        <h3 className="text-sm font-medium text-zinc-500">{card.title}</h3>
                        <p className="text-2xl font-bold text-white tracking-tight">{card.value}</p>
                        <p className="mt-1 text-xs text-zinc-600">{card.subtext}</p>
                    </div>

                    {/* Subtle gradient overlay */}
                    <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
            ))}
        </div>
    );
}

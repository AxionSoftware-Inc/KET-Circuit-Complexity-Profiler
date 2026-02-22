import { ProfileResponse } from "@/lib/compute/types";
import { ArrowUpRight } from "lucide-react";

interface HotspotsTableProps {
    hotspots: ProfileResponse["hotspots"];
}

export function HotspotsTable({ hotspots }: HotspotsTableProps) {
    return (
        <div className="overflow-hidden rounded-xl border border-white/5 bg-zinc-900/50">
            <table className="w-full text-left text-sm">
                <thead className="border-b border-white/5 bg-white/[0.02] text-zinc-400">
                    <tr>
                        <th className="px-4 py-3 font-medium text-[10px] uppercase tracking-wider">Step/Layer</th>
                        <th className="px-4 py-3 font-medium text-[10px] uppercase tracking-wider">Δ Entropy</th>
                        <th className="px-4 py-3 font-medium text-[10px] uppercase tracking-wider">Insights</th>
                        <th className="px-4 py-3 font-medium text-[10px] uppercase tracking-wider text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {hotspots.map((h, i) => (
                        <tr key={i} className="group transition-colors hover:bg-white/[0.01]">
                            <td className="whitespace-nowrap px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <span className="flex h-5 w-5 items-center justify-center rounded bg-indigo-500/10 text-[10px] font-bold text-indigo-400">
                                        {h.step}
                                    </span>
                                    <span className="font-medium text-white">{`Layer ${h.step}`}</span>
                                </div>
                            </td>
                            <td className="px-4 py-3 text-rose-400 font-mono">
                                +{h.deltaEntropy.toFixed(3)}
                            </td>
                            <td className="px-4 py-3 text-zinc-400 text-xs">
                                {h.note}
                            </td>
                            <td className="px-4 py-3 text-right">
                                <button className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-indigo-400 opacity-0 transition-all group-hover:opacity-100 hover:text-indigo-300">
                                    Inspect <ArrowUpRight className="h-3 w-3" />
                                </button>
                            </td>
                        </tr>
                    ))}
                    {hotspots.length === 0 && (
                        <tr>
                            <td colSpan={4} className="px-4 py-8 text-center text-zinc-500 italic text-xs">
                                No significant complexity hotspots detected in this circuit.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

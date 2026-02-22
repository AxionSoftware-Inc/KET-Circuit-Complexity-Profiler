import { EXAMPLES } from "@/lib/examples";
import { Sparkles, ArrowRight, Box } from "lucide-react";
import Link from "next/link";

export default function ExamplesPage() {
    return (
        <div className="mx-auto max-w-6xl px-4 py-20">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight sm:text-5xl">
                    Circuit Gallery
                </h1>
                <p className="text-zinc-500 text-lg">Curated examples to showcase complexity patterns and entanglement growth.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {EXAMPLES.map((ex, i) => (
                    <div key={i} className="group relative rounded-3xl border border-white/5 bg-zinc-900/40 p-6 backdrop-blur-sm transition-all hover:bg-zinc-900/60 hover:border-indigo-500/20">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/5">
                                <Box className="h-5 w-5 text-indigo-400" />
                            </div>
                            <Sparkles className="h-4 w-4 text-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">{ex.name}</h3>
                        <p className="text-zinc-500 text-xs mb-6 line-clamp-2">{ex.description}</p>

                        <Link
                            href={`/?example=${i}`}
                            className="flex items-center justify-between w-full rounded-xl bg-white/5 border border-white/5 px-4 py-2 text-xs font-bold text-zinc-300 transition-all hover:bg-indigo-500 hover:text-white"
                        >
                            Load into Workspace
                            <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}

import { Book, Cpu, ShieldCheck, Zap, Info, ChevronRight } from "lucide-react";

export default function DocsPage() {
    const sections = [
        {
            title: "Quickstart",
            icon: Zap,
            content: "Paste your quantum circuit in Gate JSON format into the editor. Click 'Profile' to begin the analysis. The engine will simulate the statevector and compute metrics gate-by-gate."
        },
        {
            title: "Metrics Explained",
            icon: Cpu,
            content: "We use Von Neumann Entanglement Entropy (S) across all possible bi-partitions (cuts) of the system. A higher entropy indicates deeper entanglement, which often correlates with classical simulation hardness."
        },
        {
            title: "Compute Limits",
            icon: Info,
            content: "By default, we limit analysis to 10 qubits and 150 steps to ensure smooth browser performance. For larger systems, specialized tensor network methods are typically required."
        },
        {
            title: "Privacy First",
            icon: ShieldCheck,
            content: "Your circuits never leave your device. All computations are performed locally in your browser using high-performance Web Workers."
        }
    ];

    return (
        <div className="mx-auto max-w-4xl px-4 py-20">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight sm:text-5xl">
                    Documentation
                </h1>
                <p className="text-zinc-500 text-lg">Everything you need to know about KET Profiler metrics and engine.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {sections.map((s, i) => (
                    <div key={i} className="rounded-3xl border border-white/5 bg-zinc-900/40 p-8 backdrop-blur-sm">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 mb-6">
                            <s.icon className="h-6 w-6 text-indigo-400" />
                        </div>
                        <h2 className="text-xl font-bold text-white mb-3 tracking-tight">{s.title}</h2>
                        <p className="text-zinc-400 text-sm leading-relaxed">{s.content}</p>
                    </div>
                ))}
            </div>

            <div className="mt-20 p-8 rounded-3xl border border-indigo-500/10 bg-indigo-500/5 flex flex-col items-center text-center">
                <h2 className="text-2xl font-bold text-white mb-4">Ready to analyze?</h2>
                <a href="/" className="group flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-bold text-black transition-all hover:bg-zinc-200">
                    Go to Workspace
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
            </div>
        </div>
    );
}

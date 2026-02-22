import Link from "next/link";
import { Activity, Book, Layout, Sparkles } from "lucide-react";

export function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/20">
                        <Activity className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-white">
                            KET <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Profiler</span>
                        </h1>
                        <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                            Circuit Complexity Analysis
                        </p>
                    </div>
                </div>

                <div className="hidden items-center gap-8 md:flex">
                    <Link href="/" className="flex items-center gap-2 text-sm font-medium text-zinc-400 transition-colors hover:text-white">
                        <Layout className="h-4 w-4" />
                        Workspace
                    </Link>
                    <Link href="/docs" className="flex items-center gap-2 text-sm font-medium text-zinc-400 transition-colors hover:text-white">
                        <Book className="h-4 w-4" />
                        Docs
                    </Link>
                    <Link href="/examples" className="flex items-center gap-2 text-sm font-medium text-zinc-400 transition-colors hover:text-white">
                        <Sparkles className="h-4 w-4" />
                        Examples
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    <button className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition-all hover:bg-zinc-200 active:scale-95">
                        Sign In
                    </button>
                </div>
            </div>
        </nav>
    );
}

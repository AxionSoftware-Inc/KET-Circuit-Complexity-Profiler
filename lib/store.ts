import { create } from 'zustand';
import { ProfileResponse, WorkerMessage, CircuitInput } from './compute/types';
import { generateMockProfile } from './mock-data'; // Keeping this for demo mode

interface ProfilerState {
    code: string;
    isProfiling: boolean;
    progress: number;
    result: ProfileResponse | null;
    currentStep: number;
    computeMode: "local" | "mock";
    maxQubits: number;
    maxSteps: number;
    error: string | null;

    setCode: (code: string) => void;
    setComputeMode: (mode: "local" | "mock") => void;
    setMaxQubits: (n: number) => void;
    setMaxSteps: (n: number) => void;
    setCurrentStep: (step: number) => void;

    runProfile: () => Promise<void>;
    cancelProfile: () => void;
    loadExample: (json: string) => void;
}

const DEFAULT_JSON = JSON.stringify({
    qubits: 5,
    ops: [
        { gate: "h", targets: [0] },
        { gate: "cx", controls: [0], targets: [1] },
        { gate: "cx", controls: [1], targets: [2] },
        { gate: "cx", controls: [2], targets: [3] },
        { gate: "cx", controls: [3], targets: [4] }
    ]
}, null, 2);

let activeWorker: Worker | null = null;

export const useProfilerStore = create<ProfilerState>((set, get) => ({
    code: DEFAULT_JSON,
    isProfiling: false,
    progress: 0,
    result: null,
    currentStep: 0,
    computeMode: "local",
    maxQubits: 10,
    maxSteps: 150,
    error: null,

    setCode: (code) => set({ code, error: null }),
    setComputeMode: (computeMode) => set({ computeMode }),
    setMaxQubits: (maxQubits) => set({ maxQubits }),
    setMaxSteps: (maxSteps) => set({ maxSteps }),
    setCurrentStep: (currentStep) => set({ currentStep }),

    loadExample: (json) => set({ code: json, error: null, result: null }),

    cancelProfile: () => {
        if (activeWorker) {
            activeWorker.terminate();
            activeWorker = null;
        }
        set({ isProfiling: false, progress: 0 });
    },

    runProfile: async () => {
        const { code, computeMode, maxQubits, maxSteps } = get();
        set({ isProfiling: true, progress: 0, error: null, result: null });

        if (computeMode === "mock") {
            // Simulate delay
            await new Promise(r => setTimeout(r, 800));
            // Try to parse qubits from JSON if possible, else 5
            let q = 5;
            try { q = JSON.parse(code).qubits || 5; } catch (e) { /* ignore */ }
            const mockResult = generateMockProfile(q, 20) as unknown as ProfileResponse;
            set({ result: mockResult, isProfiling: false, progress: 100 });
            return;
        }

        try {
            const input = JSON.parse(code) as CircuitInput;

            // Validation
            if (input.qubits > maxQubits) throw new Error(`Too many qubits (Max ${maxQubits})`);
            if (input.ops.length > maxSteps) throw new Error(`Too many steps (Max ${maxSteps})`);

            // Start Worker
            activeWorker = new Worker(new URL('./compute/worker.ts', import.meta.url));

            activeWorker.onmessage = (e: MessageEvent<WorkerMessage>) => {
                const msg = e.data;
                if (msg.type === "progress") {
                    set({ progress: (msg.step / msg.totalSteps) * 100 });
                } else if (msg.type === "result") {
                    set({ result: msg.data, isProfiling: false, progress: 100 });
                    activeWorker?.terminate();
                    activeWorker = null;
                } else if (msg.type === "error") {
                    set({ error: msg.message, isProfiling: false });
                    activeWorker?.terminate();
                    activeWorker = null;
                }
            };

            activeWorker.onerror = (e) => {
                set({ error: "Worker failed to initialize. Try refreshing.", isProfiling: false });
                activeWorker?.terminate();
                activeWorker = null;
            };

            activeWorker.postMessage(input);

        } catch (err) {
            set({
                error: err instanceof Error ? err.message : "Invalid JSON input",
                isProfiling: false
            });
        }
    },
}));

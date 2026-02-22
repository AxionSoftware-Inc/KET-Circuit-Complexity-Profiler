export type GateType = "h" | "x" | "rz" | "cx";

export interface GateOperation {
    gate: GateType;
    targets: number[];
    controls?: number[];
    params?: {
        theta?: number;
    };
}

export interface CircuitInput {
    qubits: number;
    ops: GateOperation[];
}

export interface ComputeOptions {
    maxQubits: number;
    maxSteps: number;
    computeMode: "local" | "mock";
}

export interface TimelineStep {
    step: number;
    bestCutEntropy: number;
    hardnessHeuristic: number;
    gateHistogram?: Record<string, number>;
}

export interface ProfileResponse {
    meta: {
        inputFormat: "qasm" | "gate_json";
        qubits: number;
        steps: number;
        createdAt: string;
        compute: "local" | "mock";
    };
    summary: {
        hardnessScore: number;
        peakEntropy: { value: number; step: number; cut: number };
        gateCounts: Record<string, number>;
        warnings: Array<{ level: "info" | "warn" | "risk"; text: string }>;
    };
    timeline: TimelineStep[];
    entanglement: {
        cuts: number[];
        entropyByCut: number[][]; // [cutIndex][step]
    };
    hotspots: Array<{
        step: number;
        deltaEntropy: number;
        note: string;
        suggestion: string;
    }>;
}

export interface ComputeProgress {
    type: "progress";
    step: number;
    totalSteps: number;
}

export interface ComputeResult {
    type: "result";
    data: ProfileResponse;
}

export interface ComputeError {
    type: "error";
    message: string;
}

export type WorkerMessage = ComputeProgress | ComputeResult | ComputeError;

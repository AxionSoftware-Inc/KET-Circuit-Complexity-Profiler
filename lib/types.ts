export type InputFormat = "qasm" | "gate_json";

export type Warning = {
    level: "info" | "warn" | "risk";
    text: string;
};

export type Summary = {
    hardnessScore: number;
    peakEntropy: { value: number; step: number; cut: number };
    peakMI: { value: number; step: number; i: number; j: number };
    gateCounts: Record<string, number>;
    warnings: Warning[];
};

export type TimelineStep = {
    step: number;
    layerLabel?: string;
    gateHistogram?: Record<string, number>;
    twoQGates?: number;
    bestCutEntropy: number;
    avgCutEntropy?: number;
    tnDifficulty?: number;
};

export type ProfileResponse = {
    meta: {
        inputFormat: InputFormat;
        qubits: number;
        steps: number;
        createdAt: string;
        backend: string;
    };
    summary: Summary;
    timeline: TimelineStep[];
    entanglement: {
        cuts: number[];
        entropyByCut: number[][]; // [cutIndex][step]
    };
    mutualInfo: {
        perStep: Array<{
            step: number;
            matrix: number[][];
        }>;
    };
    edges?: Array<{
        step: number;
        topEdges: { i: number; j: number; w: number }[];
    }>;
};

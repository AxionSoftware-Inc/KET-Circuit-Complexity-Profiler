import { ProfileResponse } from "./types";

export function generateMockProfile(qubits: number = 5, steps: number = 20): ProfileResponse {
    const cuts = Array.from({ length: qubits - 1 }, (_, i) => i + 1);
    const timeline: ProfileResponse["timeline"] = [];
    const entropyByCut: number[][] = cuts.map(() => []);
    const mutualInfoPerStep: ProfileResponse["mutualInfo"]["perStep"] = [];

    for (let s = 0; s < steps; s++) {
        // Simulate entanglement growth
        // Logistic growth simulation
        const growth = 1 / (1 + Math.exp(-(s - steps / 2) / 2));
        const randomNoise = () => (Math.random() - 0.5) * 0.1;

        let stepMaxEntropy = 0;
        cuts.forEach((cut, cutIdx) => {
            // Symmetric cut entropy (max in middle)
            const cutFactor = 1 - Math.abs(cut - qubits / 2) / (qubits / 2);
            const entropy = Math.max(0, cutFactor * growth * Math.log2(qubits) + randomNoise());
            entropyByCut[cutIdx].push(entropy);
            if (entropy > stepMaxEntropy) stepMaxEntropy = entropy;
        });

        timeline.push({
            step: s,
            layerLabel: `Layer ${s}`,
            twoQGates: Math.floor(Math.random() * (qubits / 2)),
            bestCutEntropy: stepMaxEntropy,
            avgCutEntropy: stepMaxEntropy * 0.7,
            tnDifficulty: growth * 0.8 + Math.random() * 0.2,
            gateHistogram: {
                h: Math.floor(Math.random() * 3),
                cx: Math.floor(Math.random() * 4),
                rz: Math.floor(Math.random() * 5),
            },
        });

        // Mock MI matrix for key steps or just a subset
        const matrix: number[][] = Array.from({ length: qubits }, () => Array(qubits).fill(0));
        for (let i = 0; i < qubits; i++) {
            for (let j = i + 1; j < qubits; j++) {
                const val = Math.random() * growth * (1 / (Math.abs(i - j) + 1));
                matrix[i][j] = val;
                matrix[j][i] = val;
            }
        }
        mutualInfoPerStep.push({ step: s, matrix });
    }

    // Find peak values
    let peakEnt = { value: 0, step: 0, cut: 0 };
    entropyByCut.forEach((row, cutIdx) => {
        row.forEach((val, step) => {
            if (val > peakEnt.value) {
                peakEnt = { value: val, step, cut: cuts[cutIdx] };
            }
        });
    });

    return {
        meta: {
            inputFormat: "qasm",
            qubits,
            steps,
            createdAt: new Date().toISOString(),
            backend: "mock",
        },
        summary: {
            hardnessScore: Math.floor(70 + Math.random() * 25),
            peakEntropy: peakEnt,
            peakMI: { value: 0.85, step: steps - 1, i: 0, j: 1 },
            gateCounts: { h: 12, cx: 24, rz: 30, sx: 5 },
            warnings: [
                { level: "risk", text: "Entanglement grows rapidly after layer 5" },
                { level: "warn", text: "High two-qubit gate density detected" },
                { level: "info", text: "Likely hard for TN contraction" },
            ],
        },
        timeline,
        entanglement: {
            cuts,
            entropyByCut,
        },
        mutualInfo: {
            perStep: mutualInfoPerStep,
        },
    };
}

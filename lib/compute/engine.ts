import { CircuitInput, ProfileResponse } from "./types";
import { StateVector } from "./sim/statevector";
import { computeEntropy } from "./metrics/entropy";
import { computeHardness, generateWarnings } from "./metrics/hardness";

export async function profileCircuit(
    input: CircuitInput,
    options: {
        onProgress?: (step: number, total: number) => void;
        computeMode?: "local" | "mock"
    } = {}
): Promise<ProfileResponse> {
    const { qubits, ops } = input;
    const steps = ops.length;
    const sv = new StateVector(qubits);

    const cuts = Array.from({ length: qubits - 1 }, (_, i) => i + 1);
    const entropyByCut: number[][] = cuts.map(() => []);
    const timeline: ProfileResponse["timeline"] = [];
    const gateCounts: Record<string, number> = {};

    let peakEntropy = { value: 0, step: 0, cut: 0 };

    // Initial state (step 0 - optional, but let's start with first gate)
    for (let s = 0; s < steps; s++) {
        const op = ops[s];

        // 1. Apply Gate
        if (op.gate === "h") sv.applyH(op.targets[0]);
        else if (op.gate === "x") sv.applyX(op.targets[0]);
        else if (op.gate === "rz") sv.applyRZ(op.targets[0], op.params?.theta || 0);
        else if (op.gate === "cx") sv.applyCX(op.controls![0], op.targets[0]);

        // Update global gate counts
        gateCounts[op.gate] = (gateCounts[op.gate] || 0) + 1;

        // 2. Compute Entropy for all cuts
        let stepBestEntropy = 0;
        cuts.forEach((cut, cutIdx) => {
            const entropy = computeEntropy(sv, cut);
            entropyByCut[cutIdx].push(entropy);

            if (entropy > stepBestEntropy) stepBestEntropy = entropy;
            if (entropy > peakEntropy.value) {
                peakEntropy = { value: entropy, step: s, cut };
            }
        });

        // 3. Compute Step Heatmap/Timeline data
        const maxPoss = Math.log2(Math.min(1 << 5, 1 << (qubits - 5))); // Heuristic max for norm
        const hardnessHeuristic = computeHardness(stepBestEntropy, qubits / 2, gateCounts, s + 1);

        timeline.push({
            step: s,
            bestCutEntropy: stepBestEntropy,
            hardnessHeuristic,
        });

        // Report Progress
        if (options.onProgress) {
            options.onProgress(s + 1, steps);
            // Small break to allow UI updates if not in worker
            if (s % 5 === 0) await new Promise(r => setTimeout(r, 0));
        }
    }

    // 4. Final Summary & Hotspots
    const finalHardness = computeHardness(peakEntropy.value, qubits / 2, gateCounts, steps);
    const warnings = generateWarnings(finalHardness, peakEntropy.value, qubits / 2, gateCounts["cx"] || 0, steps);

    // Compute Hotspots (local delta entropy spikes)
    const hotspots: ProfileResponse["hotspots"] = [];
    for (let i = 1; i < steps; i++) {
        const delta = timeline[i].bestCutEntropy - timeline[i - 1].bestCutEntropy;
        if (delta > 0.1) {
            hotspots.push({
                step: i,
                deltaEntropy: delta,
                note: `Significant entanglement spike at step ${i}`,
                suggestion: "Consider reducing two-qubit gate depth in this region."
            });
        }
    }
    hotspots.sort((a, b) => b.deltaEntropy - a.deltaEntropy);

    return {
        meta: {
            inputFormat: "gate_json",
            qubits,
            steps,
            createdAt: new Date().toISOString(),
            compute: "local",
        },
        summary: {
            hardnessScore: finalHardness,
            peakEntropy,
            gateCounts,
            warnings,
        },
        timeline,
        entanglement: {
            cuts,
            entropyByCut,
        },
        hotspots: hotspots.slice(0, 5),
    };
}

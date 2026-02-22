export function computeHardness(
    bestEntropy: number,
    maxEntropyPossible: number,
    gateCounts: Record<string, number>,
    steps: number
): number {
    // Base score from entanglement (max 60 points)
    const entanglementFactor = maxEntropyPossible > 0 ? bestEntropy / maxEntropyPossible : 0;
    let score = entanglementFactor * 60;

    // Add points for circuit depth (max 20 points)
    // Depth of 50+ is considered "deep" for this scale
    score += Math.min(20, (steps / 50) * 20);

    // Add points for two-qubit gate density (max 20 points)
    const cxCount = gateCounts["cx"] || 0;
    const totalGates = Object.values(gateCounts).reduce((a, b) => a + b, 0);
    const cxDensity = totalGates > 0 ? cxCount / totalGates : 0;

    // CX density of 0.5+ is high
    score += Math.min(20, (cxDensity / 0.5) * 20);

    return Math.min(100, Math.floor(score));
}

export function generateWarnings(
    hardness: number,
    peakEntropy: number,
    maxEntropyPossible: number,
    cxCount: number,
    steps: number
): Array<{ level: "info" | "warn" | "risk"; text: string }> {
    const warnings: Array<{ level: "info" | "warn" | "risk"; text: string }> = [];

    if (hardness > 80) {
        warnings.push({ level: "risk", text: "Extremely high classical simulation hardness" });
    } else if (hardness > 50) {
        warnings.push({ level: "warn", text: "Significant computational complexity detected" });
    }

    if (maxEntropyPossible > 0 && peakEntropy / maxEntropyPossible > 0.8) {
        warnings.push({ level: "risk", text: "Circuit is near-maximally entangled" });
    }

    if (cxCount > steps * 2) {
        warnings.push({ level: "warn", text: "High density of entangling gates" });
    }

    if (steps > 100) {
        warnings.push({ level: "info", text: "Large circuit depth may lead to decoherence (if hardware-bound)" });
    }

    return warnings;
}

export const EXAMPLES = [
    {
        name: "Bell State",
        description: "Simplest 2-qubit maximum entanglement",
        json: JSON.stringify({
            qubits: 2,
            ops: [
                { gate: "h", targets: [0] },
                { gate: "cx", controls: [0], targets: [1] }
            ]
        }, null, 2)
    },
    {
        name: "GHZ (5 Qubits)",
        description: "Highly entangled state across all qubits",
        json: JSON.stringify({
            qubits: 5,
            ops: [
                { gate: "h", targets: [0] },
                { gate: "cx", controls: [0], targets: [1] },
                { gate: "cx", controls: [1], targets: [2] },
                { gate: "cx", controls: [2], targets: [3] },
                { gate: "cx", controls: [3], targets: [4] }
            ]
        }, null, 2)
    },
    {
        name: "W State (3 Qubits)",
        description: "Multi-qubit entanglement pattern",
        json: JSON.stringify({
            qubits: 3,
            ops: [
                { gate: "x", targets: [0] }, // Start with |100>
                { gate: "h", targets: [1] },
                { gate: "cx", controls: [1], targets: [0] },
                { gate: "h", targets: [2] },
                { gate: "cx", controls: [2], targets: [1] }
            ]
        }, null, 2)
    },
    {
        name: "Random Clifford",
        description: "Randomly generated circuit logic",
        json: JSON.stringify({
            qubits: 4,
            ops: [
                { gate: "h", targets: [0] },
                { gate: "rz", targets: [1], params: { theta: 0.785 } },
                { gate: "cx", controls: [0], targets: [1] },
                { gate: "h", targets: [2] },
                { gate: "cx", controls: [1], targets: [2] },
                { gate: "x", targets: [3] },
                { gate: "cx", controls: [2], targets: [3] },
                { gate: "rz", targets: [0], params: { theta: 1.57 } }
            ]
        }, null, 2)
    },
    {
        name: "Hardness Test",
        description: "Dense deep circuit to test profiler limits",
        json: JSON.stringify({
            qubits: 6,
            ops: Array.from({ length: 40 }, (_, i) => ({
                gate: i % 3 === 0 ? "cx" : (i % 3 === 1 ? "h" : "rz"),
                controls: i % 3 === 0 ? [i % 5] : undefined,
                targets: [(i % 5) + (i % 3 === 0 ? 1 : 0)],
                params: i % 3 === 2 ? { theta: Math.random() * Math.PI } : undefined
            }))
        }, null, 2)
    }
];

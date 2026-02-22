import { NextRequest, NextResponse } from "next/server";
import { generateMockProfile } from "@/lib/mock-data";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { code } = body;

        // Minimal QASM parsing for qubit count
        let qubits = 5;
        if (code && typeof code === 'string') {
            const qregMatch = code.match(/qreg\s+\w+\[(\d+)\]/);
            const qubitMatch = code.match(/qubit\[(\d+)\]/);
            if (qregMatch) qubits = parseInt(qregMatch[1]);
            else if (qubitMatch) qubits = parseInt(qubitMatch[1]);
        }

        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 800));

        const mockData = generateMockProfile(qubits, 20);

        return NextResponse.json(mockData);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to process circuit" }, { status: 400 });
    }
}

export async function GET() {
    const mockData = generateMockProfile(5, 20);
    return NextResponse.json(mockData);
}

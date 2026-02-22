import { profileCircuit } from "./engine";
import { CircuitInput, WorkerMessage } from "./types";

/* eslint-disable no-restricted-globals */
self.onmessage = async (e: MessageEvent<CircuitInput>) => {
    try {
        const input = e.data;
        const result = await profileCircuit(input, {
            onProgress: (step, total) => {
                const msg: WorkerMessage = { type: "progress", step, totalSteps: total };
                self.postMessage(msg);
            },
        });

        const finalMsg: WorkerMessage = { type: "result", data: result };
        self.postMessage(finalMsg);
    } catch (error) {
        const errorMsg: WorkerMessage = {
            type: "error",
            message: error instanceof Error ? error.message : "Unknown computation error"
        };
        self.postMessage(errorMsg);
    }
};

export { };

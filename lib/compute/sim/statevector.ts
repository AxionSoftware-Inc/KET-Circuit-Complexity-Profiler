export class StateVector {
    real: Float64Array;
    imag: Float64Array;
    numQubits: number;
    size: number;

    constructor(numQubits: number) {
        this.numQubits = numQubits;
        this.size = 1 << numQubits;
        this.real = new Float64Array(this.size);
        this.imag = new Float64Array(this.size);
        // Initialize to |0...0>
        this.real[0] = 1.0;
    }

    applyH(target: number) {
        const mask = 1 << target;
        const invSqrt2 = Math.SQRT1_2;

        for (let i = 0; i < this.size; i++) {
            if (!(i & mask)) {
                const j = i | mask;

                const r1 = this.real[i];
                const i1 = this.imag[i];
                const r2 = this.real[j];
                const i2 = this.imag[j];

                this.real[i] = (r1 + r2) * invSqrt2;
                this.imag[i] = (i1 + i2) * invSqrt2;
                this.real[j] = (r1 - r2) * invSqrt2;
                this.imag[j] = (i1 - i2) * invSqrt2;
            }
        }
    }

    applyX(target: number) {
        const mask = 1 << target;

        for (let i = 0; i < this.size; i++) {
            if (!(i & mask)) {
                const j = i | mask;

                const r1 = this.real[i];
                const i1 = this.imag[i];
                const r2 = this.real[j];
                const i2 = this.imag[j];

                this.real[i] = r2;
                this.imag[i] = i2;
                this.real[j] = r1;
                this.imag[j] = i1;
            }
        }
    }

    applyRZ(target: number, theta: number) {
        const mask = 1 << target;
        const halfTheta = theta / 2;
        const cosVal = Math.cos(halfTheta);
        const sinVal = Math.sin(halfTheta);

        for (let i = 0; i < this.size; i++) {
            // RZ(theta) = exp(-i*theta/2 * Z)
            // If qubit is 0, factor is exp(-i*theta/2) = cos(theta/2) - i*sin(theta/2)
            // If qubit is 1, factor is exp(i*theta/2) = cos(theta/2) + i*sin(theta/2)
            const sign = (i & mask) ? 1 : -1;
            const s = sign * sinVal;
            const c = cosVal;

            const r = this.real[i];
            const im = this.imag[i];

            this.real[i] = r * c - im * s;
            this.imag[i] = r * s + im * c;
        }
    }

    applyCX(control: number, target: number) {
        const cMask = 1 << control;
        const tMask = 1 << target;

        for (let i = 0; i < this.size; i++) {
            if ((i & cMask) && !(i & tMask)) {
                const j = i | tMask;

                const r1 = this.real[i];
                const i1 = this.imag[i];
                const r2 = this.real[j];
                const i2 = this.imag[j];

                this.real[i] = r2;
                this.imag[i] = i2;
                this.real[j] = r1;
                this.imag[j] = i1;
            }
        }
    }

    getProbability(index: number): number {
        return this.real[index] * this.real[index] + this.imag[index] * this.imag[index];
    }

    clone(): StateVector {
        const newSV = new StateVector(this.numQubits);
        newSV.real.set(this.real);
        newSV.imag.set(this.imag);
        return newSV;
    }
}

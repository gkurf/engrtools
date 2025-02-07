class Frac {
    constructor(whole, numerator, denominator) {
        if (!Number.isInteger(whole) || !Number.isInteger(numerator) || !Number.isInteger(denominator)) {
            throw new Error('All inputs must be integers');
        }

        if (denominator <= 0) {
            throw new Error('Denominator must be positive');
        }

        if (numerator < 0) {
            throw new Error('Numerator must be non-negative');
        }

        this.whole = whole;
        this.numerator = numerator;
        this.denominator = denominator;
    }

    static parseFloat(float) {
        if (typeof float !== 'number' || isNaN(float)) {
            throw new Error('Input must be a valid number');
        }

        const whole = Math.trunc(float);
        const decimal = Math.abs(float - whole);
        return [whole, decimal];
    }

    _gcd(a, b) {
        a = Math.abs(a);
        b = Math.abs(b);
        while (b) {
            [a, b] = [b, a % b];
        }
        return a;
    }

    simplified() {
        const totalNumerator = this.whole * this.denominator + this.numerator;
        const gcd = this._gcd(totalNumerator, this.denominator);
        const reducedNumerator = totalNumerator / gcd;
        const reducedDenominator = this.denominator / gcd;
        const whole = Math.floor(reducedNumerator / reducedDenominator);
        const numerator = reducedNumerator % reducedDenominator;

        return new Frac(whole, numerator, reducedDenominator);

    }

    toBaseDenom(n) {
        if (!Number.isInteger(n) || n <= 0) {
            throw new Error('New denominator must be a positive integer');
        }

        const numerator = n / this.denominator * this.numerator;
        
        if (!Number.isInteger(numerator)) {
            throw new Error('Fraction cannot be converted to this base.');
        }

        return new Frac(this.whole, numerator, n);
    }

    static isPowerOfTwo(n) {
        return n > 0 && (n & (n - 1)) === 0;
    }

    toDecimal() {
        const totalNumerator = this.whole * this.denominator + this.numerator;
        return totalNumerator / this.denominator;
    }

    toString() {
        if (this.numerator === 0) {
            return this.whole.toString();
        }

        if (this.whole === 0) {
            return `${this.numerator}/${this.denominator}`;
        }

        return `${this.whole} ${this.numerator}/${this.denominator}`;
    }

    toMathFraction() {
        if (this.numerator === 0) {
            return `<div class="whole-number">${this.whole}</div>`;
        }
    
        if (this.whole === 0) {
            return `<div class="fraction">
                <div class="fraction-top">${this.numerator}</div>
                <div class="fraction-bottom">${this.denominator}</div>
            </div>`;
        }
    
        return `<div class="whole-number">${this.whole}</div> <div class="fraction">
            <div class="fraction-top">${this.numerator}</div>
            <div class="fraction-bottom">${this.denominator}</div>
        </div>`;
    }
}
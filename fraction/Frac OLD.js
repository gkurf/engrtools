class Frac {
    constructor(whole, num, den) {
        if (!Number.isInteger(whole)) {
            throw new Error("Whole part must be an integer.");
        }
        else if (!Number.isInteger(num)) {
            throw new Error("Numerator must be an integer.");
        }
        else if (!Number.isInteger(den)) {
            throw new Error("Denominator must be an integer.");
        }
        else if (num < 0) {
            throw new Error("Numerator must be non-negative.");
        }
        else if (den <= 0) {
            throw new Error("Denominator must be greater than 0.");
        }

        this.whole = whole;
        this.num = num;
        this.den = den;
        this.dec = num / den;
    }

    #gcd(a, b) {
        let result = Math.min(a, b);
        while (result > 0) {
            if (a % result == 0 && b % result == 0) {
                break;
            }
            result--;
        }

        return result;
    }

    #isPowerOfTwo(n) {
        return n > 0 && (n & (n - 1)) === 0;
    }

    simplified() {
        const whole = this.whole + Math.floor(this.num / this.den);
        const divisor = this.#gcd(this.num, this.den);
        const num = (this.num % this.den) / divisor;
        const den = this.den / divisor;

        return new Frac(whole, num, den);
    }

    unsimplified(multiplier) {
        return new Frac(this.whole, this.num * multiplier, this.den * multiplier);
    }

    isDyad() {
        return this.#isPowerOfTwo(this.den);
    }

    [Symbol.toPrimitive](hint) {
        if (hint === 'number') {
            return this.whole + this.dec;
        }
        if (hint === 'string') {
            if (this.num === 0) {
                return `${this.whole}`;
            } else if (this.whole === 0) {
                return `${this.num}/${this.den}`;
            } else {
                return `${this.whole} ${this.num}/${this.den}`;
            }

        }
        return this.whole + this.dec;
    }
}

function nearestDyadics(min, max, n) {
    if (!(min instanceof Frac) || !(max instanceof Frac)) {
        throw new Error(`Bounds must be of type Frac`);
    }
    if (!min.isDyad() || !max.isDyad()) {
        throw new Error(`Bounds must be Dyadic (x/2^n)`);
    }
    if (min.den !== max.den) {
        throw new Error(`Bounds must have same denominator`);
    }
    if (!(typeof n === 'number')) {
        throw new Error(`n must be a number`);
    }
    if (!(min <= n) || !(n <= max)) {
        throw new Error(`n must be within the bounds [${min.dec}, ${max.dec}]`);
    }

    min = min.unsimplified(2);
    max = max.unsimplified(2);
    test = new Frac((min.num + max.num) / 2, min.den);

    if (n == min) {
        return [min, min];
    } else if (n == test) {
        return [test, test];
    } else if (n == max) {
        return [max, max];
    } else if (n < test) {
        return [min, test];
    } else {
        return [test, max];
    }
}

function get_fractions(n, max_den = 32) {
    const whole = Math.floor(n);

    let min = new Frac(whole, 0, 1);
    let max = new Frac(whole, 1, 1);

    for (let i = 0; i < 32; i = i**2) {
        console.log('here');
        min, max = nearestDyadics(min, max, n);
        console.log(`${n} is between [${min}, ${max}]`);
    }
}

get_fractions(0.375);
module.exports = Frac;
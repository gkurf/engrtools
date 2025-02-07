const Frac = require("./Frac.js");

function findDyadRange(n, max_base) {
  if (!(typeof n === 'number')) {
    throw new Error(`n must be a number`);
  } else if (!(typeof max_base === 'number')) {
    throw new Error(`base must be a number`);
  } else if (!(Frac.isPowerOfTwo(max_base))) {
    throw new Error(`base must be a power of 2`);
  }

  let [whole, dec] = Frac.parseFloat(n)
  min = new Frac(whole, 0, 1);
  max = new Frac(whole, 1, 1);
  base = 1;

  while (base < max_base) {
    base *= 2;
    min = min.toBaseDenom(base);
    max = max.toBaseDenom(base);
    midpoint = new Frac(whole, (min.numerator + max.numerator) / 2, base);

    if (n === min.toDecimal()) {
      return [min, min];
    } else if (n === midpoint.toDecimal()) {
      return [midpoint, midpoint];
    } else if (n === max.toDecimal()) {
      return [max, max];
    } else if (n < midpoint.toDecimal()) {
      max = midpoint;
    } else {
      min = midpoint;
    }
  }

  return [min.simplified(), max.simplified()];
}

n = 0.38;
maxDenom = 64;
console.log(`n = ${n}`);

for (let den = 2; den <= maxDenom; den *= 2) {
  [min, max] = findDyadRange(n, den);

  if (min === max) {
    console.log(`${n} is exactly ${min}}`);
    break;
  }

  else {
    console.log(`Nearest 1/${den}: [${min}, ${max}]`);
    console.log(`     Decimal: [${min.toDecimal()}, ${max.toDecimal()}]`);
    console.log(`       Error: [${n - min.toDecimal()}, ${max.toDecimal() - n}]`);
  }
}

module.exports = findDyadRange;
/* Prints:
n = 0.38
Nearest 1/2: [0, 1/2]
     Decimal: [0, 0.5]
       Error: [0.38, 0.12]
Nearest 1/4: [1/4, 1/2]
     Decimal: [0.25, 0.5]
       Error: [0.13, 0.12]
Nearest 1/8: [3/8, 1/2]
     Decimal: [0.375, 0.5]
       Error: [0.0050000000000000044, 0.12]
Nearest 1/16: [3/8, 7/16]
     Decimal: [0.375, 0.4375]
       Error: [0.0050000000000000044, 0.057499999999999996]
Nearest 1/32: [3/8, 13/32]
     Decimal: [0.375, 0.40625]
       Error: [0.0050000000000000044, 0.026249999999999996]
Nearest 1/64: [3/8, 25/64]
     Decimal: [0.375, 0.390625]
       Error: [0.0050000000000000044, 0.010624999999999996]
*/
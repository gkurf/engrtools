function initializeMaxDenominatorSelect() {
  const select = document.getElementById("maxDenominator");
  select.innerHTML = ''; // Clear existing options

  MAX_DENOMINATORS.forEach(denom => {
    const option = document.createElement('option');
    option.value = denom;
    option.textContent = `1/${denom}`;
    if (denom === 32) { // Keep the default selection
      option.selected = true;
    }
    select.appendChild(option);
  });
}

function findDyadRange(n, max_base) {
  if (!(typeof n === 'number')) {
    throw new Error(`n must be a number`);
  } else if (!(typeof max_base === 'number')) {
    throw new Error(`base must be a number`);
  } else if (!(Frac.isPowerOfTwo(max_base))) {
    throw new Error(`base must be a power of 2`);
  }

  let [whole, dec] = Frac.parseFloat(n);
  let min = new Frac(whole, 0, 1);
  let max = new Frac(whole, 1, 1);
  let base = 1;

  while (base < max_base) {
    base *= 2;
    min = min.toBaseDenom(base);
    max = max.toBaseDenom(base);
    let midpoint = new Frac(whole, (min.numerator + max.numerator) / 2, base);

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

function parseInput(value) {
  // Remove all spaces
  value = value.replace(/\s/g, '');

  // Check if input contains division
  if (value.includes('/')) {
    const [numerator, denominator] = value.split('/');

    // Validate both parts are valid numbers
    if (!/^\d*\.?\d*$/.test(numerator) || !/^\d*\.?\d*$/.test(denominator) ||
      numerator === '' || denominator === '' ||
      numerator === '.' || denominator === '.') {
      throw new Error("Invalid division format");
    }

    const num = parseFloat(numerator);
    const den = parseFloat(denominator);

    if (den === 0) {
      throw new Error("Cannot divide by zero");
    }

    if (isNaN(num) || isNaN(den)) {
      throw new Error("Invalid numbers in division");
    }

    return num / den;
  } else {
    // Check if it's a valid decimal number
    if (!/^\d*\.?\d*$/.test(value) || value === '' || value === '.') {
      throw new Error("Invalid decimal format");
    }

    const num = parseFloat(value);
    if (isNaN(num)) {
      throw new Error("Invalid number");
    }

    return num;
  }
}

function updateResults() {
  const decimalInputValue = document.getElementById("decimalInput").value;
  const maxDenominator = parseInt(document.getElementById("maxDenominator").value);
  const resultsDiv = document.getElementById("results");
  const errorPanel = document.getElementById("errorPanel");
  const rulerContainer = document.getElementById("ruler-container");

  resultsDiv.innerHTML = '';
  errorPanel.innerHTML = '';
  errorPanel.style.display = 'none';
  rulerContainer.style.display = 'block';  // Show by default

  let decimalInput;
  try {
    decimalInput = parseInput(decimalInputValue);
    initializeRuler(decimalInput, maxDenominator);
  } catch (error) {
    errorPanel.innerHTML = error.message;
    errorPanel.style.display = 'block';
    rulerContainer.style.display = 'none';  // Hide when input is invalid
    return;
  }

  let exactMatchFound = false;

  Object.keys(DENOMINATOR_COLORS).forEach((denom) => {
    denom = parseInt(denom);
    let denom_frac = new Frac(0, 1, denom);

    if (denom > maxDenominator) return;

    const [min, max] = findDyadRange(decimalInput, denom);
    if (exactMatchFound) return;

    const card = document.createElement('div');
    card.className = 'fraction-card';

    const isExactMatch = min.toDecimal() === decimalInput;
    if (isExactMatch) {
      exactMatchFound = true;
      const exactMatchIndicator = document.createElement('div');
      exactMatchIndicator.className = 'exact-match-indicator';
      exactMatchIndicator.textContent = 'Exact Match';
      card.appendChild(exactMatchIndicator);
    }

    const formatDecimal = (num) => num.toFixed(6).replace(/\.?0+$/, '');

    const fractionRangeDisplay = min === max
      ? min.toMathFraction()
      : `
          <span class="math-fraction">${min.toMathFraction()}</span>
          <span style="color: #666; margin: 0 0.3rem; vertical-align: middle;">&harr;</span>
          <span class="math-fraction">${max.toMathFraction()}</span>
        `;

    const decimalRangeDisplay = min === max
      ? formatDecimal(min.toDecimal())
      : `
          <span style="color: #666;">${formatDecimal(min.toDecimal())} &lt; </span>
          <span>${formatDecimal(decimalInput)}</span>
          <span style="color: #666;"> &lt; ${formatDecimal(max.toDecimal())}</span>
        `;

    card.innerHTML += `
        <div class="color-bar" style="background-color: ${DENOMINATOR_COLORS[denom]}">
           <span class="math-fraction">${denom_frac.toMathFraction()}</span>
        </div>
        <div class="fraction-content">
          <div class="fraction-display">
            ${fractionRangeDisplay}
          </div>
          <div class="bound">
            ${decimalRangeDisplay}
          </div>
        </div>
      `;

    resultsDiv.appendChild(card);
  });
}

document.getElementById("decimalInput").addEventListener('input', updateResults);
document.getElementById("maxDenominator").addEventListener('change', updateResults);

initializeMaxDenominatorSelect();
updateResults();

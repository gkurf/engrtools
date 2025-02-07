function createTickMark(ruler, x, height, label = '', tickColor = 'black', labelColor = 'black', direction = "horiz", thickness = 2) {
    // Create tick mark
    const tickMark = document.createElement('div');
    tickMark.classList.add('tick-mark');
    tickMark.style.left = `${x * 100}%`;
    tickMark.style.height = `${height * 100}%`;
    tickMark.style.backgroundColor = tickColor;
    tickMark.style.width = `${thickness}px`;
    tickMark.style.transform = `translate(-50%, -1px)`;

    // Create label if provided
    if (label) {
        const labelElement = document.createElement('div');
        labelElement.classList.add('tick-label');

        if (direction === "horiz") {
            labelElement.style.transformOrigin = `center bottom`;
            labelElement.style.transform = `translate(-50%)`;
        } else {
            labelElement.style.transformOrigin = `left center`;
            labelElement.style.transform = `translate(0%, 30%) rotate(-90deg)`;
        }

        labelElement.textContent = label;
        labelElement.style.left = `${x * 100}%`;
        labelElement.style.bottom = `${height * 100}%`;
        labelElement.style.color = labelColor;
        ruler.appendChild(labelElement);

        labelElement.style.fontWeight = thickness > 2 ? 'bold' : 'normal';
    }

    ruler.appendChild(tickMark);
}

function createBallIndicator(ruler, x) {
    const ball = document.createElement('div');
    ball.classList.add('ball-indicator');
    ball.style.left = `${x * 100}%`;
    ruler.appendChild(ball);
}

function createRuler(ruler, min, max, tickDepth, labelDepth, highlighted = NaN) {
    const HIDE_PCT = 0.01;
    const span = max - min;
    const normalizedHighlight = (highlighted - min) / span;
    let label = ``;

    for (let whole = min; whole <= max; whole++) {
        const normalizedWhole = (whole - min) / span;

        if (Math.abs(normalizedWhole - normalizedHighlight) > HIDE_PCT) {
            label = `${whole}`;
        } else {
            label = ``;
        }
        createTickMark(ruler, normalizedWhole, 1, label, '#666', '#666');

        if (whole === max) break;

        for (let denom = 2; denom <= tickDepth; denom *= 2) {
            const tickHeight = 1.5 / (Math.log2(denom) + 1);

            for (let num = 1; num < denom; num += 2) {
                const position = normalizedWhole + num / denom / span;
                if ((labelDepth >= denom) && (Math.abs(position - normalizedHighlight) > HIDE_PCT)) {
                    label = `${num}/${denom}`;
                } else {
                    label = '';
                }

                createTickMark(ruler, position, tickHeight, label, '#666', '#666', 'vert');
            }
        }
    }

    if (!isNaN(highlighted)) {
        createTickMark(ruler, normalizedHighlight, 1, highlighted.toString(), '#4CAF50', '#4CAF50', 'horiz', 3);
        createBallIndicator(ruler, normalizedHighlight);
    }
}

function initializeRuler(decimalInput, maxDenominator) {
    const ruler = document.getElementById('ruler');
    ruler.innerHTML = ''; // Clear previous ticks

    createRuler(ruler, Math.floor(decimalInput), Math.floor(decimalInput) + 1, maxDenominator, 16, decimalInput);
}
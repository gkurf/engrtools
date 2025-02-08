// DOM elements
const rpmInput = document.getElementById('rpmInput');
const unitSelect = document.getElementById('unitSelect');
const rotatingElement = document.getElementById('rotatingElement');
const imageUpload = document.getElementById('imageUpload');
const resetImageButton = document.getElementById('resetImage');
const defaultShape = rotatingElement.querySelector('.default-shape');
const errorPanel = document.getElementById('errorPanel');
const visualizationContainer = document.getElementById('visualizationContainer');

// Create and add the speed display
const speedDisplay = document.createElement('div');
speedDisplay.className = 'speed-display';
document.body.insertBefore(speedDisplay, visualizationContainer.nextSibling);

// State management
let currentAngle = 0;
let animationFrameId = null;
let lastTimestamp = 0;

// Conversion factors (to RPS)
const conversionFactors = {
    'rpm': 1 / 60,
    'rps': 1,
    'rad/s': 1 / (2 * Math.PI),
    'deg/s': 1 / 360
};

// Inverse conversion factors (from RPS)
const inverseConversionFactors = {
    'rpm': 60,
    'rps': 1,
    'rad/s': 2 * Math.PI,
    'deg/s': 360
};

function showError(message) {
    errorPanel.textContent = message;
    errorPanel.style.display = 'block';
    visualizationContainer.style.display = 'none';
}

function hideError() {
    errorPanel.style.display = 'none';
    visualizationContainer.style.display = 'flex';
}

// Convert between units
function convertSpeed(value, fromUnit, toUnit) {
    // First convert to RPS
    const rps = value * conversionFactors[fromUnit];
    // Then convert to target unit
    return rps * inverseConversionFactors[toUnit];
}

// Get rotations per second
function getRotationsPerSecond(value, unit) {
    return value * conversionFactors[unit];
}

// Handle unit change
function handleUnitChange() {
    const currentValue = parseFloat(rpmInput.value);
    const oldUnit = unitSelect.dataset.previousUnit || 'rpm';
    const newUnit = unitSelect.value;

    const formatDecimal = (num) => num.toFixed(6).replace(/\.?0+$/, '');

    if (!isNaN(currentValue)) {
        const convertedValue = convertSpeed(currentValue, oldUnit, newUnit);
        rpmInput.value = formatDecimal(convertedValue);
    }

    unitSelect.dataset.previousUnit = newUnit;
    startRotation();
}

// Reset to default shape
function resetToDefaultShape() {
    imageUpload.value = '';
    rotatingElement.innerHTML = '';
    const newDefaultShape = document.createElement('div');
    newDefaultShape.className = 'default-shape';
    rotatingElement.appendChild(newDefaultShape);
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file || !file.type.startsWith('image/')) {
        console.warn('Invalid file type. Please upload an image.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
            rotatingElement.innerHTML = '';
            const maxSize = 300;
            const scale = Math.min(maxSize / img.width, maxSize / img.height);

            const imgContainer = document.createElement('div');
            imgContainer.style.width = `${img.width * scale}px`;
            imgContainer.style.height = `${img.height * scale}px`;
            imgContainer.style.overflow = 'hidden';

            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'contain';

            imgContainer.appendChild(img);
            rotatingElement.appendChild(imgContainer);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function updateRotation(timestamp) {
    if (!lastTimestamp) {
        lastTimestamp = timestamp;
    }

    const deltaTime = (timestamp - lastTimestamp) / 1000;
    lastTimestamp = timestamp;

    const speed = parseFloat(rpmInput.value);

    if (isNaN(speed)) {
        showError('Please enter a valid number');
        return;
    }

    hideError();

    const unit = unitSelect.value;
    const rps = getRotationsPerSecond(Math.abs(speed), unit);
    const direction = Math.sign(speed) || 1;

    currentAngle += direction * rps * 360 * deltaTime;
    currentAngle %= 360;

    rotatingElement.style.transform = `rotate(${currentAngle}deg)`;
    animationFrameId = requestAnimationFrame(updateRotation);
}

function startRotation() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    lastTimestamp = 0;
    animationFrameId = requestAnimationFrame(updateRotation);
}

// Event Listeners
rpmInput.addEventListener('input', startRotation);
unitSelect.addEventListener('change', handleUnitChange);
imageUpload.addEventListener('change', handleImageUpload);
resetImageButton.addEventListener('click', resetToDefaultShape);

startRotation();
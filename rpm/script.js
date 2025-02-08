// DOM elements
const rpmInput = document.getElementById('rpmInput');
const unitSelect = document.getElementById('unitSelect');
const rotatingElement = document.getElementById('rotatingElement');
const imageUpload = document.getElementById('imageUpload');
const resetImageButton = document.getElementById('resetImage');
const defaultShape = rotatingElement.querySelector('.default-shape');
const errorPanel = document.getElementById('errorPanel');
const visualizationContainer = document.getElementById('visualizationContainer');

// State management
let currentAngle = 0;
let animationFrameId = null;
let lastTimestamp = 0;

function showError(message) {
    errorPanel.textContent = message;
    errorPanel.style.display = 'block';
    visualizationContainer.style.display = 'none';
}

function hideError() {
    errorPanel.style.display = 'none';
    visualizationContainer.style.display = 'flex';
}

// Convert any unit to rotations per second
function getRotationsPerSecond(value, unit) {
    switch (unit) {
        case 'rpm':
            return value / 60;
        case 'rps':
            return value;
        case 'rad/s':
            return value / (2 * 3.14159);
        case 'deg/s':
            return value / 360;
        default:
            console.warn('Unknown unit:', unit);
            return value / 60; // Default to RPM conversion
    }
}

// Reset to default shape
function resetToDefaultShape() {
    // Clear the file input
    imageUpload.value = '';

    // Remove existing content
    rotatingElement.innerHTML = '';

    // Recreate default shape
    const newDefaultShape = document.createElement('div');
    newDefaultShape.className = 'default-shape';
    rotatingElement.appendChild(newDefaultShape);
}

// Handle image upload and display
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
            // Remove existing content
            rotatingElement.innerHTML = '';

            // Calculate scaling to fit within container while maintaining aspect ratio
            const maxSize = 300; // matches container size from CSS
            const scale = Math.min(
                maxSize / img.width,
                maxSize / img.height
            );

            // Create and style image container
            const imgContainer = document.createElement('div');
            imgContainer.style.width = `${img.width * scale}px`;
            imgContainer.style.height = `${img.height * scale}px`;
            imgContainer.style.overflow = 'hidden';

            // Style the image
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'contain';

            // Add to DOM
            imgContainer.appendChild(img);
            rotatingElement.appendChild(imgContainer);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// Main rotation update function
function updateRotation(timestamp) {
    // Initialize timestamp on first run
    if (!lastTimestamp) {
        lastTimestamp = timestamp;
    }

    // Calculate time elapsed since last frame
    const deltaTime = (timestamp - lastTimestamp) / 1000; // Convert to seconds
    lastTimestamp = timestamp;

    const rpm = parseFloat(rpmInput.value);

    if (isNaN(rpm)) {
        showError('Please enter a valid number');
        return;
    }

    // Hide error and show visualization if input is valid
    hideError();

    const unit = unitSelect.value;

    // Get current speed in rotations per second
    const speed = getRotationsPerSecond(Math.abs(rpm), unit);

    // Update angle based on speed and time elapsed
    // Use rpm sign to determine direction
    const direction = Math.sign(rpm) || 1; // Default to 1 if rpm is 0
    currentAngle += direction * speed * 360 * deltaTime;
    currentAngle %= 360; // Keep angle between 0-360 degrees

    // Apply rotation
    rotatingElement.style.transform = `rotate(${currentAngle}deg)`;

    // Continue animation
    animationFrameId = requestAnimationFrame(updateRotation);
}

// Start/restart rotation animation
function startRotation() {
    // Clean up existing animation if any
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }

    // Reset timestamp for accurate timing
    lastTimestamp = 0;

    // Start new animation
    animationFrameId = requestAnimationFrame(updateRotation);
}

// Event Listeners
rpmInput.addEventListener('input', startRotation);
unitSelect.addEventListener('change', startRotation);
imageUpload.addEventListener('change', handleImageUpload);
resetImageButton.addEventListener('click', resetToDefaultShape);

// Remove the min="0" attribute from the HTML input element
rpmInput.removeAttribute('min');

// Initialize
startRotation();
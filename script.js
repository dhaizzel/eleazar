// Select the cake div
const cake = document.querySelector('.cake');

// Function to extinguish the flame
function extinguishFlame(flame) {
    flame.style.display = 'none';
}

// Function to detect blowing via microphone
async function detectBlow() {
    try {
        // Access the microphone
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioContext = new AudioContext();
        const microphone = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        microphone.connect(analyser);

        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        function checkBlow() {
            analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < bufferLength; i++) {
                sum += dataArray[i];
            }

            // Calculate the average volume level
            const average = sum / bufferLength;

            // If the volume exceeds the threshold, extinguish all flames
            if (average > 60) {
                const flames = document.querySelectorAll('#flame');
                flames.forEach(extinguishFlame);
            }

            requestAnimationFrame(checkBlow); // Continuously check for microphone input
        }

        checkBlow(); // Start the loop to check for blowing

    } catch (err) {
        console.error('Error accessing microphone:', err);
    }
}

// Function to create a new candle where the user clicks on the cake
function addCandle(x, y) {
    const candle = document.createElement('div');
    candle.classList.add('candle');
    candle.style.left = `${x - 8}px`; // Position the candle
    candle.style.top = `${y - 50}px`; // Position the candle

    // Create the flame
    const flame = document.createElement('div');
    flame.id = 'flame';
    candle.appendChild(flame);

    // Add the candle to the cake
    cake.appendChild(candle);
}

// Event listener to add a candle where the cake is clicked
cake.addEventListener('click', function (event) {
    const x = event.offsetX;
    const y = event.offsetY;
    addCandle(x, y);
});

// Start detecting microphone input
detectBlow();

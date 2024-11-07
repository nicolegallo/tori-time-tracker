let seconds = 0;
let timer; // Variable to store the interval function

document.addEventListener("DOMContentLoaded", function() {
    const startButton = document.getElementById("start-button");
    const stopButton = document.getElementById("stop-button");
    const resetButton = document.getElementById("reset-button");
    const timerDisplay = document.getElementById("timer-display");

    startButton.addEventListener("click", function() {
        // Clear any existing interval to avoid multiple timers
        clearInterval(timer);

        // Start counting every 1 second (1000 milliseconds)
        timer = setInterval(function() {
            seconds++; // Increment the time
            timerDisplay.textContent = formatTime(seconds); // Format and display time
        }, 1000);
    });

    stopButton.addEventListener("click", function() {
        clearInterval(timer); // Stop the timer
    });

    resetButton.addEventListener("click", function() {
        clearInterval(timer); // Stop the timer
        seconds = 0; // Reset seconds to 0
        timerDisplay.textContent = "00:00:00"; // Reset display to 00:00:00
    });
});

// Function to format seconds into HH:MM:SS
function formatTime(totalSeconds) {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

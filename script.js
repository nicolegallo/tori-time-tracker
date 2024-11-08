let seconds = 0;
let timer; // Variable to store the interval function
let logs = JSON.parse(localStorage.getItem("logs")) || []; // Retrieve saved logs from localStorage or start with an empty array

document.addEventListener("DOMContentLoaded", function() {
    const startButton = document.getElementById("start-button");
    const stopButton = document.getElementById("stop-button");
    const resetButton = document.getElementById("reset-button");
    const timerDisplay = document.getElementById("timer-display");
    const logButton = document.getElementById("log-button");
    const logList = document.getElementById("log-list");
    const blurbInput = document.getElementById("blurb-input");

    // Load saved logs on page load
    loadLogs();

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
        if (seconds > 0) {
            logButton.disabled = false; // Enable log button if timer has been running
        }
    });

    resetButton.addEventListener("click", function() {
        clearInterval(timer); // Stop the timer
        seconds = 0; // Reset seconds to 0
        timerDisplay.textContent = "00:00:00"; // Reset display to 00:00:00
        logButton.disabled = true; // Disable log button when timer is reset
    });

    logButton.addEventListener("click", function() {
        const timeText = formatTime(seconds);
        const blurbText = blurbInput.value || "NO BLURB"; // Default if empty

        // Create the log entry and save it to logs array and localStorage
        const logEntry = { time: timeText, blurb: blurbText };
        logs.push(logEntry);
        saveLogs();

        // Display the new log entry
        displayLog(logEntry);
        blurbInput.value = ""; // Clear blurb input after logging
    });

    // Function to format seconds into HH:MM:SS
    function formatTime(totalSeconds) {
        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    // Function to save logs to localStorage
    function saveLogs() {
        localStorage.setItem("logs", JSON.stringify(logs));
    }

    // Function to load logs from localStorage
    function loadLogs() {
        logs.forEach(displayLog);
    }

    // Function to display a single log entry
    function displayLog(logEntry) {
        const logItem = document.createElement("li");
        logItem.textContent = `${logEntry.time} - ${logEntry.blurb}`;

        // Create delete "X" icon
        const deleteIcon = document.createElement("span");
        deleteIcon.textContent = "✖";
        deleteIcon.style.cursor = "pointer";
        deleteIcon.style.color = "red";
        deleteIcon.style.marginLeft = "10px";
        deleteIcon.style.fontWeight = "bold";

        // Add event listener to remove the log item and update localStorage
        deleteIcon.addEventListener("click", function() {
            logList.removeChild(logItem);
            logs = logs.filter(log => log !== logEntry);
            saveLogs();
        });

        logItem.appendChild(deleteIcon);
        logList.appendChild(logItem);
    }
});

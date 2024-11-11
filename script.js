let seconds = 0; // Stores the number of seconds elapsed on the timer
let timer; // Timer interval reference
let logs = JSON.parse(localStorage.getItem("logs")) || []; // Loads saved logs from local storage, or initializes an empty array

document.addEventListener("DOMContentLoaded", function() {
    // Access DOM elements
    const startButton = document.getElementById("start-button");
    const stopButton = document.getElementById("stop-button");
    const resetButton = document.getElementById("reset-button");
    const timerDisplay = document.getElementById("timer-display");
    const logButton = document.getElementById("log-button");
    const logList = document.getElementById("log-list");
    const blurbInput = document.getElementById("blurb-input");
    const toggleEditDelete = document.getElementById("toggle-edit-delete");
    const dateInput = document.getElementById("date-input"); // New date input field
    const totalTimeDisplay = document.getElementById("total-time"); // Element to display total time

    loadLogs(); // Loads and displays any existing logs from local storage
    updateTotalTime(); // Calculates and displays the total time spent

    // Starts the timer when Start button is clicked
    startButton.addEventListener("click", function() {
        clearInterval(timer);
        timer = setInterval(function() {
            seconds++;
            timerDisplay.textContent = formatTime(seconds);
        }, 1000);
    });

    // Stops the timer and enables the log button if time has been recorded
    stopButton.addEventListener("click", function() {
        clearInterval(timer);
        if (seconds > 0) {
            logButton.disabled = false;
        }
    });

    // Resets the timer to 0 and disables the log button
    resetButton.addEventListener("click", function() {
        clearInterval(timer);
        seconds = 0;
        timerDisplay.textContent = "00:00:00";
        logButton.disabled = true;
    });

    // Logs the time entry with blurb and date when Log button is clicked
    logButton.addEventListener("click", function() {
        const timeText = formatTime(seconds);
        const blurbText = blurbInput.value || "NO BLURB";
        const dateText = dateInput.value || "No Date"; // Uses date input or defaults to "No Date"

        // Create a log entry object
        const logEntry = { time: timeText, date: dateText, blurb: blurbText };
        logs.push(logEntry); // Add to logs array
        saveLogs(); // Save logs to local storage

        displayLog(logEntry); // Display the new log entry in the list
        updateTotalTime(); // Update the total time display

        // Clear input fields
        blurbInput.value = "";
        dateInput.value = "";
    });

    // Toggles visibility of edit and delete icons based on checkbox
    toggleEditDelete.addEventListener("change", function() {
        const icons = document.querySelectorAll(".editable-icon");
        icons.forEach(icon => {
            icon.style.display = toggleEditDelete.checked ? "inline" : "none";
        });
    });

    // Formats time in HH:MM:SS format
    function formatTime(totalSeconds) {
        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    // Saves logs to local storage
    function saveLogs() {
        localStorage.setItem("logs", JSON.stringify(logs));
    }

    // Loads logs from local storage and displays them
    function loadLogs() {
        logs.forEach(displayLog);
    }

    // Displays a single log entry on the page
    function displayLog(logEntry) {
        const logItem = document.createElement("li");

        // Display the log entry with time, date, and blurb
        const logText = document.createElement("span");
        logText.textContent = `${logEntry.time} | ${logEntry.date} | ${logEntry.blurb}`;

        // Delete icon for removing log entry
        const deleteIcon = document.createElement("span");
        deleteIcon.textContent = "✖";
        deleteIcon.style.cursor = "pointer";
        deleteIcon.style.color = "red";
        deleteIcon.style.marginLeft = "10px";
        deleteIcon.style.fontWeight = "bold";
        deleteIcon.classList.add("editable-icon");
        deleteIcon.style.display = toggleEditDelete.checked ? "inline" : "none";
        deleteIcon.addEventListener("click", function() {
            logList.removeChild(logItem); // Remove from DOM
            logs = logs.filter(log => log !== logEntry); // Remove from logs array
            saveLogs(); // Save updated logs to local storage
            updateTotalTime(); // Update total time after deletion
        });

        // Edit icon for modifying log entry
        const editIcon = document.createElement("span");
        editIcon.textContent = "✎";
        editIcon.style.cursor = "pointer";
        editIcon.style.color = "blue";
        editIcon.style.marginLeft = "10px";
        editIcon.style.fontWeight = "bold";
        editIcon.classList.add("editable-icon");
        editIcon.style.display = toggleEditDelete.checked ? "inline" : "none";
        editIcon.addEventListener("click", function() {
            // Create editable inputs for time, date, and blurb
            const timeInput = document.createElement("input");
            timeInput.type = "text";
            timeInput.value = logEntry.time;

            const dateInputEdit = document.createElement("input");
            dateInputEdit.type = "date";
            dateInputEdit.value = logEntry.date;

            const blurbInputEdit = document.createElement("input");
            blurbInputEdit.type = "text";
            blurbInputEdit.value = logEntry.blurb;

            const saveButton = document.createElement("button");
            saveButton.textContent = "Save";
            saveButton.addEventListener("click", function() {
                // Update log entry with new values
                logEntry.time = timeInput.value;
                logEntry.date = dateInputEdit.value;
                logEntry.blurb = blurbInputEdit.value;
                saveLogs();

                // Update display and replace inputs with static text
                logText.textContent = `${logEntry.time} | ${logEntry.date} | ${logEntry.blurb}`;
                logItem.innerHTML = "";
                logItem.appendChild(logText);
                logItem.appendChild(editIcon);
                logItem.appendChild(deleteIcon);
                updateTotalTime(); // Update total time after editing
            });

            // Replace log item content with editable inputs
            logItem.innerHTML = "";
            logItem.appendChild(timeInput);
            logItem.appendChild(dateInputEdit);
            logItem.appendChild(blurbInputEdit);
            logItem.appendChild(saveButton);
        });

        logItem.appendChild(logText);
        logItem.appendChild(editIcon);
        logItem.appendChild(deleteIcon);
        logList.appendChild(logItem);
    }

    // Calculates and updates the total time spent based on log entries
    function updateTotalTime() {
        let totalSeconds = 0;

        // Convert each log entry's time to seconds and sum them up
        logs.forEach(log => {
            const [hrs, mins, secs] = log.time.split(":").map(Number);
            totalSeconds += hrs * 3600 + mins * 60 + secs;
        });

        // Display the total time in HH:MM:SS format
        totalTimeDisplay.textContent = `Total Time: ${formatTime(totalSeconds)}`;
    }

    // My Tori Time: Toggles display of log entries when header is clicked
    const myToriTimeHeader = document.getElementById("my-tori-time");
    const logContainer = document.getElementById("log-container");

    // Initial state: collapse log entries
    logContainer.style.display = "none";
    myToriTimeHeader.addEventListener("click", function() {
        logContainer.style.display = logContainer.style.display === "none" ? "block" : "none";
    });
});

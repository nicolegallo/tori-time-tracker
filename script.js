let seconds = 0;
let timer;
let logs = JSON.parse(localStorage.getItem("logs")) || [];

document.addEventListener("DOMContentLoaded", function() {
    const startButton = document.getElementById("start-button");
    const stopButton = document.getElementById("stop-button");
    const resetButton = document.getElementById("reset-button");
    const timerDisplay = document.getElementById("timer-display");
    const logButton = document.getElementById("log-button");
    const logList = document.getElementById("log-list");
    const blurbInput = document.getElementById("blurb-input");

    loadLogs();

    startButton.addEventListener("click", function() {
        clearInterval(timer);
        timer = setInterval(function() {
            seconds++;
            timerDisplay.textContent = formatTime(seconds);
        }, 1000);
    });

    stopButton.addEventListener("click", function() {
        clearInterval(timer);
        if (seconds > 0) {
            logButton.disabled = false;
        }
    });

    resetButton.addEventListener("click", function() {
        clearInterval(timer);
        seconds = 0;
        timerDisplay.textContent = "00:00:00";
        logButton.disabled = true;
    });

    logButton.addEventListener("click", function() {
        const timeText = formatTime(seconds);
        const blurbText = blurbInput.value || "NO BLURB";

        const logEntry = { time: timeText, blurb: blurbText };
        logs.push(logEntry);
        saveLogs();

        displayLog(logEntry);
        blurbInput.value = "";
    });

    function formatTime(totalSeconds) {
        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    function saveLogs() {
        localStorage.setItem("logs", JSON.stringify(logs));
    }

    function loadLogs() {
        logs.forEach(displayLog);
    }

    function displayLog(logEntry) {
        const logItem = document.createElement("li");

        // Elements for displaying and editing log entry
        const logText = document.createElement("span");
        logText.textContent = `${logEntry.time} - ${logEntry.blurb}`;

        // Delete icon
        const deleteIcon = document.createElement("span");
        deleteIcon.textContent = "✖";
        deleteIcon.style.cursor = "pointer";
        deleteIcon.style.color = "red";
        deleteIcon.style.marginLeft = "10px";
        deleteIcon.style.fontWeight = "bold";
        deleteIcon.addEventListener("click", function() {
            logList.removeChild(logItem);
            logs = logs.filter(log => log !== logEntry);
            saveLogs();
        });

        // Edit icon
        const editIcon = document.createElement("span");
        editIcon.textContent = "✎";
        editIcon.style.cursor = "pointer";
        editIcon.style.color = "blue";
        editIcon.style.marginLeft = "10px";
        editIcon.style.fontWeight = "bold";
        editIcon.addEventListener("click", function() {
            // Switch to editable mode
            const timeInput = document.createElement("input");
            timeInput.type = "text";
            timeInput.value = logEntry.time;

            const blurbInputEdit = document.createElement("input");
            blurbInputEdit.type = "text";
            blurbInputEdit.value = logEntry.blurb;

            const saveButton = document.createElement("button");
            saveButton.textContent = "Save";
            saveButton.addEventListener("click", function() {
                // Update log entry with new values
                logEntry.time = timeInput.value;
                logEntry.blurb = blurbInputEdit.value;
                saveLogs();

                // Restore display mode with updated content
                logText.textContent = `${logEntry.time} - ${logEntry.blurb}`;
                logItem.replaceChild(logText, timeInput);
                logItem.replaceChild(logText, blurbInputEdit);
                logItem.replaceChild(editIcon, saveButton);
                logItem.appendChild(deleteIcon);
            });

            // Clear previous log display and add editable inputs
            logItem.innerHTML = "";
            logItem.appendChild(timeInput);
            logItem.appendChild(blurbInputEdit);
            logItem.appendChild(saveButton);
        });

        logItem.appendChild(logText);
        logItem.appendChild(editIcon);
        logItem.appendChild(deleteIcon);
        logList.appendChild(logItem);
    }
});

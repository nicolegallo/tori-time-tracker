// Replace `logs` with Firebase Firestore for storing logs
let seconds = 0; // Stores the number of seconds elapsed on the timer
let timer; // Timer interval reference

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

    // Load and display logs from Firebase
    loadLogs();
    updateTotalTime();

    // Start button to start the timer
    startButton.addEventListener("click", function() {
        clearInterval(timer);
        timer = setInterval(function() {
            seconds++;
            timerDisplay.textContent = formatTime(seconds);
        }, 1000);
    });

    // Stop button to stop the timer and enable the log button
    stopButton.addEventListener("click", function() {
        clearInterval(timer);
        if (seconds > 0) {
            logButton.disabled = false;
        }
    });

    // Reset button to reset the timer
    resetButton.addEventListener("click", function() {
        clearInterval(timer);
        seconds = 0;
        timerDisplay.textContent = "00:00:00";
        logButton.disabled = true;
    });

    // Log button to save the log entry in Firebase
    logButton.addEventListener("click", function() {
        const timeText = formatTime(seconds);
        const blurbText = blurbInput.value || "NO BLURB";
        const dateText = dateInput.value || "No Date"; // Uses date input or defaults to "No Date"

        // Create log entry object
        const logEntry = { time: timeText, date: dateText, blurb: blurbText };

        // Save log entry to Firestore
        saveLogEntry(logEntry);

        // Display the new log entry in the log list
        displayLog(logEntry);
        updateTotalTime();

        // Clear input fields
        blurbInput.value = "";
        dateInput.value = "";
    });

    // Toggle visibility of edit and delete icons based on checkbox
    toggleEditDelete.addEventListener("change", function() {
        const icons = document.querySelectorAll(".editable-icon");
        icons.forEach(icon => {
            icon.style.display = toggleEditDelete.checked ? "inline" : "none";
        });
    });

    // Format time in HH:MM:SS format
    function formatTime(totalSeconds) {
        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    // Save log entry to Firebase Firestore
    function saveLogEntry(logEntry) {
        db.collection("logs").add(logEntry)
            .then(docRef => {
                console.log("Document written with ID: ", docRef.id);
            })
            .catch(error => {
                console.error("Error adding document: ", error);
            });
    }

    // Load logs from Firebase Firestore
    function loadLogs() {
        db.collection("logs").orderBy("date").get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                const logEntry = doc.data();
                displayLog(logEntry);
            });
        }).catch(error => {
            console.error("Error getting documents: ", error);
        });
    }

    // Display a single log entry on the page
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
            // Remove log entry from DOM and Firestore
            logList.removeChild(logItem);
            deleteLogEntry(logEntry);
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
                saveUpdatedLogEntry(logEntry);

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

    // Update log entry in Firestore after editing
    function saveUpdatedLogEntry(logEntry) {
        const logRef = db.collection("logs").doc(logEntry.id);
        logRef.update(logEntry)
            .then(() => {
                console.log("Document successfully updated!");
            })
            .catch(error => {
                console.error("Error updating document: ", error);
            });
    }

    // Delete log entry from Firestore
    function deleteLogEntry(logEntry) {
        const logRef = db.collection("logs").doc(logEntry.id);
        logRef.delete()
            .then(() => {
                console.log("Document successfully deleted!");
            })
            .catch(error => {
                console.error("Error deleting document: ", error);
            });
    }

    // Calculates and updates the total time spent based on log entries
    function updateTotalTime() {
        let totalSeconds = 0;

        // Fetch all logs from Firebase and calculate total time
        db.collection("logs").get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                const log = doc.data();
                const [hrs, mins, secs] = log.time.split(":").map(Number);
                totalSeconds += hrs * 3600 + mins * 60 + secs;
            });

            // Display the total time in HH:MM:SS format
            totalTimeDisplay.textContent = `Total Time: ${formatTime(totalSeconds)}`;
        }).catch(error => {
            console.error("Error getting total time: ", error);
        });
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

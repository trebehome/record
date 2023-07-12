// Control buttons
const recordStart = document.querySelector("#recordStartButton");
const recordStop = document.querySelector("#stopRecordingButton");
const resumeButton = document.querySelector("#continueRecordingButton");
const recordEnd = document.querySelector("#recordEndButton");
const cancelButton = document.querySelector("#cancelRecordingButton");
const newRecordingButton = document.querySelector("#newRecordingButton");
const audioPlayer = document.querySelector("#audioPlayer");
const durationDisplay = document.getElementById('duration');

let mediaRecorder = null; // Recorder
let chunks = []; // Data chunks
let startTime, durationInterval, totalDuration = 0;

// Función para reiniciar el contador de tiempo
function resetTimer() {
  startTime = null;
  durationInterval = null;
  totalDuration = 0;
  durationDisplay.textContent = "0 s";
}

// Start recording
recordStart.onclick = () => {
  // Require access to microphone
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then((stream) => {
      // Recorder not set
      if (mediaRecorder === null) {
        // Create recorder
        mediaRecorder = new MediaRecorder(stream, { audioBitsPerSecond: 16000 });

        // Event listener when stopped
        mediaRecorder.onstop = () => {
          // Process chunks
          const blob = new Blob(chunks, { "type": "audio/wav; codecs=0" });

          // Reset chunks
          chunks = [];

          // Set audio source
          audioPlayer.src = URL.createObjectURL(blob);
        };

        // Event listener when data is sent
        mediaRecorder.ondataavailable = (e) => {
          chunks.push(e.data);
        };
      }

      mediaRecorder.start(); // Start recording
      resetTimer(); // Reiniciar el contador de tiempo
      startTime = Date.now();
      durationInterval = setInterval(updateDuration, 1000);

      // Enable/disable control buttons
      recordStart.disabled = true;
      recordStop.disabled = false;
      resumeButton.disabled = true;
      cancelButton.disabled = true;
      newRecordingButton.disabled = true;
      recordEnd.disabled = false; // <-- Esta línea habilita el botón recordEndButton
    }, (err) => console.error("Error: " + err));
};

// Stop recording
recordStop.onclick = () => {
  mediaRecorder.pause(); // Pause recording

  clearInterval(durationInterval);
  totalDuration += Math.round((Date.now() - startTime) / 1000);

  // Enable/disable control buttons
  recordStart.disabled = true;
  recordStop.disabled = true;
  resumeButton.disabled = false;
  recordEnd.disabled = false;
  cancelButton.disabled = false;
  newRecordingButton.disabled = true;
};

// Resume recording
resumeButton.onclick = () => {
  mediaRecorder.resume(); // Resume recording

  startTime = Date.now();
  durationInterval = setInterval(updateDuration, 1000);

  // Enable/disable control buttons
  recordStart.disabled = true;
  recordStop.disabled = false;
  recordEnd.disabled = false;
  resumeButton.disabled = true;
  cancelButton.disabled = false;
  newRecordingButton.disabled = true;
};

// End recording
recordEnd.onclick = () => {
  mediaRecorder.stop(); // Stop recording

  clearInterval(durationInterval);
  totalDuration += Math.round((Date.now() - startTime) / 1000);

  // Enable/disable control buttons
  recordStart.disabled = false;
  recordStop.disabled = true;
  recordEnd.disabled = true;
  resumeButton.disabled = true;
  cancelButton.disabled = false;
  newRecordingButton.disabled = true;
};

// Cancel recording
cancelButton.onclick = () => {
  mediaRecorder = null; // Reset recorder
  chunks = []; // Reset chunks

  // Reset audio source
  audioPlayer.src = "";

  // Enable/disable control buttons
  recordStart.disabled = false;
  recordStop.disabled = true;
  resumeButton.disabled = true;
  cancelButton.disabled = true;
  newRecordingButton.disabled = false;

  // Reload the page
  location.reload();
};

// Actualizar el contador de tiempo
function updateDuration() {
  const currentTime = totalDuration + Math.round((Date.now() - startTime) / 1000);
  durationDisplay.textContent = `${currentTime} s`;
}

// New recording
newRecordingButton.onclick = () => {
  mediaRecorder = null; // Reset recorder
  chunks = []; // Reset chunks

  // Reset audio source
  audioPlayer.src = "";

  // Enable/disable control buttons
  recordStart.disabled = false;
  recordStop.disabled = true;
  resumeButton.disabled = true;
  cancelButton.disabled = false;
  newRecordingButton.disabled = true;
};

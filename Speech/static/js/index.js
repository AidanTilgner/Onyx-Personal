//webkitURL is deprecated but nevertheless
URL = window.URL || window.webkitURL;

var gumStream;
var rec;
var input;

var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext;
var interfaceButton = document.getElementById("interfaceButton");

interfaceButton.addEventListener("mousedown", (e) => {
  startRecording();
});
interfaceButton.addEventListener("mouseup", (e) => {
  stopRecording();
});

function startRecording() {
  var constraints = { audio: true, video: false };

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function (stream) {
      audioContext = new AudioContext();
      gumStream = stream;
      input = audioContext.createMediaStreamSource(stream);
      rec = new Recorder(input, { numChannels: 1 });

      rec.record();

      console.log("Recording started");
    })
    .catch(function (err) {
      console.log(err);
    });
}

function stopRecording() {
  rec.stop();
  gumStream.getAudioTracks()[0].stop();
  rec.exportWAV(createDownloadLink);
}

async function createDownloadLink(blob) {
  let li = document.createElement("li");

  const formData = new FormData();
  formData.append("file", blob);
  const res = await fetch("/stt", {
    method: "POST",
    body: formData,
  }).then((res) => res.json());
  li.innerText = res.text;

  recordingsList.appendChild(li);
}

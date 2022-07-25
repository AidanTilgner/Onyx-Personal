console.log("Initilizing Speech Input Button");

// * Add Links to HMTL
const links = `
    <link
      href="https://fonts.googleapis.com/icon?family=Material+Icons"
      rel="stylesheet"
    />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0"
    />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap"
      rel="stylesheet"
    />
`;
document.head.innerHTML += links;

//* Create interface UI
const root = document.getElementById("container-speech_input");
const interfaceHTML = `
    <div class="interface" id="interface-speech_input">
      <p>Voice Input</p>
      <button id="interfaceButton" class="button">
        <i class="material-symbols-outlined">mic</i>
      </button>
    </div>
`;
root.innerHTML += interfaceHTML;
document.body.innerHTML += `
    <style>
        #interface-speech_input {
            background-color: white;
            display: flex;
            justify-content: space-around;
            padding: 8px 14px;
            width: 200px;
            box-shadow: inset 0.2px 0.2px 4px rgba(0, 0, 0, 0.15);
            border: 1px solid #eaeaea;
            border-radius: 3px;
            font-weight: 600;
        }

        #interface-speech_input > p {
            font-family: "Quicksand", sans-serif;
        }
        
        #interface-speech_input > .button {
            background-color: #2256f2;
            display: inline-block;
            min-width: 48px;
            height: 48px;
            width: 48px;
            border-radius: 50%;
            padding: 0;
            flex-grow: 0;
            border: none;
            color: white;
            cursor: pointer;
            box-shadow: 2px 2px 10px 0 rgba(0, 0, 0, 0.25);
        }
        
        #interface-speech_input > .button:active {
            box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.15);
            background-color: white;
            color: #2256f2;
        }
        
        #interface-speech_input:active {
            animation: animateBg 6s infinite ease-in-out;
            background-color: #fff;
            /* background-image: linear-gradient(90deg, #5716f9, #2256f2, #16c7f9, #235afa); */
            background-image: linear-gradient(45deg, #2256f2, #f5f5f5, #7697f9);
            background-size: 300% 100%;
            color: white;
        }
        
        @keyframes animateBg {
            0% {
                background-position: 0 0;
            }
            50% {
                background-position: 100% 0;
            }
            100% {
                background-position: 0% 0;
            }
        }      
    </style>
`;

// * Functionality
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
    })
    .catch(function (err) {
      console.log(err);
    });
}

function stopRecording() {
  rec.stop();
  gumStream.getAudioTracks()[0].stop();
  rec.exportWAV(sendAudio);
}

async function sendAudio(blob) {
  const formData = new FormData();
  formData.append("file", blob);
  axios("http://localhost:5000/stt", {
    method: "POST",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
    .then((res) => {
      console.log(res);
      console.log(res.data);
      console.log(res.data.text);
    })
    .catch((err) => {
      console.log(err);
    });
}

// ! Recorder.js dependency stuff
(function (f) {
  if (typeof exports === "object" && typeof module !== "undefined") {
    module.exports = f();
  } else if (typeof define === "function" && define.amd) {
    define([], f);
  } else {
    var g;
    if (typeof window !== "undefined") {
      g = window;
    } else if (typeof global !== "undefined") {
      g = global;
    } else if (typeof self !== "undefined") {
      g = self;
    } else {
      g = this;
    }
    g.Recorder = f();
  }
})(function () {
  var define, module, exports;
  return (function e(t, n, r) {
    function s(o, u) {
      if (!n[o]) {
        if (!t[o]) {
          var a = typeof require == "function" && require;
          if (!u && a) return a(o, !0);
          if (i) return i(o, !0);
          var f = new Error("Cannot find module '" + o + "'");
          throw ((f.code = "MODULE_NOT_FOUND"), f);
        }
        var l = (n[o] = { exports: {} });
        t[o][0].call(
          l.exports,
          function (e) {
            var n = t[o][1][e];
            return s(n ? n : e);
          },
          l,
          l.exports,
          e,
          t,
          n,
          r
        );
      }
      return n[o].exports;
    }
    var i = typeof require == "function" && require;
    for (var o = 0; o < r.length; o++) s(r[o]);
    return s;
  })(
    {
      1: [
        function (require, module, exports) {
          "use strict";

          module.exports = require("./recorder").Recorder;
        },
        { "./recorder": 2 },
      ],
      2: [
        function (require, module, exports) {
          "use strict";

          var _createClass = (function () {
            function defineProperties(target, props) {
              for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
              }
            }
            return function (Constructor, protoProps, staticProps) {
              if (protoProps)
                defineProperties(Constructor.prototype, protoProps);
              if (staticProps) defineProperties(Constructor, staticProps);
              return Constructor;
            };
          })();

          Object.defineProperty(exports, "__esModule", {
            value: true,
          });
          exports.Recorder = undefined;

          var _inlineWorker = require("inline-worker");

          var _inlineWorker2 = _interopRequireDefault(_inlineWorker);

          function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
          }

          function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }

          var Recorder = (exports.Recorder = (function () {
            function Recorder(source, cfg) {
              var _this = this;

              _classCallCheck(this, Recorder);

              this.config = {
                bufferLen: 4096,
                numChannels: 2,
                mimeType: "audio/wav",
              };
              this.recording = false;
              this.callbacks = {
                getBuffer: [],
                exportWAV: [],
              };

              Object.assign(this.config, cfg);
              this.context = source.context;
              this.node = (
                this.context.createScriptProcessor ||
                this.context.createJavaScriptNode
              ).call(
                this.context,
                this.config.bufferLen,
                this.config.numChannels,
                this.config.numChannels
              );

              this.node.onaudioprocess = function (e) {
                if (!_this.recording) return;

                var buffer = [];
                for (
                  var channel = 0;
                  channel < _this.config.numChannels;
                  channel++
                ) {
                  buffer.push(e.inputBuffer.getChannelData(channel));
                }
                _this.worker.postMessage({
                  command: "record",
                  buffer: buffer,
                });
              };

              source.connect(this.node);
              this.node.connect(this.context.destination); //this should not be necessary

              var self = {};
              this.worker = new _inlineWorker2.default(function () {
                var recLength = 0,
                  recBuffers = [],
                  sampleRate = undefined,
                  numChannels = undefined;

                self.onmessage = function (e) {
                  switch (e.data.command) {
                    case "init":
                      init(e.data.config);
                      break;
                    case "record":
                      record(e.data.buffer);
                      break;
                    case "exportWAV":
                      exportWAV(e.data.type);
                      break;
                    case "getBuffer":
                      getBuffer();
                      break;
                    case "clear":
                      clear();
                      break;
                  }
                };

                function init(config) {
                  sampleRate = config.sampleRate;
                  numChannels = config.numChannels;
                  initBuffers();
                }

                function record(inputBuffer) {
                  for (var channel = 0; channel < numChannels; channel++) {
                    recBuffers[channel].push(inputBuffer[channel]);
                  }
                  recLength += inputBuffer[0].length;
                }

                function exportWAV(type) {
                  var buffers = [];
                  for (var channel = 0; channel < numChannels; channel++) {
                    buffers.push(mergeBuffers(recBuffers[channel], recLength));
                  }
                  var interleaved = undefined;
                  if (numChannels === 2) {
                    interleaved = interleave(buffers[0], buffers[1]);
                  } else {
                    interleaved = buffers[0];
                  }
                  var dataview = encodeWAV(interleaved);
                  var audioBlob = new Blob([dataview], { type: type });

                  self.postMessage({ command: "exportWAV", data: audioBlob });
                }

                function getBuffer() {
                  var buffers = [];
                  for (var channel = 0; channel < numChannels; channel++) {
                    buffers.push(mergeBuffers(recBuffers[channel], recLength));
                  }
                  self.postMessage({ command: "getBuffer", data: buffers });
                }

                function clear() {
                  recLength = 0;
                  recBuffers = [];
                  initBuffers();
                }

                function initBuffers() {
                  for (var channel = 0; channel < numChannels; channel++) {
                    recBuffers[channel] = [];
                  }
                }

                function mergeBuffers(recBuffers, recLength) {
                  var result = new Float32Array(recLength);
                  var offset = 0;
                  for (var i = 0; i < recBuffers.length; i++) {
                    result.set(recBuffers[i], offset);
                    offset += recBuffers[i].length;
                  }
                  return result;
                }

                function interleave(inputL, inputR) {
                  var length = inputL.length + inputR.length;
                  var result = new Float32Array(length);

                  var index = 0,
                    inputIndex = 0;

                  while (index < length) {
                    result[index++] = inputL[inputIndex];
                    result[index++] = inputR[inputIndex];
                    inputIndex++;
                  }
                  return result;
                }

                function floatTo16BitPCM(output, offset, input) {
                  for (var i = 0; i < input.length; i++, offset += 2) {
                    var s = Math.max(-1, Math.min(1, input[i]));
                    output.setInt16(
                      offset,
                      s < 0 ? s * 0x8000 : s * 0x7fff,
                      true
                    );
                  }
                }

                function writeString(view, offset, string) {
                  for (var i = 0; i < string.length; i++) {
                    view.setUint8(offset + i, string.charCodeAt(i));
                  }
                }

                function encodeWAV(samples) {
                  var buffer = new ArrayBuffer(44 + samples.length * 2);
                  var view = new DataView(buffer);

                  /* RIFF identifier */
                  writeString(view, 0, "RIFF");
                  /* RIFF chunk length */
                  view.setUint32(4, 36 + samples.length * 2, true);
                  /* RIFF type */
                  writeString(view, 8, "WAVE");
                  /* format chunk identifier */
                  writeString(view, 12, "fmt ");
                  /* format chunk length */
                  view.setUint32(16, 16, true);
                  /* sample format (raw) */
                  view.setUint16(20, 1, true);
                  /* channel count */
                  view.setUint16(22, numChannels, true);
                  /* sample rate */
                  view.setUint32(24, sampleRate, true);
                  /* byte rate (sample rate * block align) */
                  view.setUint32(28, sampleRate * 4, true);
                  /* block align (channel count * bytes per sample) */
                  view.setUint16(32, numChannels * 2, true);
                  /* bits per sample */
                  view.setUint16(34, 16, true);
                  /* data chunk identifier */
                  writeString(view, 36, "data");
                  /* data chunk length */
                  view.setUint32(40, samples.length * 2, true);

                  floatTo16BitPCM(view, 44, samples);

                  return view;
                }
              }, self);

              this.worker.postMessage({
                command: "init",
                config: {
                  sampleRate: this.context.sampleRate,
                  numChannels: this.config.numChannels,
                },
              });

              this.worker.onmessage = function (e) {
                var cb = _this.callbacks[e.data.command].pop();
                if (typeof cb == "function") {
                  cb(e.data.data);
                }
              };
            }

            _createClass(
              Recorder,
              [
                {
                  key: "record",
                  value: function record() {
                    this.recording = true;
                  },
                },
                {
                  key: "stop",
                  value: function stop() {
                    this.recording = false;
                  },
                },
                {
                  key: "clear",
                  value: function clear() {
                    this.worker.postMessage({ command: "clear" });
                  },
                },
                {
                  key: "getBuffer",
                  value: function getBuffer(cb) {
                    cb = cb || this.config.callback;
                    if (!cb) throw new Error("Callback not set");

                    this.callbacks.getBuffer.push(cb);

                    this.worker.postMessage({ command: "getBuffer" });
                  },
                },
                {
                  key: "exportWAV",
                  value: function exportWAV(cb, mimeType) {
                    mimeType = mimeType || this.config.mimeType;
                    cb = cb || this.config.callback;
                    if (!cb) throw new Error("Callback not set");

                    this.callbacks.exportWAV.push(cb);

                    this.worker.postMessage({
                      command: "exportWAV",
                      type: mimeType,
                    });
                  },
                },
              ],
              [
                {
                  key: "forceDownload",
                  value: function forceDownload(blob, filename) {
                    var url = (window.URL || window.webkitURL).createObjectURL(
                      blob
                    );
                    var link = window.document.createElement("a");
                    link.href = url;
                    link.download = filename || "output.wav";
                    var click = document.createEvent("Event");
                    click.initEvent("click", true, true);
                    link.dispatchEvent(click);
                  },
                },
              ]
            );

            return Recorder;
          })());

          exports.default = Recorder;
        },
        { "inline-worker": 3 },
      ],
      3: [
        function (require, module, exports) {
          "use strict";

          module.exports = require("./inline-worker");
        },
        { "./inline-worker": 4 },
      ],
      4: [
        function (require, module, exports) {
          (function (global) {
            "use strict";

            var _createClass = (function () {
              function defineProperties(target, props) {
                for (var key in props) {
                  var prop = props[key];
                  prop.configurable = true;
                  if (prop.value) prop.writable = true;
                }
                Object.defineProperties(target, props);
              }
              return function (Constructor, protoProps, staticProps) {
                if (protoProps)
                  defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
              };
            })();

            var _classCallCheck = function (instance, Constructor) {
              if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
              }
            };

            var WORKER_ENABLED = !!(
              global === global.window &&
              global.URL &&
              global.Blob &&
              global.Worker
            );

            var InlineWorker = (function () {
              function InlineWorker(func, self) {
                var _this = this;

                _classCallCheck(this, InlineWorker);

                if (WORKER_ENABLED) {
                  var functionBody = func
                    .toString()
                    .trim()
                    .match(/^function\s*\w*\s*\([\w\s,]*\)\s*{([\w\W]*?)}$/)[1];
                  var url = global.URL.createObjectURL(
                    new global.Blob([functionBody], { type: "text/javascript" })
                  );

                  return new global.Worker(url);
                }

                this.self = self;
                this.self.postMessage = function (data) {
                  setTimeout(function () {
                    _this.onmessage({ data: data });
                  }, 0);
                };

                setTimeout(function () {
                  func.call(self);
                }, 0);
              }

              _createClass(InlineWorker, {
                postMessage: {
                  value: function postMessage(data) {
                    var _this = this;

                    setTimeout(function () {
                      _this.self.onmessage({ data: data });
                    }, 0);
                  },
                },
              });

              return InlineWorker;
            })();

            module.exports = InlineWorker;
          }.call(
            this,
            typeof global !== "undefined"
              ? global
              : typeof self !== "undefined"
              ? self
              : typeof window !== "undefined"
              ? window
              : {}
          ));
        },
        {},
      ],
    },
    {},
    [1]
  )(1);
});

const { exec } = require("child_process");
const path = require("path");

const startActionServer = (dev) => {
  exec(
    `npm run ${dev ? "dev" : "start"}`,
    { cwd: path.join(process.cwd() + "/../Actions/") },
    (err, stdout, stderr) => {
      if (err) {
        console.log("Error starting Action server: ", err);
        console.log(stderr);
        return;
      }
      console.log("Successfully started action server");
      console.log(stdout);
    }
  );
};

const startApplicationsServer = (dev) => {
  exec(
    `npm run ${dev ? "dev" : "start"}`,
    { cwd: path.join(process.cwd() + "/../Applications/") },
    (err, stdout, stderr) => {
      if (err) {
        console.log("Error starting Applications server: ", err);
        console.log(stderr);
        return;
      }
      console.log("Successfully started applications server");
      console.log(stdout);
    }
  );
};

const startInterpretationServer = (dev) => {
  exec(
    `npm run ${dev ? "dev" : "start"}`,
    { cwd: path.join(process.cwd() + "/../Interpretation/") },
    (err, stdout, stderr) => {
      if (err) {
        console.log("Error starting Interpretation server: ", err);
        console.log(stderr);
        return;
      }
      console.log("Successfully started interpretation server");
      console.log(stdout);
    }
  );
};

const startSpeechServer = (dev) => {
  exec(
    `python app.py`,
    { cwd: path.join(process.cwd() + "/../Speech/") },
    (err, stdout, stderr) => {
      if (err) {
        console.log("Error starting Speech server: ", err);
        console.log(stderr);
        return;
      }
      console.log("Successfully started speech server");
      console.log(stdout);
    }
  );
};

const startThirdPartyServer = (dev) => {
  exec(
    `npm run ${dev ? "dev" : "start"}`,
    { cwd: path.join(process.cwd() + "/../Third Parties/") },
    (err, stdout, stderr) => {
      if (err) {
        console.log("Error starting Third Party server: ", err);
        console.log(stderr);
        return;
      }
      console.log("Successfully started third party server");
      console.log(stdout);
    }
  );
};

module.exports = {
  startActionServer,
  startApplicationsServer,
  startInterpretationServer,
  startSpeechServer,
  startThirdPartyServer,
};

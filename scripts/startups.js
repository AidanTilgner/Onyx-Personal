const { exec, spawn } = require("child_process");
const path = require("path");

const startActionServer = (dev) => {
  const server_process = spawn(
    `npm run ${dev ? "dev" : "start"}`,
    {
      cwd: path.join(process.cwd() + "/../Actions/"),
      shell: true,
    },
    (err, stdout, stderr) => {
      if (err) {
        console.log("[Action Server] Error starting Action server: ", err);
        console.log(stderr);
        return;
      }
      console.log("[Action Server] Successfully started Action Server");
      console.log(stdout);
    }
  );
  server_process.stdout.on("data", (data) => {
    console.log(`[Action Server]: ${data}`);
  });

  server_process.stderr.on("data", (data) => {
    console.log(`[Action Server] Error: ${data}`);
  });

  server_process.on("close", (code) => {
    console.log(`[Action Server] child process exited with code ${code}`);
  });
};

const startApplicationsServer = (dev) => {
  const server_process = spawn(
    `npm run ${dev ? "dev" : "start"}`,
    {
      cwd: path.join(process.cwd() + "/../Applications/"),
      shell: true,
    },
    (err, stdout, stderr) => {
      if (err) {
        console.log(
          "[Applications Server] Error starting Applications server: ",
          err
        );
        console.log(stderr);
        return;
      }
      console.log(
        "[Applications Server] Successfully started Applications Server"
      );
      console.log(stdout);
    }
  );
  server_process.stdout.on("data", (data) => {
    console.log(`[Applications Server]: ${data}`);
  });

  server_process.stderr.on("data", (data) => {
    console.log(`[Applications Server] Error: ${data}`);
  });

  server_process.on("close", (code) => {
    console.log(`[Applications Server] child process exited with code ${code}`);
  });
};

const startInterpretationServer = (dev) => {
  const server_process = spawn(
    `npm run ${dev ? "dev" : "start"}`,
    {
      cwd: path.join(process.cwd() + "/../Interpretation/"),
      shell: true,
    },
    (err, stdout, stderr) => {
      if (err) {
        console.log(
          "[Interpretation Server] Error starting Interpretation server: ",
          err
        );
        console.log(stderr);
        return;
      }
      console.log(
        "[Interpretation Server] Successfully started Interpretation Server"
      );
      console.log(stdout);
    }
  );
  server_process.stdout.on("data", (data) => {
    console.log(`[Interpretation Server]: ${data}`);
  });

  server_process.stderr.on("data", (data) => {
    console.log(`[Interpretation Server] Error: ${data}`);
  });

  server_process.on("close", (code) => {
    console.log(
      `[Interpretation Server] child process exited with code ${code}`
    );
  });
};

const startSpeechServer = (dev) => {
  const server_process = spawn(
    `python app.py`,
    {
      cwd: path.join(process.cwd() + "/../Speech/"),
      shell: true,
    },
    (err, stdout, stderr) => {
      if (err) {
        console.log("[Speech Server] Error starting Speech server: ", err);
        console.log(stderr);
        return;
      }
      console.log("[Speech Server] Successfully started Speech Server");
      console.log(stdout);
    }
  );
  server_process.stdout.on("data", (data) => {
    console.log(`[Speech Server]: ${data}`);
  });

  server_process.stderr.on("data", (data) => {
    console.log(`[Speech Server] Error: ${data}`);
  });

  server_process.on("close", (code) => {
    console.log(`[Speech Server] child process exited with code ${code}`);
  });
};

const startThirdPartyServer = (dev) => {
  const server_process = spawn(
    `npm run ${dev ? "dev" : "start"}`,
    {
      cwd: path.join(process.cwd() + "/../Third Parties/"),
      shell: true,
    },
    (err, stdout, stderr) => {
      if (err) {
        console.log(
          "[Third Parties Server] Error starting Third Parties Server: ",
          err
        );
        console.log(stderr);
        return;
      }
      console.log(
        "[Third Parties Server] Successfully started Third Parties Server"
      );
      console.log(stdout);
    }
  );
  server_process.stdout.on("data", (data) => {
    console.log(`[Third Parties Server]: ${data}`);
  });

  server_process.stderr.on("data", (data) => {
    console.log(`[Third Parties Server] Error: ${data}`);
  });

  server_process.on("close", (code) => {
    console.log(
      `[Third Parties Server] child process exited with code ${code}`
    );
  });
};

const startPeopleServer = (dev) => {
  const server_process = spawn(
    `npm run ${dev ? "dev" : "start"}`,
    {
      cwd: path.join(process.cwd() + "/../People/"),
      shell: true,
    },
    (err, stdout, stderr) => {
      if (err) {
        console.log("[People Server] Error starting People server: ", err);
        console.log(stderr);
        return;
      }
      console.log("[People Server] Successfully started People Server");
      console.log(stdout);
    }
  );
  server_process.stdout.on("data", (data) => {
    console.log(`[People Server]: ${data}`);
  });

  server_process.stderr.on("data", (data) => {
    console.log(`[People Server] Error: ${data}`);
  });

  server_process.on("close", (code) => {
    console.log(`[People Server] child process exited with code ${code}`);
  });
};

module.exports = {
  startActionServer,
  startApplicationsServer,
  startInterpretationServer,
  startSpeechServer,
  startThirdPartyServer,
  startPeopleServer,
};

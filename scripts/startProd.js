const {
  startActionServer,
  startApplicationsServer,
  startInterpretationServer,
  startSpeechServer,
  startThirdPartyServer,
} = require("./startups");

(async () => {
  startActionServer();
  startApplicationsServer();
  startInterpretationServer();
  startSpeechServer();
  startThirdPartyServer();

  console.log(
    "All server startup scripts have been executed, in case of errors check additional logging above"
  );
})();

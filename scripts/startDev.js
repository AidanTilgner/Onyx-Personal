const {
  startActionServer,
  startApplicationsServer,
  startInterpretationServer,
  startSpeechServer,
  startThirdPartyServer,
} = require("./startups");

(async () => {
  startActionServer(true);
  startApplicationsServer(true);
  startInterpretationServer(true);
  startSpeechServer(true);
  startThirdPartyServer(true);

  console.log(
    "All server startup scripts have been executed, in case of errors check additional logging above"
  );
})();

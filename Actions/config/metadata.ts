import { interpretationApi } from "./axios";
import { config } from "dotenv";
import { checkActionExists } from "../actions/utils";
import { writeFileSync } from "fs";

config({ path: "../.env" });

export const generateMetaData = async () => {
  try {
    // TODO: Endpoints for these aren't always gonna be accessible on startup if the other servers are down, so we need to handle that
    generateUnsupportedActions();
    generateUnsupportedActionsWithoutResponse();
  } catch (err) {
    console.log(err);
  }
};

const generateUnsupportedActions = async () => {
  try {
    const {
      data: { actions: existingActions, message },
    } = await interpretationApi.get("/training/actions/existing");
    const unsupportedActions: string[] = [];
    existingActions.forEach((action: string) => {
      if (!checkActionExists(action)) {
        unsupportedActions.push(action);
      }
    });
    const pathToFile = "./storage/metadata/unsupported_actions.json";
    writeFileSync(pathToFile, JSON.stringify(unsupportedActions, null, 2));

    return unsupportedActions;
  } catch (err) {
    console.log("Error generating unsupported actions:", err);
    return [];
  }
};

const generateUnsupportedActionsWithoutResponse = async () => {
  try {
    const {
      data: { actions: existingActions, message },
    } = await interpretationApi.get("/training/actions/without-response");
    const unsupportedActions: string[] = [];
    existingActions.forEach((action: string) => {
      if (!checkActionExists(action)) {
        unsupportedActions.push(action);
      }
    });
    const pathToFile =
      "./storage/metadata/unsupported_actions_without_response.json";
    writeFileSync(pathToFile, JSON.stringify(unsupportedActions, null, 2));

    return unsupportedActions;
  } catch (err) {
    console.log(err);
    return [];
  }
};

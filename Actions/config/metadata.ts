import { interpretationApi } from "./axios";
import { config } from "dotenv";
import { checkActionExists } from "../actions/utils";
import { writeFileSync } from "fs";

config({ path: "../.env" });

export const generateMetaData = async () => {
  try {
    generateUnsupportedActions();
  } catch (err) {
    console.log(err);
  }
};

const generateUnsupportedActions = async () => {
  try {
    const {
      data: { actions: existingActions, message },
    } = await interpretationApi.get("/training/actions/existing");
    console.log("Existing actions:", existingActions);
    const unsupportedActions: string[] = [];
    existingActions.forEach((action: string) => {
      if (!checkActionExists(action)) {
        unsupportedActions.push(action);
      }
    });
    console.log("Unsupported actions:", unsupportedActions);

    const pathToFile = "./storage/metadata/unsupported_actions.json";
    writeFileSync(pathToFile, JSON.stringify(unsupportedActions, null, 2));

    return unsupportedActions;
  } catch (err) {
    console.log("Error generating unsupported actions:", err);
    return [];
  }
};

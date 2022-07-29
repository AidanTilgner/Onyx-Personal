import { query, Router } from "express";
import { AppsPackage, AppsPackageBody } from "../definitions/packages";
import axios from "axios";
import multer from "multer";
import { SignatureHelpRetriggerCharacter } from "typescript";

const router = Router();

const queries: { [key: string]: Function } = {};

const commands: { [key: string]: Function } = {
  display_action_output: (out: any) => {
    console.log("Output:", out);
  },
};

const handlePackage = async (pkg: AppsPackage) => {
  try {
    const { current_step, steps, files } = pkg;
    const {
      query,
      command,
      deposit,
      data: { deposited },
      next,
    } = steps[current_step];

    let result: { command: string | null; query: string | null } = {
      command: null,
      query: null,
    };

    if (command) {
      const command_result = await commands[command](deposited);
      result.command = command_result;
      steps[current_step].data.gathered = command_result;

      if (deposit >= 0) {
        steps[deposit].data.deposited = command;
      }
    }

    if (query) {
      const query_result = await queries[query](deposited);
      result.query = query_result;
      steps[current_step].data.gathered = query_result;

      if (deposit >= 0) {
        steps[deposit].data.deposited = query_result;
      }
    }

    if (next) {
      axios.post(next + "/package-hook", {
        current_step: current_step + 1,
        steps: steps,
        files: files,
      });

      return { result: result };
    }
  } catch (err: any) {
    pkg.steps[pkg.current_step].errors.push(err);
    if (pkg.steps[pkg.current_step].next) {
      return axios.post(
        pkg.steps[pkg.current_step].next + "/package-hook",
        pkg
      );
    }
    return { error: `There was an error handling the package: ${err}` };
  }
};

const upload = multer({ dest: "tmp/" });

router.post("/", upload.any(), async (req, res) => {
  try {
    const { pkg } = req.body as AppsPackageBody;
    const result = await handlePackage(JSON.parse(pkg));
    res.send({
      message: "Successfully handled package",
      result: result,
    });
  } catch (err) {
    console.log("Error in package hook: ", err);
    // TODO: This should just add an error to the body
    return {
      error: "There was an error processing the package",
    };
  }
});

export default router;

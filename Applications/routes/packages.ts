import { Router } from "express";
import { AppsPackage, AppsPackageBody } from "../definitions/packages";
import axios from "axios";
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

    if (command) {
      const command_result = await commands[command](deposited);
      steps[current_step].data.gathered = command_result;

      if (deposit >= 0) {
        steps[deposit].data.deposited = command;
      }
    }

    if (query) {
      const query_result = await queries[query](deposited);
      steps[current_step].data.gathered = query_result;

      if (deposit >= 0) {
        steps[deposit].data.deposited = query_result;
      }
    }

    return axios.post(next + "/package-hook", {
      current_step: current_step + 1,
      steps: steps,
      files: files,
    });
  } catch (err: any) {
    pkg.steps[pkg.current_step].errors.push(err);
    return axios.post(pkg.steps[pkg.current_step] + "/package-hook", pkg);
  }
};

router.post("/", async (req, res) => {
  try {
    const { pkg } = req.body as AppsPackageBody;
    const result = await handlePackage(JSON.parse(pkg));
    res.send(result.data);
  } catch (err) {
    console.log(err);
    // TODO: This should just add an error to the body
    return {
      error: "There was an error processing the package",
    };
  }
});

export default router;

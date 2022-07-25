import { Router } from "express";
import { runNLU } from "../extraction/extract";
import { NLUPackage } from "../definitions/packages";
import axios from "axios";
const router = Router();

const queries: { [key: string]: Function } = {
  get_nlu: runNLU,
};

const handlePackage = async (pkg: NLUPackage) => {
  try {
    pkg = JSON.parse(pkg);
    const { current_step, steps, files } = pkg;
    const {
      query,
      deposit,
      data: { deposited },
      next,
    } = steps[current_step];

    const query_result = await queries[query](deposited);
    steps[current_step].data.gathered = query_result;

    if (deposit >= 0) {
      steps[deposit].data.deposited = query_result;
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
    const { pkg } = req.body;
    const result = await handlePackage(pkg);
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

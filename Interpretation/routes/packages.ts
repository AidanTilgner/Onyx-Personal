import { Router } from "express";
import { runNLU } from "../extraction/extract";
import { NLUPackage } from "../../documentation/types/packages";
import axios from "axios";
const router = Router();

const queries: { [key: string]: Function } = {
  get_nlu: runNLU,
};

router.post("/", async (req, res) => {
  try {
    // Example body:
    /**
    current_step: number,
    steps: {
        0: {
            query: "query_definition",
            command: "command_definition",
            deposit: 1,
            data: {
                deposited: any,
                gathered: any,
            },
            next: "http://<host>/<endpoint>",
            completed: bool,
            errors: [],
            use_files: number[]
        }
    },
    files: files_list
     */
    const { current_step, steps, files } = req.body as NLUPackage;
    const {
      query,
      command,
      deposit,
      data: { deposited, gathered },
      next,
      completed,
      errors,
      use_files,
    } = steps[current_step];

    const next_step = steps[current_step + 1];

    const query_result = await queries[query](deposited);

    if (deposit >= 0) {
      steps[deposit].data.deposited = query_result;
    }

    axios.post(next + "/package-hook", {
      current_step: current_step + 1,
      steps: steps,
      files: files,
    });
  } catch (err) {
    console.log(err);
    // TODO: This should just add an error to the body
    return {
      error: "There was an error processing the package",
    };
  }
});

export default router;

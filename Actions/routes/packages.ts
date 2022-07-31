import { Router } from "express";
import { ActionsPackage, ActionsPackageBody } from "../definitions/packages";
import FormData from "form-data";
import queries from "../mappings/queries";
import commands from "../mappings/commands";
import axios from "axios";
import multer from "multer";

const router = Router();

const parseAndUseNLU = async (nlu: {
  type: string;
  subtype: string;
  functionName: string;
}) => {
  console.log("Using NLU:", nlu);
  switch (nlu.type) {
    case "command":
      return await commands[nlu.functionName]();
    case "query":
      return await queries[nlu.functionName]();
    default:
      return null;
  }
};

const handlePackage = async (pkg: ActionsPackage) => {
  try {
    console.log("Handling package", pkg);
    const { current_step, steps } = pkg;
    const {
      query,
      command,
      deposit,
      data: { deposited },
      next,
    } = steps[current_step];

    let result: { command: any | null; query: any | null } = {
      command: null,
      query: null,
    };

    console.log("Data:", deposited, command);

    const parsingNLU =
      command === "parse_and_use_nlu" || query === "parse_and_use_nlu";

    if (parsingNLU) {
      const nlu = await parseAndUseNLU(deposited);
      result.command = nlu;
      result.query = nlu;
      steps[current_step].data.gathered = nlu;

      if (deposit >= 0) {
        steps[deposit].data.deposited = nlu;
      }
    }

    if (command && commands.hasOwnProperty(command) && !parsingNLU) {
      const command_result = await commands[command](deposited);
      result.command = command_result;
      steps[current_step].data.gathered = command_result;
    }

    if (query && queries.hasOwnProperty(query) && !parsingNLU) {
      console.log("Deposited Data:", deposited);
      const query_result = await queries[query](deposited);
      result.query = query_result;
      steps[current_step].data.gathered = query_result;
    }

    console.log("Result:", result);

    if (deposit >= 0 && !parsingNLU) {
      steps[deposit].data.deposited = result;
    }

    if (next) {
      return [
        {
          current_step: current_step + 1,
          steps: steps,
        },
        next,
      ];
    }

    return [
      {
        current_step: current_step + 1,
        steps: steps,
      },
      null,
    ];
  } catch (err: any) {
    console.log("Error handling package: ", err);
    pkg.steps[pkg.current_step].errors.push(err);
    if (pkg.steps[pkg.current_step].next) {
      return [
        pkg,
        pkg.steps[pkg.current_step].next,
        `There was an error handling the package: ${err}`,
      ];
    }
    return [pkg, null, `There was an error handling the package: ${err}`];
  }
};

const upload = multer({ dest: "tmp/" });
router.post("/", upload.any(), async (req, res) => {
  try {
    console.log("Recieved package", req.body);
    const { pkg } = req.body as ActionsPackageBody;
    const [newPkg, next] = await handlePackage(JSON.parse(pkg));
    const newBody = { pkg: JSON.stringify(newPkg), files: req.files };

    if (!next) {
      return res.send({
        status: "success",
        message: "Package handled successfully",
        result: newPkg,
      });
    }

    const { data } = await axios.post(next + "/package-hook", newBody);

    return res.send({
      message: "Successfully handled package",
      result: data,
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

import { Router } from "express";
import { ActionsPackage, ActionsPackageBody } from "../definitions/packages";
import mappings from "../actions/index";
import axios from "axios";
import multer from "multer";

const router = Router();

const parseAndUseNLU = async (nlu: {
  intent: string;
  action: string;
  metaData: any;
}) => {
  try {
    const { action, metaData } = nlu;
    return await mappings[action](metaData);
  } catch (err) {
    console.log("Error parsing NLU:", err);
    return {
      error: "There was an error parsing the NLU.",
    };
  }
};

const handlePackage = async (pkg: ActionsPackage) => {
  try {
    console.log("Handling package", pkg);
    const { current_step, steps } = pkg;
    const {
      action,
      deposit,
      data: { deposited },
      next,
    } = steps[current_step];

    let result: any;

    console.log("Data:", deposited);

    const parsingNLU = "parse_and_use_nlu";

    if (parsingNLU) {
      const nlu = await parseAndUseNLU(deposited);
      result = nlu;
      steps[current_step].data.gathered = nlu;
    }

    if (!parsingNLU) {
      const res = await mappings[action](deposited);
      result = res;
      steps[current_step].data.gathered = res;
    }

    if (deposit >= 0) {
      steps[deposit].data.deposited = result;
    }

    console.log("Result:", result);

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

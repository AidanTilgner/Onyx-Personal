import { Router } from "express";
import { AppsPackage, AppsPackageBody } from "../definitions/packages";
import { emitMessage } from "../utils/socket-io";
import FormData from "form-data";
import axios from "axios";
import multer from "multer";
import mappings from "../actions/mappings";

const router = Router();

const handlePackage = async (pkg: AppsPackage) => {
  try {
    const { current_step, steps } = pkg;
    const {
      action,
      deposit,
      data: { deposited },
      next,
    } = steps[current_step];

    let result: any;

    const res = await mappings[action](deposited);
    result = res;
    steps[current_step].data.gathered = res;

    if (deposit >= 0) {
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
    const { pkg } = req.body as AppsPackageBody;
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

    res.send({
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

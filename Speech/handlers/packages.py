import os
import string
from flask import jsonify
from processing.stt import predict_audio_from_file
import json
import requests

queries = {"stt": predict_audio_from_file}


def packagesHandler(request):
    if request.method == "POST":
        # TODO: Add support for this being the last step in the chain
        data = request.form
        print("Headers: ", request.headers.get("x-access-token"))
        pkg = json.loads(data["pkg"])
        current_step = pkg["steps"][str(pkg["current_step"])]
        file_name = current_step["use_file"] or current_step["use_files"][0]

        use_data = current_step["data"]["deposited"] or request.files[file_name]
        result = queries[current_step["action"]](use_data)
        current_step["data"]["gathered"] = result

        if (
            current_step["deposit"] >= 0
            and str(current_step["deposit"]) in pkg["steps"]
        ):
            pkg["steps"][str(current_step["deposit"])]["data"]["deposited"] = result

        current_step["completed"] = True

        pkg["current_step"] += 1

        if not pkg["current_step"] < len(pkg["steps"]):
            return jsonify({"result": result, "message": "Successfully handled query"})

        send_next = requests.Request(
            "POST",
            f"{current_step['next']}/package-hook",
            data={"pkg": json.dumps(pkg)},
            files=request.files,
        ).prepare()

        requests.Session().send(send_next)

        return jsonify({"result": result, "message": "Next step sent"})

import os
import string
from flask import jsonify
from processing.sst import predict_audio_from_request
import json
import requests

queries = {"sst": predict_audio_from_request}


def handle_package(request):
    # TODO: Add support for this being the last step in the chain
    data = request.form
    pkg = json.loads(data["pkg"])
    file = data.files[pkg.steps[pkg.current_step].use_file] or data.files[pkg.steps[pkg.current_step].use_files[0]] 

    use_data = pkg.steps[pkg.current_step].data.deposited or file
    query_result = queries[pkg.steps[pkg.current_step].query](use_data)
    pkg.steps[pkg.current_step].data.gathered = query_result

    if pkg.steps[pkg.current_step].deposit >= 0:
        pkg.steps[pkg.steps[pkg.current_step].deposit].data.deposited = query_result
    
    send_next = requests.Request(
        "POST",
        f"{pkg.next}/package-hook",
        files=request.files
    ).prepare()

    return requests.Session().send(send_next)
    
def packagesHandler(request):
    if request.method == "POST":
        handle_package(request)

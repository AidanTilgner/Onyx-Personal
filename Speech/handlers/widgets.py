from flask import send_file


def widgets(request, widget_id):
    # This is a handler for the widgets URL group
    if request.method == "GET":
        return send_file(f"widgets/{widget_id}.js")

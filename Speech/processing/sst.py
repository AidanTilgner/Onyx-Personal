import onnx
import torch
import onnxruntime
from omegaconf import OmegaConf
import os
from processing.te import apply_te
from processing.spellcheck import auto_correct_sentence

# import everything from utils in ./utils/utils.py
# from utils.utils import *

language = "en"
decoder, utils = torch.hub._load_local(
    hubconf_dir=os.path.join(os.path.dirname(__file__), "../utils/"),
    model="silero_stt",
    language=language,
)
(read_batch, split_into_batches, read_audio, prepare_model_input) = utils

onnx_model = onnx.load(os.path.join(os.path.dirname(__file__), "../models/model.onnx"))
onnx.checker.check_model(onnx_model)
ort_session = onnxruntime.InferenceSession(
    os.path.join(os.path.dirname(__file__), "../models/model.onnx")
)


def predict_audio(audio_path):
    """
    audio_path: path to audio file
    """
    # download a single file, any format compatible with TorchAudio
    test_files = [audio_path]
    batches = split_into_batches(test_files, batch_size=10)
    input = prepare_model_input(read_batch(batches[0]))

    # actual onnx inference and decoding
    onnx_input = input.detach().cpu().numpy()
    ort_inputs = {"input": onnx_input}
    ort_outs = ort_session.run(None, ort_inputs)
    decoded = decoder(torch.Tensor(ort_outs[0])[0])
    return decoded


def predict_audio_with_te(audio_path):
    decoded = predict_audio(audio_path)
    decoded = apply_te(decoded)
    return decoded


def predict_audio_with_autocorrect(audio_path):
    decoded = predict_audio(audio_path)
    corrected = auto_correct_sentence(decoded)
    return {"text": decoded, "corrected": corrected}

def predict_audio_from_file(file):
    ext = file.filename.split(".")[-1]
    filename = "temp." + ext
    file.save(os.path.join(os.path.dirname(__file__), "tmp/" + filename))
    text = predict_audio_with_autocorrect(os.path.join(os.path.dirname(__file__), "tmp/" + filename))
    os.remove(os.path.join(os.path.dirname(__file__), "tmp/" + filename))
    return text

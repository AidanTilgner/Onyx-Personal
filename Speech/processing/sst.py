import onnx
import torch
import onnxruntime
from omegaconf import OmegaConf
import os

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


def predictAudio(audio_path):
    """
    audio_path: path to audio file
    """
    # download a single file, any format compatible with TorchAudio
    print("Reading audio", audio_path)
    test_files = [audio_path]
    batches = split_into_batches(test_files, batch_size=10)
    input = prepare_model_input(read_batch(batches[0]))

    # actual onnx inference and decoding
    onnx_input = input.detach().cpu().numpy()
    ort_inputs = {"input": onnx_input}
    ort_outs = ort_session.run(None, ort_inputs)
    decoded = decoder(torch.Tensor(ort_outs[0])[0])
    return decoded

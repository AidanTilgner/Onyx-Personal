import onnx
import torch
import onnxruntime
from omegaconf import OmegaConf

# import everything from utils in ./utils/utils.py
# from utils.utils import *

language = "en"
_, decoder, utils = torch.hub._load_local(
    hubconf_dir="silero/", model="silero_stt", language=language
)
(read_batch, split_into_batches, read_audio, prepare_model_input) = utils

onnx_model = onnx.load("models/model.onnx")
onnx.checker.check_model(onnx_model)
ort_session = onnxruntime.InferenceSession("models/model.onnx")

# download a single file, any format compatible with TorchAudio
test_files = ["speech_orig.wav"]
batches = split_into_batches(test_files, batch_size=10)
input = prepare_model_input(read_batch(batches[0]))

# actual onnx inference and decoding
onnx_input = input.detach().cpu().numpy()
ort_inputs = {"input": onnx_input}
ort_outs = ort_session.run(None, ort_inputs)
decoded = decoder(torch.Tensor(ort_outs[0])[0])
print(decoded)

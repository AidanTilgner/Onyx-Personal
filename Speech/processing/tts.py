# V3
from email.mime import audio
import os
from typing import Text
import torch
from IPython.display import Audio, display
import inspect

device = torch.device("cpu")
torch.set_num_threads(4)
local_file = os.path.join(os.path.dirname(__file__), "../models/tts_model.pt")

if not os.path.isfile(local_file):
    torch.hub.download_url_to_file(
        "https://models.silero.ai/models/tts/en/v3_en.pt", local_file
    )


def generateRandomString(length):
    import random
    import string

    return "".join(random.choice(string.ascii_letters) for i in range(length))


model = torch.package.PackageImporter(local_file).load_pickle("tts_models", "model")
model.to(device)

example_text = "Hello there this is a test"
sample_rate = 24000
speaker = "en_0"
put_accent = True
put_yo = True

audio = model.apply_tts(
    text=example_text,
    speaker=speaker,
    sample_rate=sample_rate,
    put_accent=put_accent,
    put_yo=put_yo,
)

# print("Audio Output: ", audio)
print("save_wav signature", inspect.signature(model.save_wav))
audio_path = model.save_wav(
    text=example_text,
    speaker=speaker,
    sample_rate=sample_rate,
    put_accent=put_accent,
    put_yo=put_yo,
    audio_path="test.wav",
)
print("Audio Path: ", audio_path)
object_methods = [
    method_name for method_name in dir(model) if callable(getattr(model, method_name))
]

print("Object Methods: ", object_methods)
print("Write Wav: ", inspect.signature(model.write_wave))
# model.write_wave(
#     path="test.wav", audio=audio, sample_rate=sample_rate,
# )
print("Model: ", inspect.signature(model.model))

# display(Audio(audio, rate=sample_rate))

import torch
from zmq import device
import torchaudio
from glob import glob

language = "en"
device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")

model, decoder, utils = torch.hub.load(
    repo_or_dir="snakers4/silero-models",
    model="silero_stt",
    language=language,
    device=device,
)

(
    read_batch,
    split_into_batches,
    read_audio,
    prepare_model_input,
) = utils  # see function signature for details

test_files = glob("speech_orig.wav")

batches = split_into_batches(test_files, batch_size=10)
input = prepare_model_input(read_batch(batches[0]), device=device)

output = model(input)
for example in output:
    print(decoder(example.cpu()))

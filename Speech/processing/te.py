import os
import torch

model, example_texts, languages, punct, apply_te = torch.hub._load_local(
    hubconf_dir=os.path.join(os.path.dirname(__file__), "../utils/"), model="silero_te"
)


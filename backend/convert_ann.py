"""Convert and verify the trained PyTorch ANN for NumPy-only inference.

Run from Backend with a development environment that has PyTorch installed:
    python convert_ann.py
"""

from pathlib import Path

import numpy as np
import pandas as pd
import torch
import torch.nn as nn
import joblib


BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "models" / "ann_model.pt"
OUTPUT_PATH = BASE_DIR / "models" / "ann_model.npz"


class ANN(nn.Module):
    def __init__(self):
        super().__init__()
        self.model = nn.Sequential(
            nn.Linear(4, 6), nn.ReLU(),
            nn.Linear(6, 6), nn.ReLU(),
            nn.Linear(6, 1),
        )

    def forward(self, x):
        return self.model(x)


def numpy_predict(values, weights):
    first = np.maximum(values @ weights["model.0.weight"].T + weights["model.0.bias"], 0)
    second = np.maximum(first @ weights["model.2.weight"].T + weights["model.2.bias"], 0)
    return second @ weights["model.4.weight"].T + weights["model.4.bias"]


def main():
    torch.set_num_threads(1)
    model = ANN()
    model.load_state_dict(torch.load(MODEL_PATH, map_location="cpu", weights_only=True))
    model.eval()
    weights = {name: tensor.detach().cpu().numpy().copy() for name, tensor in model.state_dict().items()}

    dataset = pd.read_csv(BASE_DIR / "powerplant_data.csv")
    scaler = joblib.load(BASE_DIR / "scalers" / "ann_scaler.pkl")
    sample = dataset[["AT", "V", "AP", "RH"]].sample(n=min(512, len(dataset)), random_state=42)
    inputs = scaler.transform(sample).astype(np.float32)
    with torch.no_grad():
        expected = model(torch.from_numpy(inputs)).numpy()
    actual = numpy_predict(inputs, weights)
    max_error = float(np.max(np.abs(expected - actual)))
    if not np.allclose(expected, actual, rtol=1e-5, atol=1e-5):
        raise RuntimeError(f"NumPy ANN verification failed (max absolute error {max_error})")

    np.savez_compressed(OUTPUT_PATH, **weights)
    print(f"Verified {len(inputs)} samples; max absolute error: {max_error:.8g}")
    print(f"Wrote {OUTPUT_PATH}")


if __name__ == "__main__":
    main()

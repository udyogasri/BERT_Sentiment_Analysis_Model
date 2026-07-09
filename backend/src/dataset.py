import sys
from pathlib import Path

BACKEND_ROOT = Path(__file__).resolve().parents[1]
if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))

import pandas as pd
import torch
from torch.utils.data import Dataset
from transformers import BertTokenizer

from src.config import MODEL_NAME, MAX_LENGTH

class IMDBDataset(Dataset):

    def __init__(self, csv_file, tokenizer, max_length=128):

        self.data = pd.read_csv(csv_file)

        self.texts = self.data["text"]

        self.labels = self.data["label"]

        self.tokenizer = tokenizer

        self.max_length = max_length
    
    def __len__(self):
        return len(self.data)
    
    def __getitem__(self, index):

        if not isinstance(index, int):
            try:
                index = int(index)
            except Exception:
                raise TypeError(f"Dataset index must be an integer, got {type(index)}: {index}")

        text = str(self.texts.iloc[index])

        label = int(self.labels.iloc[index])

        encoding = self.tokenizer(
            text,
            add_special_tokens=True,
            max_length=self.max_length,
            padding="max_length",
            truncation=True,
            return_attention_mask=True,
            return_tensors="pt"
        )

        return {
            "input_ids": encoding["input_ids"].squeeze(0),
            "attention_mask": encoding["attention_mask"].squeeze(0),
            "labels": torch.tensor(label, dtype=torch.long)
        }
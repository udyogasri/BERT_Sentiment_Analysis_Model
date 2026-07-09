import sys
from pathlib import Path

BACKEND_ROOT = Path(__file__).resolve().parents[1]
if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))

from transformers import BertForSequenceClassification

from src.config import MODEL_NAME


def get_model():

    model = BertForSequenceClassification.from_pretrained(
        MODEL_NAME,
        num_labels=2
    )

    return model
import torch
from transformers import BertTokenizer
from transformers import BertForSequenceClassification

from config import MODEL_SAVE_PATH, MAX_LENGTH

device = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)

_tokenizer = None
_model = None

def get_prediction_model():
    global _tokenizer, _model
    if _model is None or _tokenizer is None:
        import os
        if not os.path.exists(MODEL_SAVE_PATH) or not os.listdir(MODEL_SAVE_PATH):
            raise OSError(
                f"Model weights not found at '{MODEL_SAVE_PATH}'. "
                "Please run training first: python src/train.py"
            )
        print(f"Loading tokenizer from {MODEL_SAVE_PATH}...")
        _tokenizer = BertTokenizer.from_pretrained(MODEL_SAVE_PATH)
        print(f"Loading trained model from {MODEL_SAVE_PATH}...")
        _model = BertForSequenceClassification.from_pretrained(MODEL_SAVE_PATH)
        _model.to(device)
        _model.eval()
        print("Model loaded successfully!")
    return _tokenizer, _model

def predict_sentiment(text):
    tokenizer, model = get_prediction_model()

    encoding = tokenizer(
        text,
        add_special_tokens=True,
        max_length=MAX_LENGTH,
        padding="max_length",
        truncation=True,
        return_attention_mask=True,
        return_tensors="pt"
    )

    input_ids = encoding["input_ids"].to(device)
    attention_mask = encoding["attention_mask"].to(device)

    with torch.no_grad():

        outputs = model(
            input_ids=input_ids,
            attention_mask=attention_mask
        )

        logits = outputs.logits

        probabilities = torch.softmax(logits, dim=1)

        prediction = torch.argmax(probabilities, dim=1).item()

        confidence = probabilities[0][prediction].item()

    label = "Positive" if prediction == 1 else "Negative"

    return label, confidence


if __name__ == "__main__":

    while True:

        text = input("\nEnter a movie review (or type 'exit'): ")

        if text.lower() == "exit":
            break

        sentiment, confidence = predict_sentiment(text)

        print(f"\nPrediction : {sentiment}")
        print(f"Confidence : {confidence*100:.2f}%")
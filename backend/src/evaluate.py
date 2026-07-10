import os
import argparse
import torch
from torch.utils.data import DataLoader, Subset
from transformers import BertTokenizer, BertForSequenceClassification
import numpy as np

import sys
from pathlib import Path

BACKEND_ROOT = Path(__file__).resolve().parents[1]
if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))

from src.dataset import IMDBDataset
from src.config import TEST_DATA_PATH, MODEL_SAVE_PATH, BATCH_SIZE, MAX_LENGTH

from sklearn.metrics import accuracy_score, precision_recall_fscore_support, classification_report


def load_model_and_tokenizer():
    if not os.path.exists(MODEL_SAVE_PATH) or not os.listdir(MODEL_SAVE_PATH):
        raise OSError(
            f"Model not found at '{MODEL_SAVE_PATH}'. Run training first."
        )

    tokenizer = BertTokenizer.from_pretrained(MODEL_SAVE_PATH)
    model = BertForSequenceClassification.from_pretrained(MODEL_SAVE_PATH)

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.to(device)
    model.eval()

    return tokenizer, model, device


def evaluate(subset: int | None = None):

    print("Loading model and tokenizer...")
    tokenizer, model, device = load_model_and_tokenizer()

    print("Loading test dataset...")
    original_test_dataset = IMDBDataset(csv_file=TEST_DATA_PATH, tokenizer=tokenizer, max_length=MAX_LENGTH)
    original_size = len(original_test_dataset)

    if subset is not None and subset > 0:
        subset_n = min(subset, original_size)
        print(f"Using subset of test set: {subset_n}/{original_size}")
        test_dataset = Subset(original_test_dataset, range(subset_n))
    else:
        print(f"Test set size: {original_size}")
        test_dataset = original_test_dataset

    test_loader = DataLoader(test_dataset, batch_size=BATCH_SIZE, shuffle=False)

    all_preds = []
    all_labels = []

    with torch.no_grad():
        for batch in test_loader:
            input_ids = batch["input_ids"].to(device)
            attention_mask = batch["attention_mask"].to(device)
            labels = batch["labels"].to(device)

            outputs = model(input_ids=input_ids, attention_mask=attention_mask)
            logits = outputs.logits
            preds = torch.argmax(logits, dim=1)

            all_preds.extend(preds.cpu().numpy().tolist())
            all_labels.extend(labels.cpu().numpy().tolist())

    y_true = np.array(all_labels)
    y_pred = np.array(all_preds)

    acc = accuracy_score(y_true, y_pred)
    precision, recall, f1, _ = precision_recall_fscore_support(y_true, y_pred, average="binary", zero_division=0)

    print("\nEvaluation Results")
    print(f"Accuracy : {acc:.4f}")
    print(f"Precision: {precision:.4f}")
    print(f"Recall   : {recall:.4f}")
    print(f"F1 Score : {f1:.4f}\n")

    print("Classification Report:\n")
    print(classification_report(y_true, y_pred, digits=4))

    return original_test_dataset, list(range(len(test_dataset))), y_true, y_pred


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Evaluate trained BERT model on test set")
    parser.add_argument("--subset", type=int, default=None, help="Number of test samples to evaluate (useful for quick checks)")
    parser.add_argument("--balanced", action="store_true", help="Create a balanced subset with equal samples from each class")
    parser.add_argument("--show-samples", type=int, default=0, help="Show predictions for a few sample reviews from the subset")
    args = parser.parse_args()

    # Load model/tokenizer once
    tokenizer, model, device = load_model_and_tokenizer()

    # Load the original dataset for indexing and balanced sampling
    orig_ds = IMDBDataset(csv_file=TEST_DATA_PATH, tokenizer=tokenizer, max_length=MAX_LENGTH)
    original_size = len(orig_ds)

    if args.subset is not None and args.subset > 0 and args.balanced:
        n_total = min(args.subset, original_size)
        n_per_class = n_total // 2

        indices_class_0 = [i for i, lab in enumerate(orig_ds.labels) if int(lab) == 0]
        indices_class_1 = [i for i, lab in enumerate(orig_ds.labels) if int(lab) == 1]

        import random
        random.seed(42)
        sel0 = random.sample(indices_class_0, min(n_per_class, len(indices_class_0)))
        sel1 = random.sample(indices_class_1, min(n_per_class, len(indices_class_1)))
        selected_indices = sel0 + sel1
        if len(selected_indices) > n_total:
            selected_indices = selected_indices[:n_total]

        test_dataset = Subset(orig_ds, selected_indices)
        test_loader = DataLoader(test_dataset, batch_size=BATCH_SIZE, shuffle=False)

        all_preds = []
        all_labels = []

        with torch.no_grad():
            for batch in test_loader:
                input_ids = batch["input_ids"].to(device)
                attention_mask = batch["attention_mask"].to(device)
                labels = batch["labels"].to(device)

                outputs = model(input_ids=input_ids, attention_mask=attention_mask)
                logits = outputs.logits
                preds = torch.argmax(logits, dim=1)

                all_preds.extend(preds.cpu().numpy().tolist())
                all_labels.extend(labels.cpu().numpy().tolist())

        y_true = np.array(all_labels)
        y_pred = np.array(all_preds)

        acc = accuracy_score(y_true, y_pred)
        precision, recall, f1, _ = precision_recall_fscore_support(y_true, y_pred, average="binary", zero_division=0)

        print("\nEvaluation Results (balanced subset)")
        print(f"Accuracy : {acc:.4f}")
        print(f"Precision: {precision:.4f}")
        print(f"Recall   : {recall:.4f}")
        print(f"F1 Score : {f1:.4f}\n")

        print("Classification Report:\n")
        print(classification_report(y_true, y_pred, digits=4))

        # Show sample predictions using the already-loaded tokenizer/model
        def predict_from_model(text):
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
                outputs = model(input_ids=input_ids, attention_mask=attention_mask)
                logits = outputs.logits
                probs = torch.softmax(logits, dim=1)
                pred = torch.argmax(probs, dim=1).item()
                conf = probs[0][pred].item()
            return pred, conf

        if args.show_samples and args.show_samples > 0:
            import random
            random.seed(42)
            sample_indices = random.sample(selected_indices, min(args.show_samples, len(selected_indices)))
            print(f"\nSample predictions (showing {len(sample_indices)}):\n")
            for idx in sample_indices:
                text = str(orig_ds.texts.iloc[idx])
                true_label = int(orig_ds.labels.iloc[idx])
                pred, conf = predict_from_model(text)
                label_text = "Positive" if pred == 1 else "Negative"
                print(f"Index: {idx} | True: {true_label} | Pred: {label_text} | Conf: {conf:.4f}")

    else:
        # fallback to original evaluate() behavior (first-N subset or full test set)
        evaluate(subset=args.subset)

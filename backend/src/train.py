import torch
from torch.utils.data import DataLoader, Subset
from transformers import BertTokenizer
from torch.optim import AdamW
from tqdm import tqdm

from dataset import IMDBDataset
from model import get_model
from config import (
    MODEL_NAME,
    MAX_LENGTH,
    BATCH_SIZE,
    LEARNING_RATE,
    EPOCHS,
    TRAIN_DATA_PATH,
    MODEL_SAVE_PATH
)

def train():

    # ----------------------------
    # Load Tokenizer
    # ----------------------------
    print("Loading tokenizer...")
    tokenizer = BertTokenizer.from_pretrained(MODEL_NAME)

    # ----------------------------
    # Create Dataset
    # ----------------------------
    print("Loading dataset...")
    train_dataset = IMDBDataset(
        csv_file=TRAIN_DATA_PATH,
        tokenizer=tokenizer,
        max_length=MAX_LENGTH
    )
    print(f"Dataset Size: {len(train_dataset)}")
    # Train on only 3000 reviews for faster testing
    train_dataset = Subset(train_dataset, range(3000))

    print(f"Training on {len(train_dataset)} reviews")

    # ----------------------------
    # Create DataLoader
    # ----------------------------
    print("Creating DataLoader...")
    train_loader = DataLoader(
        train_dataset,
        batch_size=BATCH_SIZE,
        shuffle=True
    )

    # ----------------------------
    # Load BERT Model
    # ----------------------------
    print("Loading BERT model...")
    model = get_model()
    print("Model loaded successfully!")

    # ----------------------------
    # Device (CPU / GPU)
    # ----------------------------
    device = torch.device(
        "cuda" if torch.cuda.is_available() else "cpu"
    )

    model.to(device)
    print(f"Using device: {device}")

    # ----------------------------
    # Optimizer
    # ----------------------------
    optimizer = AdamW(
        model.parameters(),
        lr=LEARNING_RATE
    )

    # ----------------------------
    # Training Mode
    # ----------------------------
    model.train()

    for epoch in range(EPOCHS):

        total_loss = 0

        print(f"\nEpoch {epoch+1}/{EPOCHS}")

        for batch in tqdm(train_loader):

            input_ids = batch["input_ids"].to(device)
            attention_mask = batch["attention_mask"].to(device)
            labels = batch["labels"].to(device)

            optimizer.zero_grad()

            outputs = model(
                input_ids=input_ids,
                attention_mask=attention_mask,
                labels=labels
            )

            loss = outputs.loss

            total_loss += loss.item()

            loss.backward()

            optimizer.step()
            
        avg_loss = total_loss / len(train_loader)

        print(f"Average Loss : {avg_loss:.4f}")

    # ----------------------------
    # Save Model
    # ----------------------------
    model.save_pretrained(MODEL_SAVE_PATH)

    # ----------------------------
    # Save Tokenizer
    # ----------------------------
    tokenizer.save_pretrained(MODEL_SAVE_PATH)

    print("\nModel saved successfully!")

if __name__ == "__main__":
    train()
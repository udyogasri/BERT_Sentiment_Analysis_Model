from datasets import load_dataset
import pandas as pd

print("=" * 60)
print("Downloading IMDb Dataset...")
print("=" * 60)

# Download IMDb dataset from Hugging Face
dataset = load_dataset("imdb")

print("\nDataset downloaded successfully!\n")

print(dataset)

# Convert to pandas DataFrame
train_df = pd.DataFrame(dataset["train"])
test_df = pd.DataFrame(dataset["test"])

print("\nTraining Dataset Shape :", train_df.shape)
print("Testing Dataset Shape  :", test_df.shape)

# Save CSV files
train_df.to_csv("data/train.csv", index=False)
test_df.to_csv("data/test.csv", index=False)

print("\nCSV files saved successfully!")

print("\nFirst 5 Training Samples:\n")
print(train_df.head())
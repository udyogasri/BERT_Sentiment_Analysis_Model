# ==========================================
# BERT MODEL CONFIGURATION
# ==========================================

from pathlib import Path

BACKEND_ROOT = Path(__file__).resolve().parents[1]

# Pretrained BERT model
MODEL_NAME = "bert-base-uncased"

# Maximum number of tokens in a review
MAX_LENGTH = 128

# Number of reviews processed together
BATCH_SIZE = 16

# Number of complete passes through the dataset
EPOCHS = 3

# Learning rate for AdamW optimizer
LEARNING_RATE = 2e-5

# Number of output classes - positive and negative sentiment
NUM_CLASSES = 2

# Random seed for reproducibility
RANDOM_SEED = 42

# File Paths
TRAIN_DATA_PATH = str(BACKEND_ROOT / "data" / "train.csv")
TEST_DATA_PATH = str(BACKEND_ROOT / "data" / "test.csv")

# Save locations
MODEL_SAVE_PATH = str(BACKEND_ROOT / "models" / "saved_model")

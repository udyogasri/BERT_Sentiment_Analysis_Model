# BERT Sentiment Analysis Model

This repository contains a PyTorch-based implementation of a sentiment analysis model using a pre-trained **BERT (Bidirectional Encoder Representations from Transformers)** model (`bert-base-uncased`) fine-tuned on the IMDb movie reviews dataset.

It features a modern **React frontend** dashboard that communicates with a **FastAPI backend** server to predict sentiment (Positive/Negative) and show confidence scores on any arbitrary text in real-time.

---

## 📂 Project Structure

```text
├── backend/                    # Python FastAPI Backend & Machine Learning Pipeline
│   ├── data/                   # Dataset directory (CSVs are downloaded here)
│   ├── models/                 # Saved local models and vocabulary
│   │   └── saved_model/        # Contains fine-tuned weights, config, and tokenizer
│   ├── src/                    # ML source code (train, dataset, predict, etc.)
│   ├── main.py                 # FastAPI API entrypoint
│   ├── .gitignore              # Git ignore rules for data, models, and virtual envs
│   └── requirements.txt        # Python backend dependencies
│
├── frontend/                   # React Frontend (Vite)
│   ├── src/                    # React components and styling
│   │   ├── App.jsx             # Main dashboard UI
│   │   └── index.css           # Glassmorphic CSS style system
│   ├── package.json            # Frontend packages & scripts
│   └── vite.config.js          # Vite config
│
└── README.md                   # Main setup instructions
```

---

## 🚀 Getting Started (Setup & Execution)

### Step 1: Set Up & Start the Backend

Open a terminal at the root of the project and run the following:

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Set up virtual environment
python -m venv .venv

# 3. Activate the virtual environment
# Windows (PowerShell):
.venv\Scripts\Activate.ps1
# Windows (CMD):
.venv\Scripts\activate.bat
# macOS/Linux:
source .venv/bin/activate

# 4. Install backend dependencies
pip install -r requirements.txt

# 5. Download the IMDb dataset
python src/download_dataset.py

# 6. Fine-tune the BERT model
python src/train.py

# 7. Start the FastAPI backend API
uvicorn main:app --reload
```
*The FastAPI server will start running on `http://127.0.0.1:8000`.*

---

### Step 2: Set Up & Start the Frontend

Open a **new terminal window** at the root of the project and run the following:

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install node dependencies
npm install

# 3. Start the Vite React development server
npm run dev
```
*The React application will start running on `http://localhost:5173`. Open this URL in your web browser.*

---

## ⚙️ Configuration & Hyperparameters

You can adjust hyperparameters in `backend/src/config.py`:
*   `MODEL_NAME`: Pretrained BERT backbone (defaults to `"bert-base-uncased"`).
*   `MAX_LENGTH`: Max number of tokens per text sequence (defaults to `128`).
*   `BATCH_SIZE`: Number of samples processed in parallel (defaults to `16`).
*   `EPOCHS`: Number of full training passes (defaults to `3`).
*   `LEARNING_RATE`: AdamW optimizer step size (defaults to `2e-5`).
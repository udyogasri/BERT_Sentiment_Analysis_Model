# BERT Sentiment Analysis Model

This project uses a fine-tuned BERT classifier for sentiment analysis on movie reviews. The current flow is:

1. Download the dataset
2. Train a BERT model locally
3. Evaluate the model on a test subset
4. Start the FastAPI backend
5. Start the React frontend and analyze text in the browser

The backend exposes a simple REST API for sentiment prediction, and the frontend sends text to that API and displays the predicted label and confidence.

---

## Project Structure

```text
backend/
  data/                # Dataset CSV files
  models/              # Local model artifacts (ignored by Git)
  src/
    config.py          # Model and training settings
    dataset.py         # Dataset loader for the CSV files
    download_dataset.py
    evaluate.py        # Evaluation script
    model.py           # Model definition
    predict.py         # Inference logic
    train.py           # Training script
  main.py              # FastAPI entrypoint
  requirements.txt

frontend/
  src/
    App.jsx            # Main UI
    InteractiveCanvas.jsx
    theme.js
  package.json
  vite.config.js
```

---

## Current Workflow

### 1. Set up the backend environment

Open PowerShell in the project root and run:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### 2. Download the dataset

```powershell
python src/download_dataset.py
```

This will place the training and test CSV files under the backend data folder.

### 3. Train the model

```powershell
python src/train.py
```

The script trains a lightweight BERT classifier using a balanced subset of reviews and saves the model locally to backend/models/saved_model.

### 4. Evaluate the model

```powershell
python src/evaluate.py --subset 200 --balanced --show-samples 5
```

This gives a quick accuracy/precision/recall/F1 report and prints a few sample predictions.

### 5. Start the backend

Open a new terminal and run:

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
python -m uvicorn main:app --host 127.0.0.1 --port 8000
```

The API will be available at:

- http://127.0.0.1:8000/
- http://127.0.0.1:8000/predict

### 6. Start the frontend

Open another terminal and run:

```powershell
cd frontend
npm install
npm run dev
```

Then open http://localhost:5173 in the browser.

---

## API Behavior

The backend accepts a JSON body like this:

```json
{
  "text": "This movie was amazing!"
}
```

It returns:

```json
{
  "text": "This movie was amazing!",
  "sentiment": "Positive",
  "confidence": 0.95
}
```

---

## Current Model Settings

The training configuration is defined in backend/src/config.py and currently uses:

- Model: bert-base-uncased
- Max length: 64
- Batch size: 4
- Epochs: 1
- Learning rate: 2e-5
- Training subset: 1000 balanced reviews

---

## Notes

- The trained model weights are stored locally under backend/models/saved_model.
- Large model artifacts are ignored by Git, so they stay local and do not need to be pushed to GitHub.
- If the model is not trained yet, the API will return an error until training has completed.
import os
import streamlit as st
import torch
from transformers import BertTokenizer, BertForSequenceClassification

# Set page configuration
st.set_page_config(
    page_title="BERT Sentiment Analyzer",
    page_icon="🎬",
    layout="centered"
)

# Title & Description
st.title("🎬 BERT Movie Review Sentiment Analyzer")
st.markdown("""
This app uses a fine-tuned **BERT (Bidirectional Encoder Representations from Transformers)** model 
to analyze the sentiment of movie reviews. It classifies text as either **Positive** or **Negative** 
along with a confidence score.
""")

# Load paths from config
try:
    from config import MODEL_SAVE_PATH, MAX_LENGTH, MODEL_NAME
except ImportError:
    MODEL_SAVE_PATH = "models/saved_model/"
    MAX_LENGTH = 128
    MODEL_NAME = "bert-base-uncased"

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

@st.cache_resource
def load_model_and_tokenizer(model_path):
    if not os.path.exists(model_path) or not os.listdir(model_path):
        return None, None
    
    try:
        tokenizer = BertTokenizer.from_pretrained(model_path)
        model = BertForSequenceClassification.from_pretrained(model_path)
        model.to(device)
        model.eval()
        return tokenizer, model
    except Exception:
        return None, None

# Try loading the model
tokenizer, model = load_model_and_tokenizer(MODEL_SAVE_PATH)

if model is None or tokenizer is None:
    st.warning("⚠️ **Model Not Found!**")
    st.info(
        f"It looks like you haven't trained the model yet, or the model files are missing in `{MODEL_SAVE_PATH}`.\n\n"
        "To train the model, please run the following commands in your terminal:\n"
        "```bash\n"
        "# 1. Download the IMDb dataset\n"
        "python src/download_dataset.py\n\n"
        "# 2. Train the BERT model\n"
        "python src/train.py\n"
        "```"
    )
else:
    st.success("✅ BERT model loaded successfully!")
    
    st.subheader("Analyze a Review")
    user_input = st.text_area(
        "Enter your movie review below:",
        placeholder="Type something like: 'This movie was absolutely fantastic! The acting was superb and the plot kept me engaged from start to finish.'",
        height=150
    )
    
    if st.button("Predict Sentiment", type="primary"):
        if not user_input.strip():
            st.error("Please enter some text to analyze.")
        else:
            with st.spinner("Analyzing sentiment..."):
                # Tokenize & encode
                encoding = tokenizer(
                    user_input,
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
                    probabilities = torch.softmax(logits, dim=1)
                    prediction = torch.argmax(probabilities, dim=1).item()
                    confidence = probabilities[0][prediction].item()
                
                sentiment = "Positive" if prediction == 1 else "Negative"
                confidence_percent = confidence * 100
                
                # Display Results beautifully
                st.subheader("Analysis Result")
                if sentiment == "Positive":
                    st.markdown(
                        f"""
                        <div style="background-color: #d4edda; color: #155724; padding: 20px; border-radius: 8px; border-left: 5px solid #28a745;">
                            <h3 style="margin-top: 0; color: #155724;">Positive Sentiment 🟢</h3>
                            <p style="margin-bottom: 0;">We are <b>{confidence_percent:.2f}%</b> confident that this review is positive.</p>
                        </div>
                        """,
                        unsafe_allow_html=True
                    )
                else:
                    st.markdown(
                        f"""
                        <div style="background-color: #f8d7da; color: #721c24; padding: 20px; border-radius: 8px; border-left: 5px solid #dc3545;">
                            <h3 style="margin-top: 0; color: #721c24;">Negative Sentiment 🔴</h3>
                            <p style="margin-bottom: 0;">We are <b>{confidence_percent:.2f}%</b> confident that this review is negative.</p>
                        </div>
                        """,
                        unsafe_allow_html=True
                    )

# Sidebar with background info
st.sidebar.title("About the Model")
st.sidebar.markdown(f"""
### Model Architecture
- **Base Model**: `{MODEL_NAME}`
- **Task**: Binary Sequence Classification (Sentiment Analysis)
- **Dataset**: IMDb Movie Reviews

### How it works
1. **Tokenization**: The input review is split into subword tokens using BERT's WordPiece tokenizer.
2. **BERT Processing**: The tokenized IDs and attention masks are passed through pre-trained BERT transformer layers.
3. **Classification Head**: The `[CLS]` token representation is sent to a linear layer that outputs raw scores (logits) for Positive and Negative sentiment.
4. **Softmax Output**: Logits are converted into probabilities representing confidence.
""")

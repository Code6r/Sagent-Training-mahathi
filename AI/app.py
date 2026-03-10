import streamlit as st
from pypdf import PdfReader
import re
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

st.set_page_config(page_title="Grocery AI Support", layout="centered")

st.title("🛒 Grocery Delivery AI Customer Support")
st.write("Upload your receipt and ask any question related to your order.")

# -----------------------------
# LOAD EMBEDDING MODEL
# -----------------------------

@st.cache_resource
def load_model():
    return SentenceTransformer("all-MiniLM-L6-v2")

model = load_model()

# -----------------------------
# PDF TEXT EXTRACTION
# -----------------------------

def extract_text_from_pdf(file):

    reader = PdfReader(file)
    text = ""

    for page in reader.pages:
        page_text = page.extract_text()

        if page_text:
            text += page_text + "\n"

    # Fix broken characters from PDF
    text = re.sub(r"\s+", " ", text)

    return text


# -----------------------------
# TEXT CHUNKING
# -----------------------------

def split_text(text, chunk_size=120):

    words = text.split()
    chunks = []

    for i in range(0, len(words), chunk_size):
        chunk = " ".join(words[i:i + chunk_size])
        chunks.append(chunk)

    return chunks


# -----------------------------
# VECTOR SEARCH (NO FAISS)
# -----------------------------

def retrieve_context(question, chunks):

    chunk_embeddings = model.encode(chunks)
    question_embedding = model.encode([question])

    similarities = cosine_similarity(question_embedding, chunk_embeddings)[0]

    top_indices = np.argsort(similarities)[-3:]

    context = ""

    for idx in top_indices:
        context += chunks[idx] + " "

    return context


# -----------------------------
# RESPONSE GENERATION
# -----------------------------

def generate_response(question, context):

    # Clean context
    context = re.sub(r"\s+", " ", context)

    # Extract key information
    store = re.search(r"[A-Z ]{5,}", context)
    total = re.search(r"TOTAL\s*\$?(\d+\.\d+)", context, re.I)
    latte = re.search(r"Vanilla Latte.*?(\d+)", context, re.I)

    response = "Thanks for contacting customer support.\n\n"

    if store:
        response += f"Store identified on receipt: **{store.group(0).strip()}**.\n\n"

    if latte and "latte" in question.lower():
        qty = latte.group(1)
        response += f"The receipt shows **{qty} Vanilla Latte (L)** items were billed.\n\n"

        response += (
            "If you only ordered one latte, this may indicate a duplicate charge. "
            "You can request a refund for the extra item and the amount will "
            "usually be returned within **3–5 business days**.\n\n"
        )

    if total:
        response += f"The total charged on this receipt is **${total.group(1)}**.\n\n"

    response += (
        "If you need help with refunds, missing items, or delivery issues, "
        "please let me know and I will assist you further."
    )

    return response


# -----------------------------
# UI INPUT
# -----------------------------

receipt = st.file_uploader("Upload Receipt (PDF or TXT)", type=["pdf", "txt"])

user_query = st.text_area("Ask your question about the order")

# -----------------------------
# PROCESS
# -----------------------------

if st.button("Submit Query"):

    if receipt is None:
        st.warning("Please upload a receipt first.")

    elif user_query.strip() == "":
        st.warning("Please type your question.")

    else:

        if receipt.type == "application/pdf":
            receipt_text = extract_text_from_pdf(receipt)

        else:
            receipt_text = receipt.read().decode()

        chunks = split_text(receipt_text)

        context = retrieve_context(user_query, chunks)

        answer = generate_response(user_query, context)

        st.subheader("💬 AI Support Response")
        st.write(answer)
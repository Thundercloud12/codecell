# RAG Chatbot

A simple Retrieval-Augmented Generation (RAG) chatbot that answers questions based on the PDFs in the `data/` folder.

## Setup

1. Ensure you have Python 3.8+ installed.

2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Place your PDF files in the `data/` folder. (The folder is already created with sample PDFs.)

4. Set your Groq API key in the `.env` file:
   ```
   GROQ_API_KEY=your_actual_groq_api_key_here
   ```

## Running the Chatbot

Run the script:
```
python rag_chatbot.py
```

The first run will process the PDFs and create a vectorstore (this may take a few minutes). Subsequent runs will load the existing vectorstore.

Type your questions in the prompt. Type 'quit' or 'exit' to stop.

## Sharing

To share with teammates:
- Zip the entire `ragbot/` folder.
- They can unzip it into their project, install requirements, set their API key, and run.

Note: The vectorstore (`faiss_index/`) is created locally and not included in sharing to keep it lightweight. It will be regenerated on first run.

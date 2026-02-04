import os
import glob
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from contextlib import asynccontextmanager

load_dotenv()

from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

# Global variables
chain = None
vectorstore = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global chain, vectorstore
    
    print("Initializing RAG Chatbot...")
    
    # Initialize embeddings
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    
    # Check if vectorstore exists
    if os.path.exists("faiss_index"):
        print("Loading existing vectorstore...")
        vectorstore = FAISS.load_local("faiss_index", embeddings, allow_dangerous_deserialization=True)
    else:
        print("Processing PDFs...")
        pdf_files = glob.glob("data/*.pdf")
        if not pdf_files:
            print("No PDFs found in data/ folder. Please add PDFs and run again.")
            raise Exception("No PDFs found")
        
        documents = []
        for pdf in pdf_files:
            print(f"Loading {pdf}...")
            loader = PyPDFLoader(pdf)
            documents.extend(loader.load())
        
        # Split texts
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        texts = text_splitter.split_documents(documents)
        
        # Create vectorstore
        vectorstore = FAISS.from_documents(texts, embeddings)
        vectorstore.save_local("faiss_index")
        print("Vectorstore created and saved.")
    
    # Initialize LLM
    llm = ChatGroq(
        model="llama-3.1-8b-instant", 
        api_key=os.getenv("GROQ_API_KEY"),
        temperature=0.6
    )
    
    # Create retriever
    retriever = vectorstore.as_retriever(search_kwargs={"k": 3})
    
    # Create prompt template
    template = """You are a helpful assistant for a city infrastructure and road maintenance portal. 
Answer the question based on the following context from official documents about road construction, 
traffic management, and municipal engineering guidelines.

If the question is not related to roads, infrastructure, or city maintenance, politely redirect 
the user to ask relevant questions.

If you don't find the answer in the context, say so honestly but try to provide general helpful information.

Context:
{context}

Question: {question}

Answer in a helpful, concise manner:"""
    
    prompt = ChatPromptTemplate.from_template(template)
    
    # Create chain
    chain = (
        {"context": retriever, "question": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )
    
    print("RAG Chatbot ready!")
    
    yield
    
    print("Shutting down RAG Chatbot...")

app = FastAPI(title="RAG Chatbot API", lifespan=lifespan)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str
    success: bool

@app.get("/health")
async def health():
    return {"status": "ok", "service": "rag-chatbot"}

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    global chain
    
    if not chain:
        raise HTTPException(status_code=503, detail="Chatbot not initialized")
    
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    
    try:
        response = chain.invoke(request.message)
        return ChatResponse(response=response, success=True)
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)

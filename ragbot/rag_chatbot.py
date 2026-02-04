import os
import glob
from dotenv import load_dotenv

load_dotenv()

from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

# Initialize embeddings
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

# Check if vectorstore exists
if os.path.exists("faiss_index"):
    print("Loading existing vectorstore...")
    vectorstore = FAISS.load_local("faiss_index", embeddings, allow_dangerous_deserialization=True)
else:
    print("Processing PDFs...")
    # Load PDFs
    pdf_files = glob.glob("data/*.pdf")
    if not pdf_files:
        print("No PDFs found in data/ folder. Please add PDFs and run again.")
        exit(1)
    
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
llm = ChatGroq(model="llama-3.1-8b-instant", api_key=os.getenv("GROQ_API_KEY"),temperature=0.6)

# Create retriever
retriever = vectorstore.as_retriever()

# Create prompt template
template = """Answer the question based only on the following context:

{context}

Question: {question}"""
prompt = ChatPromptTemplate.from_template(template)

# Create chain
chain = (
    {"context": retriever, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)

print("Chatbot ready! Ask questions about the PDFs.")

# Chat loop
while True:
    query = input("You: ")
    if query.lower() in ['quit', 'exit']:
        break
    try:
        response = chain.invoke(query)
        print(f"Bot: {response}")
    except Exception as e:
        print(f"Error: {e}")
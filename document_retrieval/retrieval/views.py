from django.shortcuts import render
import os
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from langchain_groq import ChatGroq
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain.chains import RetrievalQA
from langchain_community.vectorstores import FAISS
from langchain_ollama import OllamaEmbeddings
import logging

logger = logging.getLogger(__name__)

@csrf_exempt
def upload_and_query(request):
    # Add CORS headers to all responses
    def cors_response(data, status=200):
        response = JsonResponse(data, status=status)
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type, Accept"
        return response

    # Handle preflight requests
    if request.method == "OPTIONS":
        return cors_response({})

    print("Received request method:", request.method)
    print("Headers:", dict(request.headers))
    print("Files:", request.FILES)
    print("POST data:", request.POST)
    
    if request.method == 'POST':
        try:
            if 'file' not in request.FILES:
                return cors_response({"error": "No file uploaded"}, status=400)
            
            uploaded_file = request.FILES['file']
            query = request.POST.get('query', '')
            
            print(f"Processing file: {uploaded_file.name} with query: {query}")
            
            if not query:
                return cors_response({"error": "Query is required"}, status=400)
            
            # Save the uploaded file temporarily
            with open("temp_document.txt", "wb") as f:
                for chunk in uploaded_file.chunks():
                    f.write(chunk)
            
            try:
                # Load and split the document with explicit encoding
                loader = TextLoader("temp_document.txt", encoding='utf-8')
                try:
                    documents = loader.load()
                except Exception as e:
                    loader = TextLoader("temp_document.txt", encoding='latin-1')
                    documents = loader.load()
                
                text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
                texts = text_splitter.split_documents(documents)
                
                # Try to connect to Ollama
                try:
                    embeddings = OllamaEmbeddings(model="llama2", base_url="http://localhost:11434")
                except Exception as e:
                    print(f"Ollama connection error: {str(e)}")
                    return cors_response({
                        "error": "Failed to connect to Ollama. Please ensure Ollama server is running with: ollama serve"
                    }, status=500)
                
                # Create vector store
                vectorstore = FAISS.from_documents(texts, embeddings)
                retriever = vectorstore.as_retriever()
                
                # Add logging for API key check
                groq_api_key = "Your API key"  
                if not groq_api_key or len(groq_api_key) < 10:  # Basic validation
                    return cors_response({
                        "error": "Invalid GROQ API key format"
                    }, status=500)
                    
                logger.info(f"Using GROQ API key: {groq_api_key[:4]}...{groq_api_key[-4:]}")  # Log safely
                
                
                chat_model = ChatGroq(
                    temperature=0,
                    model_name="mixtral-8x7b-32768",
                    groq_api_key=groq_api_key
                )
                
                # Test the chat model
                try:
                    # Simple test query
                    test_response = chat_model.invoke("test")
                    logger.info("GROQ API connection test successful")
                except Exception as e:
                    logger.error(f"GROQ API test failed: {str(e)}")
                    return cors_response({
                        "error": f"GROQ API connection failed: {str(e)}"
                    }, status=500)
                
                # Create retrieval chain
                qa_chain = RetrievalQA.from_chain_type(
                    llm=chat_model,
                    chain_type="stuff",
                    retriever=retriever,
                    return_source_documents=True
                )
                
                # Retrieve the answer
                result = qa_chain({"query": query})
                response_data = {
                    "answer": result["result"],
                    "source_documents": [doc.page_content for doc in result["source_documents"]]
                }
                
                return cors_response(response_data)
                
            except Exception as e:
                print(f"Processing error: {str(e)}")
                return cors_response({
                    "error": f"Processing error: {str(e)}"
                }, status=500)
            
            finally:
                # Clean up the temporary file
                if os.path.exists("temp_document.txt"):
                    os.remove("temp_document.txt")
                    
        except Exception as e:
            print(f"Server error: {str(e)}")
            return cors_response({
                "error": f"Server error: {str(e)}"
            }, status=500)
    
    return cors_response({
        "error": "Invalid request method. Use POST to upload and query."
    }, status=405)

def api_root(request):
    return JsonResponse({
        'message': 'Welcome to the Document Retrieval API',
        'endpoints': {
            'upload_and_query': '/api/upload-and-query/',
        }
    })
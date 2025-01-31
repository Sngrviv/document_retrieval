# 📄 Document Retrieval System 🔍

## 🌟 Project Overview

A powerful Django-based document retrieval system leveraging cutting-edge technologies including LangChain, FAISS, and Groq for intelligent document processing and querying.

## ✨ Features

- 📤 Seamless Document Upload and Processing
- 🧩 Advanced Text Splitting and Vectorization
- 🤖 Intelligent Querying with Groq LLM
- 🌐 CORS-Enabled API Endpoints

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:
- Python 3.8+
- Django
- Node.js and npm
- Ollama
- React

## 🚀 Installation and Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/document-retrieval-system.git
cd document-retrieval-system
```

### 2. Backend Setup
```bash
# Navigate to the Django project directory
cd document_retrival

# Create a virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`

# Install Python dependencies
pip install -r requirements.txt

# Install Ollama
# Visit https://ollama.ai/ for installation instructions specific to your OS
```

### 3. Frontend Setup
```bash
# Navigate to the frontend directory
cd ../document-retrieval-frontend

# Install npm packages
npm install
npm install react-icons
```

## 🖥️ Running the Application

Open 4 separate terminal windows and run the following commands:

### Terminal 1: Django Server
```bash
cd document_retrival
python manage.py runserver
```

### Terminal 2: Ollama Service
```bash
ollama serve
```

### Terminal 3: Pull Llama2 Model
```bash
ollama pull llama2
```

### Terminal 4: React Frontend
```bash
cd document-retrieval-frontend
$env:NODE_OPTIONS="--openssl-legacy-provider"
npm start
```

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📜 License
[Add your license information here]

## 🙌 Acknowledgments
- Django
- LangChain
- FAISS
- Groq
- Ollama

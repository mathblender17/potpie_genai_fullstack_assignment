DecideForMe - AI Decision Assistant
===================================

**DecideForMe** is a full-stack generative AI application that helps users navigate complex choices. By leveraging the power of **Pydantic AI** and **Llama 3.1**, it acts as an objective reasoning engine—analyzing your options, constraints, and urgency to provide a structured, actionable recommendation with a confidence score.

🚀 Live Demo
------------

*   **Frontend (Vercel):** \[Insert your Vercel URL here\]
    
*   **Backend (Render):** https://decideforme-backend.onrender.com/docs (Swagger UI)
    

✨ Features
----------

*   **Structured Decision Analysis:** Instead of vague chat, get a strict JSON output containing a recommendation, reasoning, tradeoffs, and a fallback plan.
    
*   **Constraint Handling:** considers user-defined limitations (budget, time, location, etc.) before recommending an option.
    
*   **Confidence Scoring:** Assigns a 1-10 score to the recommendation based on how well the options fit the criteria.
    
*   **Real-time Streaming:** Fast interaction using a lightweight Llama 3.1 8B model.
    
*   **Modern UI:** Clean, responsive interface built with Next.js and Tailwind CSS.
    

🛠️ Tech Stack
--------------

### **Backend**

*   **Framework:** FastAPI (Python)
    
*   **AI Engine:** Pydantic AI (Agentic Workflow)
    
*   **Model Provider:** OpenRouter (Llama 3.1 8B Instruct)
    
*   **Validation:** Pydantic
    
*   **Deployment:** Render
    

### **Frontend**

*   **Framework:** Next.js 14+ (App Router)
    
*   **Styling:** Tailwind CSS
    
*   **State Management:** React Hooks
    
*   **Deployment:** Vercel



⚙️ Installation & Setup
-----------------------

### **1\. Backend Setup**

Bash
```
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
# Create .env file  echo "OPENROUTER_API_KEY=your_api_key_here" > .env

# Run locally
uvicorn main:app --reload   `
```
_The backend will start at http://localhost:8000_

### **2\. Frontend Setup**

Bash
```
cd frontend

# Install dependencies
npm install

# Run locally
npm run dev   `
```
_The frontend will start at http://localhost:3000_

🔌 API Reference
----------------

### POST /decide

Analyzes a decision scenario and returns a structured recommendation.

**Request Body:**

JSON
```
  {
"decision": "Which framework should I learn?",
"options": ["React", "Vue", "Angular"],
"constraints": ["Short learning curve", "High job demand"],
"urgency": "medium"
}   
```

**Response:**

```
{
"recommendation": "React",
"reasoning": "React offers the best balance of high job demand and moderate learning curve...",
"tradeoffs": ["Steeper learning curve than Vue", "Requires learning JSX"],
"fallback_plan": "Vue.js",
"confidence_score": 8
}   
```
📦 Deployment Guide
-------------------

### **Backend (Render)**

1.  Connect repo to Render.
    
2.  Select **Web Service**.
    
3.  **Root Directory:** backend
    
4.  **Build Command:** pip install -r requirements.txt
    
5.  **Start Command:** uvicorn main:app --host 0.0.0.0 --port $PORT
    
6.  **Environment Variables:**
    
    *   PYTHON\_VERSION: 3.11.9
        
    *   OPENROUTER\_API\_KEY: sk-or-v1-...
        

### **Frontend (Vercel)**

1.  Connect repo to Vercel.
    
2.  **Root Directory:** frontend
    
3.  **Build Command:** next build (default)
    
4.  Deploy!
    

🛡️ License
-----------

This project is open-source and available under the MIT License.

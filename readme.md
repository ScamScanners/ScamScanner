# Use Flask with React

## Flask Template with React

Divided into 2 main folders :

1. `backend` - Flask files
2. `frontend` - Next files

### To run the code you have to run 2 servers / terminals in local

#### Navigate to backend, create virtual environment and install dependencies

```
cd backend
python -m venv venv
source venv/bin/activate
pip3 install -r requirements.txt
```

#### Run the flask app in one terminal on port 4001

source venv/bin/activate
python3 applications.py

#### Run react for hot-loading on port 3000

```
cd commit-ts
npm install
npm run dev
```

## API Keys

-   You need to add api keys before starting either backend or frontend
-   One API key is in the commit-ts and backend directories each
-   One .env file is in each directory and here are the keys:
    -   NEXT_PUBLIC_SITE_URL=""
    -   HUME_API_KEY=""
    -   HUME_SECRET_KEY=""
    -   GROQ_API_KEY=""
    -   OPENAI_API_KEY=""
    -   BACKEND_API_URL=""

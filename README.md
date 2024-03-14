# SRTIFY

## Installation steps:

Clone the repository and open directory in terminal

### Frontend:

```
cd frontend
npm install

npm run dev

```

Change `env.example.local` to `env.local` and fill the values.

### Backend:

```
cd backend
python3 -m venv srtify
source srtify/bin/activate
pip -r requirements.txt


uvicorn main:app --reload
```

Edit the `.env.example` to `.env` and fill the values.

Visit `http://localhost:3000` and enjoy the service.

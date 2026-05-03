# LokKartavya

A simple student-project style web application to track the performance and budget of politicians.

## Features
- Home Page
- Directory of Politicians
- Politician Detail Page (with budget allocation)
- About Us
- Feedback Form
- Basic Login / Registration Pages

## Running Locally
This project uses a Flask backend API and a React frontend. You will need to run both concurrently.

### 1. Start the Flask Backend
Open a terminal and run:
```bash
pip install -r requirements.txt
python app.py
```

### 2. Start the React Frontend
Open a new, separate terminal and run:
```bash
cd frontend
npm install
npm run dev
```
Then, open the local URL provided by Vite (e.g. `http://localhost:5173`) in your web browser.

# SmartLib Setup Guide

## Quick Start

### Prerequisites
- Python 3.8+ installed
- Node.js 16+ installed
- MySQL 8.0+ installed and running
- OpenAI API key

### Step 1: Database Setup

1. **Start MySQL service** (if not already running)
2. **Create the database**:
   ```sql
   CREATE DATABASE library_db;
   ```

### Step 2: Environment Configuration

1. **Update the `.env` file** with your actual credentials:
   ```env
   MYSQL_USER=root
   MYSQL_PASSWORD=your_actual_password
   MYSQL_HOST=localhost
   MYSQL_DB=library_db
   OPENAI_API_KEY=your_actual_openai_api_key
   JWT_SECRET_KEY=supersecretjwtkey
   ```

### Step 3: Backend Setup

**Option A: Using the startup script (Windows)**
```bash
# Double-click start_backend.bat
```

**Option B: Manual setup**
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
python init_db.py
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Step 4: Frontend Setup

**Option A: Using the startup script (Windows)**
```bash
# Double-click start_frontend.bat
```

**Option B: Manual setup**
```bash
cd frontend
npm install
npm run dev
```

### Step 5: Access the Application

1. **Backend API**: http://localhost:8000
2. **Frontend App**: http://localhost:5173
3. **API Documentation**: http://localhost:8000/docs

## Default Login Credentials

After running `python init_db.py`, you can login with:
- **Username**: admin
- **Password**: admin123

## Troubleshooting

### Common Issues

1. **MySQL Connection Error**
   - Ensure MySQL is running
   - Check credentials in `.env` file
   - Verify database `library_db` exists

2. **Port Already in Use**
   - Backend: Change port in `uvicorn` command
   - Frontend: Change port in `vite.config.js`

3. **OpenAI API Error**
   - Verify your API key is correct
   - Check if you have sufficient credits

4. **CORS Issues**
   - Backend CORS is configured for `localhost:5173`
   - If using different port, update `main.py`

### Database Reset

To reset the database:
```bash
cd backend
python init_db.py
```

This will recreate all tables and add sample data.

## Development

### Backend Development
- API endpoints are in `backend/app/main.py`
- Database models in `backend/app/models.py`
- Authentication logic in `backend/app/auth.py`

### Frontend Development
- Components in `frontend/src/components/`
- Pages in `frontend/src/pages/`
- API calls in `frontend/src/api.js`

## Production Deployment

### Backend
1. Set production environment variables
2. Use a production WSGI server (e.g., Gunicorn)
3. Set up reverse proxy (e.g., Nginx)

### Frontend
1. Build the production bundle:
   ```bash
   npm run build
   ```
2. Serve the `dist` folder with a web server

## Support

If you encounter any issues:
1. Check the console logs
2. Verify all prerequisites are installed
3. Ensure all environment variables are set correctly
4. Check that all services are running on the correct ports

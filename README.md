# SmartLib - Smart Library Management System

A full-stack library management system with AI-powered chatbot assistance, built with React (Vite) frontend and FastAPI backend.

## Features

- **User Authentication**: JWT-based login/register for users and admins
- **Book Management**: Add, edit, delete, and search books (admin only)
- **Book Browsing**: Search and view books with filtering by genre
- **AI Chatbot**: Hugging Face-powered assistant for book recommendations and library help
- **Responsive Design**: Modern, mobile-friendly interface with black & white theme toggle
- **Role-based Access**: Separate dashboards for users and administrators
- **Library Statistics**: Real-time information about available and issued books

## Tech Stack

### Frontend
- React 18 with Vite
- React Router for navigation
- Axios for API calls
- React Hot Toast for notifications
- CSS3 for styling with theme support

### Backend
- FastAPI (Python)
- SQLAlchemy ORM
- MySQL database
- JWT authentication
- Hugging Face Inference API integration
- CORS enabled

## Prerequisites

- Python 3.8+
- Node.js 16+
- MySQL 8.0+
- Hugging Face API token (get it from [huggingface.co](https://huggingface.co/settings/tokens))
- Visual Studio Code (recommended)

## Running the Project in VS Code

### Step 1: Open Project in VS Code

1. **Open VS Code**
2. **Open the project folder:**
   - Click `File` → `Open Folder...`
   - Navigate to `smartlib3` folder
   - Click `Select Folder`

   Or use the command line:
   ```bash
   code smartlib3
   ```

### Step 2: Install VS Code Extensions (Recommended)

Install these helpful extensions:
- **Python** (by Microsoft) - For Python support
- **ES7+ React/Redux/React-Native snippets** - For React development
- **ESLint** - For JavaScript/React linting
- **MySQL** - For database management (optional)

### Step 3: Open Integrated Terminals

You'll need **two terminal windows** - one for backend and one for frontend.

#### Option A: Using VS Code Terminal Split

1. **Open Terminal:** Press `` Ctrl + ` `` (backtick) or go to `Terminal` → `New Terminal`
2. **Split Terminal:** Click the `+` dropdown next to the terminal tab → Select `Split Terminal`
   - Or use keyboard shortcut: `` Ctrl + Shift + ` ``
3. You now have two terminal panes side by side

#### Option B: Using Separate Terminal Windows

1. **First Terminal (Backend):**
   - Press `` Ctrl + ` `` to open terminal
   - This will be for the backend server

2. **Second Terminal (Frontend):**
   - Press `` Ctrl + Shift + ` `` to open a new terminal
   - Or click `Terminal` → `New Terminal`
   - This will be for the frontend server

### Step 4: Backend Setup in VS Code

#### 4.1 In the First Terminal (Backend Terminal)

1. **Navigate to backend directory:**
   ```powershell
   cd smartlib/backend
   ```

2. **Create virtual environment (if not exists):**
   ```powershell
   python -m venv venv
   ```

3. **Activate virtual environment:**
   ```powershell
   .\venv\Scripts\Activate.ps1
   ```
   
   **Note:** If you get an execution policy error, run:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

4. **Install Python dependencies:**
   ```powershell
   pip install -r requirements.txt
   ```
   
   Or if pip doesn't work:
   ```powershell
   .\venv\Scripts\python.exe -m pip install -r requirements.txt
   ```

5. **Create `.env` file:**
   - In VS Code, navigate to `smartlib/backend` folder in the Explorer
   - Right-click → `New File` → Name it `.env`
   - Add the following content:
   ```env
   MYSQL_USER=root
   MYSQL_PASSWORD=your_mysql_password
   MYSQL_HOST=localhost
   MYSQL_DB=library_db
   HUGGINGFACEHUB_API_TOKEN=your_huggingface_token
   JWT_SECRET_KEY=your_jwt_secret_key_here_make_it_long_and_random
   ```
   - Save the file (`Ctrl + S`)

6. **Create MySQL database:**
   - Open MySQL Workbench or MySQL command line
   - Run: `CREATE DATABASE library_db;`

7. **Run the backend server:**
   ```powershell
   .\venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```
   
   **You should see:**
   ```
   INFO:     Uvicorn running on http://0.0.0.0:8000
   INFO:     Application startup complete.
   ```

### Step 5: Frontend Setup in VS Code

#### 5.1 In the Second Terminal (Frontend Terminal)

1. **Navigate to frontend directory:**
   ```powershell
   cd smartlib/frontend
   ```

2. **Install Node dependencies:**
   ```powershell
   npm install
   ```

3. **Start the frontend development server:**
   ```powershell
   npm run dev
   ```
   
   **You should see:**
   ```
   VITE v5.4.20  ready in 462 ms
   ➜  Local:   http://localhost:5173/
   ```

### Step 6: Access the Application

1. **Open your browser** and go to: `http://localhost:5173`
2. The application should now be running!

### VS Code Tips & Shortcuts

#### Terminal Management
- **New Terminal:** `` Ctrl + Shift + ` ``
- **Split Terminal:** Click `+` dropdown → `Split Terminal`
- **Kill Terminal:** Click trash icon or close terminal tab
- **Switch Between Terminals:** `` Ctrl + PageUp/PageDown ``

#### File Navigation
- **Quick Open File:** `Ctrl + P` (type filename to search)
- **Go to Symbol:** `Ctrl + Shift + O` (navigate to functions/classes)
- **Search in Files:** `Ctrl + Shift + F`

#### Running Commands
- **Run Selected Code:** Select code → Right-click → `Run Selection in Terminal`
- **Run Python File:** Right-click on `.py` file → `Run Python File in Terminal`

#### Debugging (Optional)

**For Backend (Python):**
1. Go to `Run and Debug` panel (`Ctrl + Shift + D`)
2. Click `create a launch.json file`
3. Select `Python` → `Python File`
4. Add this configuration:
   ```json
   {
       "name": "Python: FastAPI",
       "type": "python",
       "request": "launch",
       "program": "${workspaceFolder}/smartlib/backend/venv/Scripts/uvicorn.exe",
       "args": [
           "app.main:app",
           "--reload",
           "--host", "0.0.0.0",
           "--port", "8000"
       ],
       "console": "integratedTerminal",
       "justMyCode": true
   }
   ```

**For Frontend (React):**
- Use browser DevTools (`F12` in browser)
- React Developer Tools extension (install from Chrome/Firefox store)

### VS Code Workspace Layout

Your VS Code workspace should look like this:

```
smartlib3/
├── smartlib/
│   ├── backend/
│   │   ├── app/
│   │   ├── venv/
│   │   ├── .env          ← Create this file
│   │   └── requirements.txt
│   └── frontend/
│       ├── src/
│       ├── node_modules/
│       └── package.json
└── README.md
```

### Quick Start Commands (Copy & Paste)

**Terminal 1 (Backend):**
```powershell
cd smartlib/backend
.\venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 (Frontend):**
```powershell
cd smartlib/frontend
npm run dev
```

### Using VS Code Tasks (Optional - Advanced)

You can create tasks to run both servers with a single command:

1. **Create `.vscode` folder** in the root (`smartlib3/.vscode`)
2. **Create `tasks.json`** file with this content:
   ```json
   {
       "version": "2.0.0",
       "tasks": [
           {
               "label": "Start Backend",
               "type": "shell",
               "command": ".\\venv\\Scripts\\python.exe",
               "args": [
                   "-m",
                   "uvicorn",
                   "app.main:app",
                   "--reload",
                   "--host",
                   "0.0.0.0",
                   "--port",
                   "8000"
               ],
               "options": {
                   "cwd": "${workspaceFolder}/smartlib/backend"
               },
               "problemMatcher": [],
               "presentation": {
                   "reveal": "always",
                   "panel": "new"
               },
               "runOptions": {
                   "runOn": "default"
               }
           },
           {
               "label": "Start Frontend",
               "type": "shell",
               "command": "npm",
               "args": ["run", "dev"],
               "options": {
                   "cwd": "${workspaceFolder}/smartlib/frontend"
               },
               "problemMatcher": [],
               "presentation": {
                   "reveal": "always",
                   "panel": "new"
               },
               "runOptions": {
                   "runOn": "default"
               }
           },
           {
               "label": "Start Both Servers",
               "dependsOn": [
                   "Start Backend",
                   "Start Frontend"
               ],
               "problemMatcher": [],
               "presentation": {
                   "reveal": "always"
               }
           }
       ]
   }
   ```

3. **Run the tasks:**
   - Press `Ctrl + Shift + P`
   - Type `Tasks: Run Task`
   - Select `Start Both Servers` (or run them individually)

## Step-by-Step Installation & Running Guide (General)

### Step 1: Clone/Download the Project

Navigate to the project directory:
```bash
cd smartlib3
```

### Step 2: Backend Setup

#### 2.1 Navigate to Backend Directory
```bash
cd smartlib/backend
```

#### 2.2 Create Virtual Environment

**Windows (PowerShell):**
```powershell
python -m venv venv
```

**Linux/Mac:**
```bash
python3 -m venv venv
```

#### 2.3 Activate Virtual Environment

**Windows (PowerShell):**
```powershell
.\venv\Scripts\Activate.ps1
```

**Windows (Command Prompt):**
```cmd
venv\Scripts\activate
```

**Linux/Mac:**
```bash
source venv/bin/activate
```

#### 2.4 Install Python Dependencies
```bash
pip install -r requirements.txt
```

**Note:** If you encounter issues, you can also use:
```bash
.\venv\Scripts\python.exe -m pip install -r requirements.txt
```

#### 2.5 Create `.env` File

Create a `.env` file in the `smartlib/backend` directory with the following content:

```env
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_HOST=localhost
MYSQL_DB=library_db
HUGGINGFACEHUB_API_TOKEN=your_huggingface_token
JWT_SECRET_KEY=your_jwt_secret_key_here_make_it_long_and_random
```

**Important:**
- Replace `your_mysql_password` with your actual MySQL root password
- Replace `your_huggingface_token` with your Hugging Face API token (starts with `hf_`)
- Replace `your_jwt_secret_key_here_make_it_long_and_random` with a secure random string

#### 2.6 Create MySQL Database

Open MySQL command line or MySQL Workbench and run:
```sql
CREATE DATABASE library_db;
```

Or using command line:
```bash
mysql -u root -p -e "CREATE DATABASE library_db;"
```

#### 2.7 Initialize Database Tables

The database tables will be automatically created when you first run the FastAPI server.

#### 2.8 Run Backend Server

**Windows (PowerShell):**
```powershell
.\venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Linux/Mac (with venv activated):**
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend server will start on `http://localhost:8000`

**Verify Backend is Running:**
- Open browser and go to: `http://localhost:8000`
- You should see the FastAPI documentation page

### Step 3: Frontend Setup

#### 3.1 Open a New Terminal Window

Keep the backend server running in the first terminal, and open a new terminal window.

#### 3.2 Navigate to Frontend Directory
```bash
cd smartlib/frontend
```

#### 3.3 Install Node Dependencies
```bash
npm install
```

#### 3.4 Start Frontend Development Server
```bash
npm run dev
```

The frontend server will start on `http://localhost:5173`

**Verify Frontend is Running:**
- Open browser and go to: `http://localhost:5173`
- You should see the SmartLib homepage

### Step 4: Access the Application

1. **Open your browser** and navigate to: `http://localhost:5173`
2. **Register** a new account or **Login** if you already have one
3. **Browse books** and use the **AI chatbot** for recommendations

## Running Commands Summary

### Backend (Terminal 1)
```powershell
# Navigate to backend
cd smartlib/backend

# Activate virtual environment (Windows PowerShell)
.\venv\Scripts\Activate.ps1

# Run server
.\venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend (Terminal 2)
```powershell
# Navigate to frontend
cd smartlib/frontend

# Run development server
npm run dev
```

## Troubleshooting

### Backend Issues

**Issue: Module not found errors**
```bash
# Make sure virtual environment is activated and reinstall dependencies
.\venv\Scripts\python.exe -m pip install -r requirements.txt
```

**Issue: Database connection error**
- Verify MySQL is running
- Check `.env` file has correct MySQL credentials
- Ensure database `library_db` exists

**Issue: Hugging Face API errors**
- Verify `HUGGINGFACEHUB_API_TOKEN` is set correctly in `.env`
- Check your Hugging Face token is valid
- The chatbot will still work with fallback responses if API fails

### Frontend Issues

**Issue: npm install fails**
```bash
# Clear cache and reinstall
npm cache clean --force
npm install
```

**Issue: Port already in use**
- Backend: Change port in uvicorn command (e.g., `--port 8001`)
- Frontend: Vite will automatically suggest an alternative port

**Issue: Cannot connect to backend**
- Ensure backend is running on `http://localhost:8000`
- Check CORS settings in backend
- Verify no firewall is blocking the connection

## Usage Guide

### For Regular Users

1. **Access the application**: Open `http://localhost:5173` in your browser
2. **Register**: Create a new user account with username, email, and password
3. **Login**: Use your credentials to access the system
4. **Browse Books**: 
   - View all available books
   - Search books by title, author, or genre
   - Filter by genre
5. **AI Assistant**: 
   - Click on the chatbot icon
   - Ask questions like:
     - "How many books are in the library?"
     - "How many books are available?"
     - "How many books are issued?"
     - "Recommend books about science"
     - "Show me all books"
     - "What genres are available?"
6. **My Books**: View your issued books and return them
7. **Theme Toggle**: Switch between light and black & white themes using the theme button

### For Administrators

1. **Admin Dashboard**: Access admin-only features after logging in as admin
2. **Book Management**: 
   - Add new books
   - Edit existing books
   - Delete books
3. **Issue Management**: 
   - View all book issues
   - Approve/reject book requests
   - Manage returns

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user info

### Books
- `GET /books` - Get all books
- `GET /books/search` - Search books
- `GET /books/{id}` - Get specific book
- `POST /admin/books` - Create book (admin only)
- `PUT /admin/books/{id}` - Update book (admin only)
- `DELETE /admin/books/{id}` - Delete book (admin only)

### Chat
- `POST /chat` - Send message to AI chatbot (requires authentication)

### Book Issues
- `GET /my-books` - Get current user's issued books
- `POST /books/{id}/issue` - Issue a book (user)
- `POST /books/{id}/return` - Return a book (user)
- `GET /admin/book-issues` - Get all book issues (admin)
- `PUT /admin/book-issues/{id}` - Update book issue status (admin)

## Database Schema

### Users Table
- id, username, email, hashed_password, is_admin, created_at, updated_at

### Books Table
- id, title, author, isbn, description, genre, publication_year, available_copies, total_copies, created_at, updated_at

### Chat Messages Table
- id, user_id, message, response, created_at

### Book Issues Table
- id, user_id, book_id, status, issue_date, return_date, created_at, updated_at

## Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- CORS protection
- Input validation with Pydantic
- SQL injection prevention with SQLAlchemy ORM

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

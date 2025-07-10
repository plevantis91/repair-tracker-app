@echo off
REM Repair Tracker App Setup Script for Windows

echo 🔧 Setting up Repair Tracker App...

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    exit /b 1
)

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.8+ first.
    exit /b 1
)

REM Check if PostgreSQL is installed
psql --version >nul 2>&1
if errorlevel 1 (
    echo ❌ PostgreSQL is not installed. Please install PostgreSQL 12+ first.
    exit /b 1
)

echo ✅ Prerequisites check passed

REM Set up frontend
echo 📦 Installing frontend dependencies...
npm install

REM Create frontend environment file
echo ⚙️ Setting up frontend environment...
copy env.local.example .env.local

REM Set up backend
echo 🐍 Setting up backend...
cd backend

REM Create virtual environment
echo 📦 Creating Python virtual environment...
python -m venv venv

REM Activate virtual environment
echo 🔌 Activating virtual environment...
call venv\Scripts\activate.bat

REM Install Python dependencies
echo 📦 Installing Python dependencies...
pip install -r requirements.txt

REM Create backend environment file
echo ⚙️ Setting up backend environment...
copy env.example .env

echo.
echo 🎉 Setup completed!
echo.
echo Next steps:
echo 1. Update backend\.env with your database credentials
echo 2. Update .env.local with your API URL if needed
echo 3. Set up your PostgreSQL database:
echo    - Create a database named 'repair_tracker'
echo    - Update the DATABASE_URL in backend\.env
echo.
echo To start the application:
echo 1. Start the backend: cd backend ^&^& venv\Scripts\activate ^&^& python app.py
echo 2. Start the frontend: npm run dev
echo.
echo The app will be available at http://localhost:3000

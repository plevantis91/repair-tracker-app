#!/bin/bash

# Repair Tracker App Setup Script
echo "🔧 Setting up Repair Tracker App..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+ first."
    exit 1
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL 12+ first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Set up frontend
echo "📦 Installing frontend dependencies..."
npm install

# Create frontend environment file
echo "⚙️ Setting up frontend environment..."
cp env.local.example .env.local

# Set up backend
echo "🐍 Setting up backend..."
cd backend

# Create virtual environment
echo "📦 Creating Python virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "🔌 Activating virtual environment..."
source venv/bin/activate

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

# Create backend environment file
echo "⚙️ Setting up backend environment..."
cp env.example .env

echo ""
echo "🎉 Setup completed!"
echo ""
echo "Next steps:"
echo "1. Update backend/.env with your database credentials"
echo "2. Update .env.local with your API URL if needed"
echo "3. Set up your PostgreSQL database:"
echo "   - Create a database named 'repair_tracker'"
echo "   - Update the DATABASE_URL in backend/.env"
echo ""
echo "To start the application:"
echo "1. Start the backend: cd backend && source venv/bin/activate && python app.py"
echo "2. Start the frontend: npm run dev"
echo ""
echo "The app will be available at http://localhost:3000"

# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Option 1: Using Setup Scripts (Recommended)

**For macOS/Linux:**
```bash
./setup.sh
```

**For Windows:**
```cmd
setup.bat
```

### Option 2: Manual Setup

1. **Install Dependencies**
   ```bash
   # Frontend
   npm install
   
   # Backend
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. **Set up Environment Variables**
   ```bash
   # Frontend
   cp env.local.example .env.local
   
   # Backend
   cd backend
   cp env.example .env
   # Edit .env with your database credentials
   ```

3. **Set up Database**
   ```bash
   # Create PostgreSQL database named 'repair_tracker'
   # Update DATABASE_URL in backend/.env
   cd backend
   python setup_db.py
   ```

4. **Start the Application**
   ```bash
   # Terminal 1 - Backend
   cd backend
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   python app.py
   
   # Terminal 2 - Frontend
   npm run dev
   ```

5. **Open the App**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🐳 Using Docker (Alternative)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📱 First Steps

1. **Register an Account**: Create your technician account
2. **Create Your First Job**: Click "New Job" to add a repair entry
3. **Upload Images**: Attach photos of the device/issue
4. **Track Progress**: Update job status as you work
5. **Manage Costs**: Track estimated vs actual costs

## 🔧 Troubleshooting

### Common Issues

**Database Connection Error:**
- Ensure PostgreSQL is running
- Check DATABASE_URL in backend/.env
- Verify database exists

**Frontend Can't Connect to Backend:**
- Check NEXT_PUBLIC_API_URL in .env.local
- Ensure backend is running on port 5000

**Image Upload Issues:**
- Check uploads directory permissions
- Verify file size limits

### Getting Help

- Check the main README.md for detailed documentation
- Review the API endpoints in the backend code
- Ensure all environment variables are set correctly

## 🎯 Next Steps

- Customize the UI with your branding
- Add more device types and status options
- Implement email notifications
- Add reporting and analytics features
- Deploy to production

Happy repairing! 🔧✨

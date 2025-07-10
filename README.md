# Repair Tracker App

A full-stack web application for tracking electronics and computer repair jobs. Built with Next.js, TypeScript, Flask, and PostgreSQL.

## Features

- **User Authentication**: Secure login and registration system
- **Repair Job Management**: Create, read, update, and delete repair jobs
- **Status Tracking**: Track job status (pending, in progress, completed, cancelled)
- **Priority Levels**: Set priority levels (low, medium, high)
- **Image Upload**: Upload and attach images to repair jobs
- **Cost Tracking**: Track estimated and actual costs
- **Search & Filter**: Search jobs by customer, device, or filter by status
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Form handling
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Lucide React** - Icons

### Backend
- **Flask** - Python web framework
- **Flask-SQLAlchemy** - Database ORM
- **Flask-JWT-Extended** - JWT authentication
- **Flask-CORS** - Cross-origin resource sharing
- **PostgreSQL** - Database
- **Werkzeug** - Security utilities

## Prerequisites

- Node.js 18+ and npm
- Python 3.8+
- PostgreSQL 12+
- Git

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd RepairTrackerApp
```

### 2. Set up the backend

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\\Scripts\\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp env.example .env
# Edit .env with your database credentials

# Set up database
python setup_db.py

# Run the Flask server
python app.py
```

### 3. Set up the frontend

```bash
# From the root directory
npm install

# Create environment file
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local

# Run the development server
npm run dev
```

## Environment Variables

### Backend (.env)
```
SECRET_KEY=your-secret-key-here
DATABASE_URL=postgresql://username:password@localhost/repair_tracker
JWT_SECRET_KEY=jwt-secret-string
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Database Schema

### Users Table
- `id` - Primary key
- `username` - Unique username
- `email` - Unique email address
- `password_hash` - Hashed password
- `created_at` - Timestamp

### Repair Jobs Table
- `id` - Primary key
- `user_id` - Foreign key to users table
- `customer_name` - Customer's name
- `device_type` - Type of device (laptop, desktop, etc.)
- `device_model` - Device model
- `issue_description` - Description of the issue
- `status` - Job status (pending, in_progress, completed, cancelled)
- `priority` - Priority level (low, medium, high)
- `estimated_cost` - Estimated repair cost
- `actual_cost` - Actual repair cost
- `notes` - Additional notes
- `images` - JSON array of image URLs
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user info

### Repair Jobs
- `GET /repair-jobs` - Get all jobs for current user
- `POST /repair-jobs` - Create new repair job
- `PUT /repair-jobs/<id>` - Update repair job
- `DELETE /repair-jobs/<id>` - Delete repair job

### File Upload
- `POST /upload` - Upload images

## Usage

1. **Start the application**:
   - Backend: `python backend/app.py` (runs on http://localhost:5000)
   - Frontend: `npm run dev` (runs on http://localhost:3000)

2. **Register/Login**: Create an account or login with existing credentials

3. **Create Repair Jobs**: Click "New Job" to create a repair entry with:
   - Customer information
   - Device details
   - Issue description
   - Priority level
   - Cost estimates
   - Images

4. **Track Progress**: Update job status as work progresses

5. **Search & Filter**: Use the search bar and status filter to find specific jobs

## Development

### Project Structure
```
RepairTrackerApp/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── Dashboard.tsx      # Main dashboard
│   ├── LoginForm.tsx      # Authentication form
│   ├── RepairJobCard.tsx  # Job card component
│   └── RepairJobModal.tsx # Job creation/edit modal
├── contexts/              # React contexts
│   └── AuthContext.tsx    # Authentication context
├── lib/                   # Utility libraries
│   ├── api.ts            # API client
│   └── utils.ts          # Utility functions
├── backend/              # Flask backend
│   ├── app.py            # Main Flask application
│   ├── requirements.txt  # Python dependencies
│   ├── setup_db.py      # Database setup script
│   └── env.example      # Environment variables example
└── README.md             # This file
```

### Adding New Features

1. **Frontend**: Add new components in the `components/` directory
2. **Backend**: Add new routes in `backend/app.py`
3. **Database**: Modify models in the Flask app and run migrations

### Deployment

#### Frontend (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy to your preferred platform
3. Set environment variables in your deployment platform

#### Backend (Heroku/Railway/DigitalOcean)
1. Create a `Procfile` with: `web: python app.py`
2. Deploy to your preferred platform
3. Set environment variables
4. Configure PostgreSQL database

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Commit your changes: `git commit -m 'Add feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the repository or contact the development team.

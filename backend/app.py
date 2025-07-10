from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import os
import uuid
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key-here')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'postgresql://username:password@localhost/repair_tracker')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'jwt-secret-string')
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Initialize extensions
db = SQLAlchemy(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)
CORS(app)

# Create upload directory
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'created_at': self.created_at.isoformat()
        }

class RepairJob(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    customer_name = db.Column(db.String(100), nullable=False)
    device_type = db.Column(db.String(50), nullable=False)
    device_model = db.Column(db.String(100), nullable=False)
    issue_description = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(20), default='pending')
    priority = db.Column(db.String(10), default='medium')
    estimated_cost = db.Column(db.Float)
    actual_cost = db.Column(db.Float)
    notes = db.Column(db.Text)
    images = db.Column(db.JSON, default=list)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'customer_name': self.customer_name,
            'device_type': self.device_type,
            'device_model': self.device_model,
            'issue_description': self.issue_description,
            'status': self.status,
            'priority': self.priority,
            'estimated_cost': self.estimated_cost,
            'actual_cost': self.actual_cost,
            'notes': self.notes,
            'images': self.images or [],
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

# Auth routes
@app.route('/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if not data or not data.get('username') or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Missing required fields'}), 400
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already exists'}), 400
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 400
    
    user = User(
        username=data['username'],
        email=data['email'],
        password_hash=generate_password_hash(data['password'])
    )
    
    db.session.add(user)
    db.session.commit()
    
    from flask_jwt_extended import create_access_token
    token = create_access_token(identity=user.id)
    
    return jsonify({
        'token': token,
        'user': user.to_dict()
    }), 201

@app.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({'error': 'Missing username or password'}), 400
    
    user = User.query.filter_by(username=data['username']).first()
    
    if not user or not check_password_hash(user.password_hash, data['password']):
        return jsonify({'error': 'Invalid credentials'}), 401
    
    from flask_jwt_extended import create_access_token
    token = create_access_token(identity=user.id)
    
    return jsonify({
        'token': token,
        'user': user.to_dict()
    })

@app.route('/auth/me', methods=['GET'])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify(user.to_dict())

# Repair job routes
@app.route('/repair-jobs', methods=['GET'])
@jwt_required()
def get_repair_jobs():
    user_id = get_jwt_identity()
    jobs = RepairJob.query.filter_by(user_id=user_id).order_by(RepairJob.created_at.desc()).all()
    return jsonify([job.to_dict() for job in jobs])

@app.route('/repair-jobs', methods=['POST'])
@jwt_required()
def create_repair_job():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    required_fields = ['customer_name', 'device_type', 'device_model', 'issue_description']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'error': f'Missing required field: {field}'}), 400
    
    job = RepairJob(
        user_id=user_id,
        customer_name=data['customer_name'],
        device_type=data['device_type'],
        device_model=data['device_model'],
        issue_description=data['issue_description'],
        status=data.get('status', 'pending'),
        priority=data.get('priority', 'medium'),
        estimated_cost=data.get('estimated_cost'),
        actual_cost=data.get('actual_cost'),
        notes=data.get('notes'),
        images=data.get('images', [])
    )
    
    db.session.add(job)
    db.session.commit()
    
    return jsonify(job.to_dict()), 201

@app.route('/repair-jobs/<int:job_id>', methods=['PUT'])
@jwt_required()
def update_repair_job(job_id):
    user_id = get_jwt_identity()
    job = RepairJob.query.filter_by(id=job_id, user_id=user_id).first()
    
    if not job:
        return jsonify({'error': 'Job not found'}), 404
    
    data = request.get_json()
    
    # Update fields
    job.customer_name = data.get('customer_name', job.customer_name)
    job.device_type = data.get('device_type', job.device_type)
    job.device_model = data.get('device_model', job.device_model)
    job.issue_description = data.get('issue_description', job.issue_description)
    job.status = data.get('status', job.status)
    job.priority = data.get('priority', job.priority)
    job.estimated_cost = data.get('estimated_cost', job.estimated_cost)
    job.actual_cost = data.get('actual_cost', job.actual_cost)
    job.notes = data.get('notes', job.notes)
    job.images = data.get('images', job.images)
    job.updated_at = datetime.utcnow()
    
    db.session.commit()
    
    return jsonify(job.to_dict())

@app.route('/repair-jobs/<int:job_id>', methods=['DELETE'])
@jwt_required()
def delete_repair_job(job_id):
    user_id = get_jwt_identity()
    job = RepairJob.query.filter_by(id=job_id, user_id=user_id).first()
    
    if not job:
        return jsonify({'error': 'Job not found'}), 404
    
    db.session.delete(job)
    db.session.commit()
    
    return jsonify({'message': 'Job deleted successfully'})

# Image upload route
@app.route('/upload', methods=['POST'])
@jwt_required()
def upload_images():
    if 'images' not in request.files:
        return jsonify({'error': 'No images provided'}), 400
    
    files = request.files.getlist('images')
    uploaded_urls = []
    
    for file in files:
        if file and file.filename:
            # Generate unique filename
            filename = secure_filename(file.filename)
            unique_filename = f"{uuid.uuid4()}_{filename}"
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
            
            # Save file
            file.save(file_path)
            
            # Store URL (in production, you'd upload to cloud storage)
            uploaded_urls.append(f"/uploads/{unique_filename}")
    
    return jsonify({'urls': uploaded_urls})

# Serve uploaded files
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return app.send_static_file(os.path.join('uploads', filename))

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=5000)

#!/usr/bin/env python3
"""
Database setup script for Repair Tracker App
Run this script to create the database and tables
"""

import os
import sys
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

def create_database():
    """Create the database if it doesn't exist"""
    database_url = os.environ.get('DATABASE_URL', 'postgresql://username:password@localhost/repair_tracker')
    
    # Extract database name from URL
    if 'postgresql://' in database_url:
        db_name = database_url.split('/')[-1]
        base_url = database_url.rsplit('/', 1)[0]
        
        # Connect to postgres database to create our database
        postgres_url = base_url + '/postgres'
        
        try:
            engine = create_engine(postgres_url)
            with engine.connect() as conn:
                # Check if database exists
                result = conn.execute(text(f"SELECT 1 FROM pg_database WHERE datname = '{db_name}'"))
                if not result.fetchone():
                    # Create database
                    conn.execute(text(f"CREATE DATABASE {db_name}"))
                    print(f"Database '{db_name}' created successfully")
                else:
                    print(f"Database '{db_name}' already exists")
        except Exception as e:
            print(f"Error creating database: {e}")
            return False
    
    return True

if __name__ == '__main__':
    print("Setting up Repair Tracker database...")
    if create_database():
        print("Database setup completed successfully!")
        print("\nNext steps:")
        print("1. Update your .env file with the correct database credentials")
        print("2. Run: python app.py")
        print("3. The tables will be created automatically when the app starts")
    else:
        print("Database setup failed!")
        sys.exit(1)

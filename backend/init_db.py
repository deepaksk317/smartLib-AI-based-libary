#!/usr/bin/env python3
"""
Database initialization script for SmartLib
Run this script to create the database tables and add sample data
"""

import os
import sys
from sqlalchemy import create_engine
from dotenv import load_dotenv

# Load environment variables first
load_dotenv()

# Add the app directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import Base, engine
from app.models import User, Book
from app.utils import get_password_hash

def init_database():
    """Initialize the database with tables and sample data"""
    
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("[OK] Database tables created successfully!")
    
    # Create a sample admin user
    from sqlalchemy.orm import sessionmaker
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    try:
        # Check if admin user already exists
        admin_user = db.query(User).filter(User.username == "admin").first()
        if not admin_user:
            admin_user = User(
                username="admin",
                email="admin@smartlib.com",
                hashed_password=get_password_hash("admin123"),
                is_admin=True
            )
            db.add(admin_user)
            print("[OK] Admin user created (username: admin, password: admin123)")
        else:
            print("[OK] Admin user already exists")
        
        # Add some sample books
        sample_books = [
            Book(
                title="The Great Gatsby",
                author="F. Scott Fitzgerald",
                isbn="9780743273565",
                description="A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream.",
                genre="Fiction",
                publication_year=1925,
                available_copies=3,
                total_copies=3
            ),
            Book(
                title="To Kill a Mockingbird",
                author="Harper Lee",
                isbn="9780061120084",
                description="A gripping tale of racial injustice and childhood innocence in the American South.",
                genre="Fiction",
                publication_year=1960,
                available_copies=2,
                total_copies=2
            ),
            Book(
                title="1984",
                author="George Orwell",
                isbn="9780451524935",
                description="A dystopian social science fiction novel about totalitarian control and surveillance.",
                genre="Science Fiction",
                publication_year=1949,
                available_copies=4,
                total_copies=4
            ),
            Book(
                title="The Selfish Gene",
                author="Richard Dawkins",
                isbn="9780192860927",
                description="A book on evolution that introduced the concept of the 'selfish gene'.",
                genre="Science",
                publication_year=1976,
                available_copies=2,
                total_copies=2
            ),
            Book(
                title="Sapiens",
                author="Yuval Noah Harari",
                isbn="9780062316097",
                description="A brief history of humankind, exploring how Homo sapiens came to dominate the world.",
                genre="History",
                publication_year=2011,
                available_copies=3,
                total_copies=3
            )
        ]
        
        # Add sample books if they don't exist
        for book in sample_books:
            existing_book = db.query(Book).filter(Book.isbn == book.isbn).first()
            if not existing_book:
                db.add(book)
        
        db.commit()
        print("[OK] Sample books added successfully!")
        
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("SmartLib Database Initialization")
    print("=" * 40)
    
    # Check if required environment variables are set
    required_vars = ["MYSQL_USER", "MYSQL_PASSWORD", "MYSQL_HOST", "MYSQL_DB"]
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    
    if missing_vars:
        print(f"Error: Missing required environment variables: {', '.join(missing_vars)}")
        print("Please check your .env file")
        sys.exit(1)
    
    try:
        init_database()
        print("\n[SUCCESS] Database initialization completed successfully!")
        print("\nYou can now start the FastAPI server with:")
        print("uvicorn app.main:app --reload --host 0.0.0.0 --port 8000")
    except Exception as e:
        print(f"\n[ERROR] Database initialization failed: {e}")
        sys.exit(1)

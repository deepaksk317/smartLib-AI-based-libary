from sqlalchemy.orm import Session
from sqlalchemy import or_
from . import models, schemas
from .utils import get_password_hash, verify_password

# User CRUD operations
def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_user(db: Session, username: str, password: str):
    user = get_user_by_username(db, username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

# Book CRUD operations
def get_books(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Book).offset(skip).limit(limit).all()

def get_book(db: Session, book_id: int):
    return db.query(models.Book).filter(models.Book.id == book_id).first()

def create_book(db: Session, book: schemas.BookCreate):
    db_book = models.Book(**book.dict())
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book

def update_book(db: Session, book_id: int, book: schemas.BookUpdate):
    db_book = get_book(db, book_id)
    if not db_book:
        return None
    
    update_data = book.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_book, field, value)
    
    db.commit()
    db.refresh(db_book)
    return db_book

def delete_book(db: Session, book_id: int):
    db_book = get_book(db, book_id)
    if not db_book:
        return False
    
    db.delete(db_book)
    db.commit()
    return True

def search_books(db: Session, query: str, genre: str = None):
    search_filter = or_(
        models.Book.title.contains(query),
        models.Book.author.contains(query),
        models.Book.description.contains(query)
    )
    
    if genre:
        search_filter = search_filter & (models.Book.genre == genre)
    
    return db.query(models.Book).filter(search_filter).all()

# Chat CRUD operations
def create_chat_message(db: Session, user_id: int, message: str, response: str = None):
    db_message = models.ChatMessage(
        user_id=user_id,
        message=message,
        response=response
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

# Book Issue CRUD operations
def create_book_issue(db: Session, user_id: int, book_id: int, due_date):
    # Check if book is available
    book = get_book(db, book_id)
    if not book or book.available_copies <= 0:
        return None
    
    # Create the issue record
    db_issue = models.BookIssue(
        user_id=user_id,
        book_id=book_id,
        due_date=due_date
    )
    db.add(db_issue)
    
    # Update book available copies
    book.available_copies -= 1
    
    db.commit()
    db.refresh(db_issue)
    return db_issue

def return_book(db: Session, issue_id: int, user_id: int):
    # Get the issue record
    db_issue = db.query(models.BookIssue).filter(
        models.BookIssue.id == issue_id,
        models.BookIssue.user_id == user_id,
        models.BookIssue.status == "issued"
    ).first()
    
    if not db_issue:
        return None
    
    # Update issue record
    from datetime import datetime
    db_issue.return_date = datetime.utcnow()
    db_issue.status = "returned"
    
    # Update book available copies
    book = get_book(db, db_issue.book_id)
    if book:
        book.available_copies += 1
    
    db.commit()
    db.refresh(db_issue)
    return db_issue

def get_user_issued_books(db: Session, user_id: int):
    return db.query(models.BookIssue).filter(
        models.BookIssue.user_id == user_id,
        models.BookIssue.status == "issued"
    ).all()

def get_all_book_issues(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.BookIssue).offset(skip).limit(limit).all()

def get_book_issue(db: Session, issue_id: int):
    return db.query(models.BookIssue).filter(models.BookIssue.id == issue_id).first()
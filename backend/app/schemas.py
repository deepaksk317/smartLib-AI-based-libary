from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# User schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class User(UserBase):
    id: int
    is_admin: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# Book schemas
class BookBase(BaseModel):
    title: str
    author: str
    isbn: Optional[str] = None
    description: Optional[str] = None
    genre: Optional[str] = None
    publication_year: Optional[int] = None
    available_copies: int = 1
    total_copies: int = 1

class BookCreate(BookBase):
    pass

class BookUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    isbn: Optional[str] = None
    description: Optional[str] = None
    genre: Optional[str] = None
    publication_year: Optional[int] = None
    available_copies: Optional[int] = None
    total_copies: Optional[int] = None

class Book(BookBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class BookSearch(BaseModel):
    query: str
    genre: Optional[str] = None

# Chat schemas
class ChatMessage(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str
    message_id: int

# Book Issue schemas
class BookIssueCreate(BaseModel):
    due_date: datetime

class BookIssue(BaseModel):
    id: int
    user_id: int
    book_id: int
    issue_date: datetime
    return_date: Optional[datetime] = None
    due_date: datetime
    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class BookIssueWithDetails(BaseModel):
    id: int
    user_id: int
    book_id: int
    issue_date: datetime
    return_date: Optional[datetime] = None
    due_date: datetime
    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    user: User
    book: Book
    
    class Config:
        from_attributes = True
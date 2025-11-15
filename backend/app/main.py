from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from huggingface_hub import InferenceClient
import os
import re
from dotenv import load_dotenv

from . import crud, models, schemas, utils, auth
from .database import SessionLocal, engine, get_db

load_dotenv()

# Create database tables
models.Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(title="SmartLib API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Hugging Face configuration
hf_api_key = os.getenv("HUGGINGFACEHUB_API_TOKEN")
if hf_api_key:
    hf_client = InferenceClient(token=hf_api_key)
else:
    hf_client = None
    print("Warning: HUGGINGFACEHUB_API_TOKEN not set. Chat will use fallback responses.")

# Authentication endpoints
@app.post("/auth/register", response_model=schemas.User)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    db_user = crud.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="Username already registered"
        )
    
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    
    return crud.create_user(db=db, user=user)

@app.post("/auth/login", response_model=schemas.Token)
def login(user_credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    user = crud.authenticate_user(db, user_credentials.username, user_credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = utils.create_access_token(
        data={"sub": user.username, "is_admin": user.is_admin}
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/auth/me", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

# Book endpoints
@app.get("/books", response_model=List[schemas.Book])
def read_books(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    books = crud.get_books(db, skip=skip, limit=limit)
    return books

@app.get("/books/search", response_model=List[schemas.Book])
def search_books(
    query: str,
    genre: str = None,
    db: Session = Depends(get_db)
):
    books = crud.search_books(db, query=query, genre=genre)
    return books

@app.get("/books/{book_id}", response_model=schemas.Book)
def read_book(book_id: int, db: Session = Depends(get_db)):
    book = crud.get_book(db, book_id=book_id)
    if book is None:
        raise HTTPException(status_code=404, detail="Book not found")
    return book

# Admin-only book endpoints
@app.post("/admin/books", response_model=schemas.Book)
def create_book(
    book: schemas.BookCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_admin_user)
):
    return crud.create_book(db=db, book=book)

@app.put("/admin/books/{book_id}", response_model=schemas.Book)
def update_book(
    book_id: int,
    book: schemas.BookUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_admin_user)
):
    updated_book = crud.update_book(db=db, book_id=book_id, book=book)
    if updated_book is None:
        raise HTTPException(status_code=404, detail="Book not found")
    return updated_book

@app.delete("/admin/books/{book_id}")
def delete_book(
    book_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_admin_user)
):
    success = crud.delete_book(db=db, book_id=book_id)
    if not success:
        raise HTTPException(status_code=404, detail="Book not found")
    return {"message": "Book deleted successfully"}

# Chat endpoint
@app.post("/chat", response_model=schemas.ChatResponse)
def chat_with_ai(
    message: schemas.ChatMessage,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    try:
        # Fetch library information to provide context
        all_books = crud.get_books(db, skip=0, limit=1000)
        total_books = len(all_books)
        
        # Calculate total available and issued books
        total_available_copies = sum(book.available_copies for book in all_books)
        total_copies = sum(book.total_copies for book in all_books)
        total_issued = total_copies - total_available_copies
        
        # Get all issued books from database (for verification)
        from sqlalchemy import func
        issued_books_count = db.query(func.count(models.BookIssue.id)).filter(
            models.BookIssue.status == "issued"
        ).scalar() or 0
        # Use calculated total_issued for consistency
        
        # Get book statistics
        genres = {}
        book_summaries = []
        for book in all_books:
            if book.genre:
                genres[book.genre] = genres.get(book.genre, 0) + 1
            book_summaries.append({
                "title": book.title,
                "author": book.author,
                "genre": book.genre or "Unknown",
                "description": book.description or "No description available",
                "available": book.available_copies,
                "total": book.total_copies
            })
        
        # Build library context
        genre_list = ", ".join([f"{genre} ({count})" for genre, count in genres.items()])
        library_context = f"""Library Information:
- Total unique book titles: {total_books}
- Total book copies: {total_copies}
- Available copies: {total_available_copies}
- Issued copies: {total_issued} (currently checked out)
- Genres available: {genre_list if genre_list else 'Various genres'}
- Books with details:
"""
        # Add first 10 books as examples
        for i, book_info in enumerate(book_summaries[:10], 1):
            library_context += f"{i}. {book_info['title']} by {book_info['author']} ({book_info['genre']}) - {book_info['description'][:100]}...\n"
        
        if total_books > 10:
            library_context += f"\n... and {total_books - 10} more books in the library.\n"
        
        # Enhanced system prompt with library context
        system_prompt = f"""You are a helpful library assistant for SmartLib. You have access to the following library information:

{library_context}

Your role is to:
1. Help users find books by providing information about available books
2. Answer questions about the library collection, including how many books are available and how many are currently issued/checked out
3. Provide book recommendations based on genres, topics, and descriptions - when users ask for recommendations about a specific domain/topic (e.g., "recommend books about science", "suggest fiction books", "books on history"), search through the library information and recommend relevant books
4. Share summaries and details about books in the library
5. Help with general library-related questions, including availability and issue statistics

IMPORTANT FOR RECOMMENDATIONS:
- When users ask for book recommendations by domain/topic/genre, carefully search through the library information above
- Match books based on genre, title, author, or description content
- Provide specific book titles, authors, genres, and descriptions from the library data
- If multiple books match, list them all with details
- Always use actual books from the library information provided above

Always provide accurate information based on the library data above. If asked about books, genres, or library statistics, use the information provided."""
        
        # Format prompt for Mistral instruction-tuned model
        full_prompt = f"<s>[INST] {system_prompt}\n\nUser Question: {message.message}\n\nPlease provide a helpful response based on the library information provided. [/INST]"
        
        # Call Hugging Face Inference API
        ai_response = None
        if hf_client:
            try:
                response = hf_client.text_generation(
                    model="mistralai/Mistral-7B-Instruct-v0.1",
                    prompt=full_prompt,
                    max_new_tokens=800,
                    temperature=0.7,
                    return_full_text=False
                )
                ai_response = response.strip()
            except Exception as hf_error:
                print(f"Hugging Face API error: {str(hf_error)}")
                # Will use fallback below
        
        # Use fallback if API call failed or client not available
        if not ai_response:
            # Fallback response if Hugging Face API fails
            user_msg_lower = message.message.lower()
            
            # Check for book recommendation requests
            recommendation_keywords = ["recommend", "suggest", "want to read", "looking for", "books about", "books on", "books in", "interested in"]
            is_recommendation = any(keyword in user_msg_lower for keyword in recommendation_keywords)
            
            if is_recommendation:
                # Extract topic/domain from the message
                topic = None
                genre_match = None
                
                # Check if user mentioned a specific genre
                for genre in genres.keys():
                    if genre.lower() in user_msg_lower:
                        genre_match = genre
                        topic = genre
                        break
                
                # If no genre match, try to extract topic from common patterns
                if not topic:
                    # Patterns like "books about X", "books on X", "interested in X"
                    patterns = [
                        r"books about (.+?)(?:\.|$|,|\?)",
                        r"books on (.+?)(?:\.|$|,|\?)",
                        r"books in (.+?)(?:\.|$|,|\?)",
                        r"interested in (.+?)(?:\.|$|,|\?)",
                        r"looking for (.+?)(?:\.|$|,|\?)",
                        r"want to read (.+?)(?:\.|$|,|\?)",
                        r"recommend (.+?)(?:\.|$|,|\?)",
                        r"suggest (.+?)(?:\.|$|,|\?)",
                    ]
                    
                    for pattern in patterns:
                        match = re.search(pattern, user_msg_lower)
                        if match:
                            topic = match.group(1).strip()
                            break
                
                # Search for matching books
                if topic or genre_match:
                    # Search books by genre, title, author, or description
                    matching_books = []
                    search_term = topic if topic else genre_match
                    
                    for book_info in book_summaries:
                        book_text = f"{book_info['title']} {book_info['author']} {book_info['genre']} {book_info['description']}".lower()
                        if search_term.lower() in book_text or (genre_match and book_info['genre'].lower() == genre_match.lower()):
                            matching_books.append(book_info)
                    
                    if matching_books:
                        ai_response = f"Based on your interest in '{search_term}', here are some great book recommendations from our library:\n\n"
                        for i, book_info in enumerate(matching_books[:10], 1):
                            ai_response += f"**{i}. {book_info['title']}** by {book_info['author']}\n"
                            ai_response += f"   Genre: {book_info['genre']}\n"
                            ai_response += f"   Description: {book_info['description']}\n"
                            ai_response += f"   Availability: {book_info['available']} of {book_info['total']} copies available\n\n"
                        
                        if len(matching_books) > 10:
                            ai_response += f"Plus {len(matching_books) - 10} more books matching your interest!\n"
                    else:
                        # If no exact match, show books from similar genres or all books
                        ai_response = f"I couldn't find exact matches for '{search_term}', but here are some great books from our library:\n\n"
                        for i, book_info in enumerate(book_summaries[:5], 1):
                            ai_response += f"**{i}. {book_info['title']}** by {book_info['author']}\n"
                            ai_response += f"   Genre: {book_info['genre']}\n"
                            ai_response += f"   Description: {book_info['description']}\n\n"
                        ai_response += f"\nAvailable genres: {', '.join(genres.keys()) if genres else 'Various'}"
                else:
                    # Generic recommendation - show books from different genres
                    ai_response = "Here are some book recommendations from different genres in our library:\n\n"
                    shown_genres = set()
                    count = 0
                    for book_info in book_summaries:
                        if count >= 8:
                            break
                        if book_info['genre'] not in shown_genres or len(shown_genres) < 3:
                            shown_genres.add(book_info['genre'])
                            ai_response += f"**{book_info['title']}** by {book_info['author']}\n"
                            ai_response += f"   Genre: {book_info['genre']}\n"
                            ai_response += f"   Description: {book_info['description']}\n"
                            ai_response += f"   Availability: {book_info['available']} of {book_info['total']} copies available\n\n"
                            count += 1
                    ai_response += f"\nYou can also ask for books in specific genres like: {', '.join(list(genres.keys())[:5]) if genres else 'Fiction, Science, History'}"
            
            # Provide intelligent responses based on common queries
            elif "how many books" in user_msg_lower or "total books" in user_msg_lower:
                ai_response = f"The library currently has:\n"
                ai_response += f"- {total_books} unique book titles\n"
                ai_response += f"- {total_copies} total book copies\n"
                ai_response += f"- {total_available_copies} copies available for checkout\n"
                ai_response += f"- {total_issued} copies currently issued/checked out\n"
                if genres:
                    ai_response += f"\nThe collection includes books from {len(genres)} different genres: {genre_list}."
            
            elif "available" in user_msg_lower and ("books" in user_msg_lower or "copies" in user_msg_lower):
                ai_response = f"There are {total_available_copies} book copies currently available in the library out of {total_copies} total copies. "
                ai_response += f"This means {total_issued} copies are currently issued/checked out."
            
            elif "issued" in user_msg_lower or "checked out" in user_msg_lower or "borrowed" in user_msg_lower:
                ai_response = f"Currently, {total_issued} book copies are issued/checked out from the library. "
                ai_response += f"There are {total_available_copies} copies still available for checkout out of {total_copies} total copies."
            elif "all books" in user_msg_lower or "list books" in user_msg_lower or "books in library" in user_msg_lower:
                ai_response = f"Here are the books in our library:\n\n"
                for i, book_info in enumerate(book_summaries, 1):
                    ai_response += f"{i}. **{book_info['title']}** by {book_info['author']}\n"
                    ai_response += f"   Genre: {book_info['genre']}\n"
                    ai_response += f"   Description: {book_info['description']}\n"
                    ai_response += f"   Availability: {book_info['available']} of {book_info['total']} copies available\n\n"
            elif "summary" in user_msg_lower or "summaries" in user_msg_lower:
                ai_response = "Here are summaries of books in our library:\n\n"
                for book_info in book_summaries[:10]:
                    ai_response += f"**{book_info['title']}** by {book_info['author']}: {book_info['description']}\n\n"
                if total_books > 10:
                    ai_response += f"Plus {total_books - 10} more books in the collection."
            elif "genre" in user_msg_lower or "genres" in user_msg_lower:
                ai_response = f"The library has books in the following genres:\n"
                for genre, count in genres.items():
                    ai_response += f"- {genre}: {count} books\n"
            else:
                # Try to find books matching any keywords in the message
                keywords = user_msg_lower.split()
                matching_books = []
                
                for book_info in book_summaries:
                    book_text = f"{book_info['title']} {book_info['author']} {book_info['genre']} {book_info['description']}".lower()
                    if any(keyword in book_text for keyword in keywords if len(keyword) > 3):
                        matching_books.append(book_info)
                
                if matching_books:
                    ai_response = f"I found {len(matching_books)} book(s) that might interest you:\n\n"
                    for i, book_info in enumerate(matching_books[:5], 1):
                        ai_response += f"**{i}. {book_info['title']}** by {book_info['author']}\n"
                        ai_response += f"   Genre: {book_info['genre']}\n"
                        ai_response += f"   Description: {book_info['description']}\n\n"
                else:
                    ai_response = f"I'm here to help you with library information! The library has:\n"
                    ai_response += f"- {total_books} unique book titles\n"
                    ai_response += f"- {total_available_copies} copies available for checkout\n"
                    ai_response += f"- {total_issued} copies currently issued\n\n"
                    ai_response += "You can ask me about:\n"
                    ai_response += "- How many books are in the library (shows available and issued counts)\n"
                    ai_response += "- How many books are available\n"
                    ai_response += "- How many books are issued/checked out\n"
                    ai_response += "- List of all books\n"
                    ai_response += "- Book summaries\n"
                    ai_response += "- Available genres\n"
                    ai_response += "- Book recommendations (e.g., 'recommend books about science', 'suggest fiction books')\n"
                    if hf_client:
                        ai_response += f"\nNote: AI service temporarily unavailable, but I can still help with library information!"
        
        # Save chat message to database
        db_message = crud.create_chat_message(
            db=db,
            user_id=current_user.id,
            message=message.message,
            response=ai_response
        )
        
        return schemas.ChatResponse(
            response=ai_response,
            message_id=db_message.id
        )
        
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"Chat error: {error_details}")  # Log for debugging
        raise HTTPException(
            status_code=500,
            detail=f"Error communicating with AI: {str(e)}"
        )

# Book Issue endpoints
@app.post("/books/{book_id}/issue", response_model=schemas.BookIssue)
def issue_book(
    book_id: int,
    issue_data: schemas.BookIssueCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    issue = crud.create_book_issue(
        db=db,
        user_id=current_user.id,
        book_id=book_id,
        due_date=issue_data.due_date
    )
    if not issue:
        raise HTTPException(
            status_code=400,
            detail="Book not available for issue"
        )
    return issue

@app.post("/books/return/{issue_id}")
def return_book(
    issue_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    issue = crud.return_book(db=db, issue_id=issue_id, user_id=current_user.id)
    if not issue:
        raise HTTPException(
            status_code=404,
            detail="Issue not found or already returned"
        )
    return {"message": "Book returned successfully"}

@app.get("/my-books", response_model=List[schemas.BookIssue])
def get_my_issued_books(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    issues = crud.get_user_issued_books(db=db, user_id=current_user.id)
    return issues

# Admin endpoints for book issues
@app.get("/admin/book-issues", response_model=List[schemas.BookIssueWithDetails])
def get_all_book_issues(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_admin_user)
):
    issues = crud.get_all_book_issues(db=db, skip=skip, limit=limit)
    return issues

# Health check endpoint
@app.get("/")
def read_root():
    return {"message": "SmartLib API is running!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

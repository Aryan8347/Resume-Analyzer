from fastapi import FastAPI, File, UploadFile, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import timedelta
from fastapi.security import OAuth2PasswordRequestForm
import logging

# Consolidated Imports
import auth_lib
from auth_lib import engine, get_db

from processor import extract_text, clean_text, extract_sections
from analyzer import run_full_analysis

# Initialize DB Tables
auth_lib.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Resume Intake Service")

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Constants
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB limit
ALLOWED_TYPES = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]

# --- AUTH ENDPOINTS ---

@app.post("/register", response_model=auth_lib.Token)
def register_user(user: auth_lib.UserCreate, db: Session = Depends(get_db)):
    print(f"DEBUG: Registering user -> Email: {user.email}, Password: {user.password}")
    # Check if user exists
    db_user = db.query(auth_lib.User).filter(auth_lib.User.email == user.email).first()
    if db_user:
        print("DEBUG: Registration failed - User already exists")
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash password and create user
    hashed_password = auth_lib.get_password_hash(user.password)
    new_user = auth_lib.User(email=user.email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    print("DEBUG: User registered successfully in DB")

    # Auto-login: Create access token
    access_token_expires = timedelta(minutes=auth_lib.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth_lib.create_access_token(
        data={"sub": new_user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/login", response_model=auth_lib.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    print(f"DEBUG: Login Attempt -> Username (Email): '{form_data.username}', Password: '{form_data.password}'")
    
    user = db.query(auth_lib.User).filter(auth_lib.User.email == form_data.username).first()
    if not user:
        print("DEBUG: Login Failed - User not found in DB")
    elif not auth_lib.verify_password(form_data.password, user.hashed_password):
        print("DEBUG: Login Failed - Password mismatch")
    
    if not user or not auth_lib.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    print("DEBUG: Login Success")
    access_token_expires = timedelta(minutes=auth_lib.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth_lib.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


# --- UPLOAD ENDPOINT (Unchanged) ---

@app.post("/upload/resume")
async def upload_resume(file: UploadFile = File(...)):
    """
    Endpoint to upload resume, validate, and extract text.
    """
    # 1. Validate File Type
    if file.content_type not in ALLOWED_TYPES:
        if not (file.filename.endswith(".pdf") or file.filename.endswith(".docx")):
            raise HTTPException(status_code=400, detail="Invalid file type. Only PDF and DOCX allowed.")

    # 2. Validate File Size
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large. Max size is 5MB.")
    
    try:
        # 3. Extract Text
        raw_text = extract_text(content, file.filename)
        
        # 4. Clean Text
        cleaned_text = clean_text(raw_text)
        
        # 5. Extract Sections
        sections = extract_sections(cleaned_text)

        # 6. Advanced Analysis
        analysis_results = run_full_analysis(cleaned_text, len(content))
        
        return {
            "filename": file.filename,
            "extracted_text_length": len(cleaned_text),
            "cleaned_text": cleaned_text,
            "sections": sections,
            "analysis": analysis_results
        }
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logging.error(f"Processing error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during processing.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)

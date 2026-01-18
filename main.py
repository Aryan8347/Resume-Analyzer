from fastapi import FastAPI, File, UploadFile, HTTPException
from extractor import extract_text
from cleaner import clean_text
from parser import extract_sections
from analyzer import run_full_analysis
import logging

app = FastAPI(title="Resume Intake Service")

# Constants
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB limit
ALLOWED_TYPES = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]

@app.post("/upload/resume")
async def upload_resume(file: UploadFile = File(...)):
    """
    Endpoint to upload resume, validate, and extract text.
    """
    # 1. Validate File Type
    if file.content_type not in ALLOWED_TYPES:
        # Fallback check on extension if content-type is generic binary
        if not (file.filename.endswith(".pdf") or file.filename.endswith(".docx")):
            raise HTTPException(status_code=400, detail="Invalid file type. Only PDF and DOCX allowed.")

    # 2. Validate File Size
    # Reading into memory for simplicity as requested "Store file temporarily (in-memory)"
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

        # 6. Advanced Analysis (Spell check, Skills, Roles)
        analysis_results = run_full_analysis(cleaned_text)
        
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
    uvicorn.run(app, host="0.0.0.0", port=8000)

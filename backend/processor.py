import io
import logging
import re
import json
import requests
import fitz  # PyMuPDF
import pytesseract
from pdf2image import convert_from_bytes
from docx import Document
from PIL import Image

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- CLEANER ---
def clean_text(text: str) -> str:
    """
    Cleans the extracted text by removing extra spaces and normalizing case.
    """
    if not text:
        return ""

    # Replace multiple whitespace characters (including newlines) with a single space.
    text = re.sub(r'\s+', ' ', text)

    # Strip leading/trailing whitespaces
    text = text.strip()

    # Normalize case
    text = text.lower()

    return text

# --- EXTRACTOR ---
def extract_text(file_content: bytes, filename: str) -> str:
    """
    Main entry point for extracting text from resume files.
    """
    logging.info(f"Extracting text for file: {filename}")
    filename = filename.lower()

    if filename.endswith(".pdf"):
        return _extract_from_pdf(file_content)
    elif filename.endswith(".docx"):
        return _extract_from_docx(file_content)
    else:
        raise ValueError("Unsupported file format. Only PDF and DOCX are supported.")

def _extract_from_pdf(file_content: bytes) -> str:
    """
    Extracts text from PDF. Falls back to OCR if little to no text is found.
    """
    text = ""
    try:
        with fitz.open(stream=file_content, filetype="pdf") as doc:
            for page in doc:
                text += page.get_text()
    except Exception as e:
        logger.error(f"Error reading PDF with PyMuPDF: {e}")
    
    # Check if text extraction was successful or if it's a scanned PDF
    if len(text.strip()) < 50:  # Threshold for "scanned" document
        logger.info("Minimal text detected. Attempting OCR...")
        return _perform_ocr(file_content)
    
    return text

def _extract_from_docx(file_content: bytes) -> str:
    """
    Extracts text from DOCX files.
    """
    text = ""
    try:
        # python-docx requires a file-like object
        file_stream = io.BytesIO(file_content)
        doc = Document(file_stream)
        for para in doc.paragraphs:
            text += para.text + "\n"
    except Exception as e:
        logger.error(f"Error reading DOCX: {e}")
        raise ValueError("Failed to process DOCX file")
    
    return text

def _perform_ocr(file_content: bytes) -> str:
    """
    Converts PDF pages to images and runs Tesseract OCR.
    """
    text = ""
    try:
        # Convert PDF to images
        images = convert_from_bytes(file_content)
        
        for i, image in enumerate(images):
            # Run pytesseract on each page image
            page_text = pytesseract.image_to_string(image)
            text += page_text + "\n"
            
    except Exception as e:
        logger.error(f"OCR failed: {e}")
        return " [Error: OCR failed. Ensure Tesseract and Poppler are installed.] "
        
    return text

# --- PARSER ---
OLLAMA_API_URL = "http://localhost:11434/api/generate"
OLLAMA_MODEL = "llama3.2" # Using 3B model for better performance/memory fit

def extract_sections(text: str) -> dict:
    """
    Uses Ollama (AI) to parse resume text into structured sections.
    """
    # Fallback structure
    default_sections = {
        "Skills": "",
        "Education": "",
        "Experience": "",
        "Projects": "",
        "Other": ""
    }
    
    # Prompt engineering to enforce the user's constraints
    prompt = f"""
    You are a Resume Parsing Assistant. Extract information from the following resume text into a strict JSON format.
    
    Rules:
    1. "Skills": Must strictly contain only technical skills (e.g., Python, Java, Docker), separated by commas. Do not include soft skills.
    2. "Education": Must contain only education details (Degree, University, Year).
    3. "Experience": Summarize work history (Role, Company, Year, Key achievements).
    4. "Projects": Summarize key projects.
    5. "Other": Any certifications or awards.
    
    Return ONLY valid JSON. No markdown, no preambles.
    Structure: {{ "Skills": "...", "Education": "...", "Experience": "...", "Projects": "...", "Other": "..." }}
    
    Resume Text:
    {text}
    """
    
    try:
        payload = {
            "model": OLLAMA_MODEL,
            "prompt": prompt,
            "stream": False,
            "format": "json" 
        }
        
        logger.info(f"Sending request to Ollama ({OLLAMA_MODEL})...")
        response = requests.post(OLLAMA_API_URL, json=payload, timeout=60)
        
        if response.status_code == 200:
            result = response.json()
            generated_text = result.get("response", "")
            
            # Attempt to parse JSON
            try:
                # Cleanup potential markdown ticks if model adds them
                cleaned_json = generated_text.replace("```json", "").replace("```", "").strip()
                data = json.loads(cleaned_json)
                
                # Merge with default to ensure all keys exist
                return {**default_sections, **data}
            except json.JSONDecodeError:
                logger.error("Failed to parse AI JSON response. Returning raw text in 'Other'.")
                return {**default_sections, "Other": generated_text}
        else:
            logger.error(f"Ollama API Error: {response.status_code} - {response.text}")
            return {**default_sections, "Other": f"AI Parsing Failed. API Status: {response.status_code}. Response: {response.text}"}

    except Exception as e:
        logger.error(f"Ollama Connection Error: {e}")
        return {**default_sections, "Other": f"AI Service Unavailable: {str(e)}"}

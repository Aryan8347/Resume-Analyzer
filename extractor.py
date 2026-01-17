import io
import logging
import fitz  # PyMuPDF
import pytesseract
from pdf2image import convert_from_bytes
from docx import Document
from PIL import Image

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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
        # If this fails, it might be missing poppler or tesseract binary
        return " [Error: OCR failed. Ensure Tesseract and Poppler are installed.] "
        
    return text

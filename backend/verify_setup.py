import sys
import unittest

def check_imports():
    print("Checking dependencies...")
    missing = []
    
    try: import fastapi; print("fastapi: OK")
    except ImportError: missing.append("fastapi")
    
    try: import uvicorn; print("uvicorn: OK")
    except ImportError: missing.append("uvicorn")
    
    try: import fitz; print("pymupdf (fitz): OK")
    except ImportError: missing.append("pymupdf")
    
    try: import docx; print("python-docx: OK")
    except ImportError: missing.append("python-docx")
    
    try: import pytesseract; print("pytesseract: OK")
    except ImportError: missing.append("pytesseract")

    try: import pdf2image; print("pdf2image: OK")
    except ImportError: missing.append("pdf2image")

    if missing:
        print(f"\n[WARNING] Missing packages: {', '.join(missing)}")
        print("Run: pip install -r requirements.txt")
    else:
        print("\nAll dependencies match standard imports (Note: runtime binaries like Tesseract/Poppler must also be installed).")

class TestCleaner(unittest.TestCase):
    def test_basic_clean(self):
        sys.path.append('.')
        from cleaner import clean_text
        self.assertEqual(clean_text("  Hello   World  "), "hello world")
        self.assertEqual(clean_text("Mixed CASE"), "mixed case")
        self.assertEqual(clean_text(""), "")
        print("\nCleaner tests passed.")

if __name__ == "__main__":
    check_imports()
    # verify cleaner can be imported and run even if others are missing (cleaner has no deps)
    try:
        suite = unittest.TestLoader().loadTestsFromTestCase(TestCleaner)
        unittest.TextTestRunner(verbosity=0).run(suite)
    except Exception as e:
        print(f"Cleaner test failed: {e}")

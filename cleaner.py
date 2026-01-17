import re

def clean_text(text: str) -> str:
    """
    Cleans the extracted text by removing extra spaces and normalizing case.
    """
    if not text:
        return ""

    # Replace multiple whitespace characters (including newlines if desired, 
    # but initially we typically want to preserve structure, 
    # though the prompt said 'Remove extra spaces'). 
    # We will replace multiple spaces/tabs with a single space.
    text = re.sub(r'\s+', ' ', text)

    # Strip leading/trailing whitespaces
    text = text.strip()

    # Normalize case (e.g., lower casing everything as requested 'Normalize case')
    # Use lowercase for standard 'normalization' unless Title Case is preferred. 
    # Given the prompt 'Normalize case', typically implies standardizing for NLP or search.
    text = text.lower()

    return text

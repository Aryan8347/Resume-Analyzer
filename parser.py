import logging
import requests
import json
import re

logger = logging.getLogger(__name__)

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

# Alias for backward compatibility if needed, but we replaced the main function.
extract_sections_ai = extract_sections

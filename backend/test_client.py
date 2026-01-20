import requests
import io

# Dummy resume content
resume_text = """
Jane Doe
Senior Developer

SKILLS
Python, JavaScript, React, FastAPI, Docker, Kubernetes

EXPERIENCE
Tech Solutions Inc. - Senior Engineer
2018-Present
- Led migration to microservices
- Improved API performance by 50%

EDUCATION
State University
B.S. Computer Science

PROJECTS
E-commerce Platform
- Built scalable backend using Django
"""

# Create a dummy file in memory (simulating a .txt file or we can save as .pdf if needed, 
# but our extractor handles text if we mocked it, but actually our extractor expects PDF/DOCX bytes.
# Wait, our extractor ONLY handles PDF/DOCX. 
# So I should create a real PDF or DOCX or just mock the file upload with a file that exists.
# OR easier: Create a simple DOCX using python-docx.
from docx import Document

doc = Document()
doc.add_paragraph(resume_text)
bio = io.BytesIO()
doc.save(bio)
bio.seek(0)
file_content = bio.read()

print("Sending request to http://localhost:8000/upload/resume...")
try:
    response = requests.post(
        "http://localhost:8000/upload/resume",
        files={"file": ("resume.docx", file_content, "application/vnd.openxmlformats-officedocument.wordprocessingml.document")}
    )
    
    if response.status_code == 200:
        data = response.json()
        
        # Write to file for checking
        with open("client_output.txt", "w", encoding="utf-8") as f:
            import json
            json.dump(data, f, indent=2)
            
        print("\nRaw JSON Response:", data)
        print("\n--- Response ---")
        print(f"Filename: {data['filename']}")
        # ... rest of print logic
    else:
        with open("client_output.txt", "w", encoding="utf-8") as f:
            f.write(f"Error: {response.status_code} - {response.text}")
        print(f"Error: {response.status_code} - {response.text}")

except Exception as e:
    print(f"Failed to connect: {e}")

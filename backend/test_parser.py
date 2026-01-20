import unittest
from parser import extract_sections

class TestParser(unittest.TestCase):
    def test_extract_sections(self):
        sample_text = """
        John Doe
        Software Engineer
        
        WORK EXPERIENCE
        Tech Corp - Developer
        2020-Present
        
        EDUCATION
        University of Code
        BS Computer Science
        
        SKILLS
        Python, FastAPI, Docker
        
        PROJECTS
        Resume Parser
        """
        
        sections = extract_sections(sample_text)
        
        self.assertIn("Tech Corp - Developer", sections["Experience"])
        self.assertIn("University of Code", sections["Education"])
        self.assertIn("Python, FastAPI, Docker", sections["Skills"])
        self.assertIn("Resume Parser", sections["Projects"])
        print("\nParser tests passed!")
        print(sections)

if __name__ == "__main__":
    unittest.main()

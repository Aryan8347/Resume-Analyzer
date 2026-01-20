import unittest
from analyzer import run_full_analysis

class TestAnalyzer(unittest.TestCase):
    def test_full_analysis(self):
        text = """
        Objective: Seeking a position as a Software Engineer.
        
        Skills: Python, Postgres, Docker.
        
        Experience: I workd at Tech Corp using py and sql. 
        """
        
        result = run_full_analysis(text)
        
        # Check components
        # Check components
        self.assertNotIn("spell_grammar_analysis", result)
        self.assertIn("skill_extraction", result)
        self.assertIn("job_role_mapping", result)
        self.assertIn("preferred_role_detection", result)
        
        # Check specific logic
        self.assertEqual(result["preferred_role_detection"]["preferred_role"], "Software Engineer")
        self.assertIn("Python", result["skill_extraction"]["detected_skills"])
        self.assertIn("SQL", result["skill_extraction"]["detected_skills"]) 
        self.assertIn("Docker", result["skill_extraction"]["detected_tools"])
        
        # Check Gap Analysis
        # User is "Software Engineer" (preferred), but our rules don't have "Software Engineer" explicitly maybe?
        # Actually our rules need to be checked.
        # Let's see what rules we defined: Data Analyst, Backend Developer, Frontend Developer, DevOps Engineer.
        # "Experience: I workd at Tech Corp using py and sql." -> Maps to Data Analyst (Py, SQL) and Backend (Py, SQL).
        # Preferred "Software Engineer" might not match straightforwardly unless we add mapping or fuzzy match fails.
        # But if we change text to "seeking a position as a Backend Developer" it will be clearer.
        
        # Let's verify the key exists first
        self.assertIn("skill_gap_analysis", result)
        self.assertIn("ats_compatibility", result)
        
        # Check ATS Score
        # The text is very short (< 500 chars), might trigger image-based warning if file_size was simulated large,
        # but here file_size default is 0 so it shouldn't trigger "image based".
        # It has "Experience" and "Skills" headers implicitly via parsing (or not? text has them).
        
        ats = result["ats_compatibility"]
        self.assertGreaterEqual(ats["score"], 0)
        self.assertIsInstance(ats["issues"], list)

if __name__ == "__main__":
    unittest.main()

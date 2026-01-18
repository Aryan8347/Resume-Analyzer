import json
import re
from collections import Counter
import logging

logger = logging.getLogger(__name__)

# Load skills configuration
try:
    with open("skills.json", "r") as f:
        SKILLS_DB = json.load(f)
    # Reverse mapping for normalization: "py" -> "Python"
    NORMALIZED_SKILLS = {}
    for canonical, variations in SKILLS_DB.items():
        NORMALIZED_SKILLS[canonical.lower()] = canonical
        for var in variations:
            NORMALIZED_SKILLS[var.lower()] = canonical
except Exception as e:
    logger.error(f"Failed to load skills.json: {e}")
    SKILLS_DB = {}
    NORMALIZED_SKILLS = {}


# Check skills.json for Tools vs Skills
# We will define a set of Tools. 
# Ideally this should be in the JSON but we can hardcode for now based on previous add or infer from keys.
# Let's define it here or load from a new config. 
# Given we just added them to skills.json, we can check based on keynames if we had metadata, 
# but simply checking against a hardcoded list of Tool names is safer for now.

KNOWN_TOOLS = {
    "VS Code", "Git", "GitHub", "GitLab", "JIRA", "Postman", "Jenkins", "IntelliJ IDEA", "Figma", 
    "Docker", "Kubernetes", "AWS", "Linux", "Android Studio", "Visual Studio",
    "Eclipse", "NetBeans", "PyCharm", "WebStorm", "Xcode", "Vim", "Emacs", "Sublime Text", "Atom", "Notepad++",
    "CircleCI", "Travis CI", "GitLab CI", "Azure DevOps", "Ansible", "Terraform", "Puppet", "Chef", "Vagrant", "Nagios", "Prometheus", "Grafana",
    "Azure", "Google Cloud Platform", "Heroku", "DigitalOcean", "Vercel", "Netlify",
    "Maven", "Gradle", "npm", "yarn", "pip", "Homebrew",
    "MongoDB Compass", "pgAdmin", "MySQL Workbench",
    "Adobe XD", "Sketch", "Canva",
    "Slack", "Trello", "Asana", "Zoom", "Microsoft Teams"
}

def extract_skills_normalization(text: str) -> dict:
    """
    Extracts and normalizes skills from text based on skills.json.
    Separates into 'detected_skills' and 'detected_tools'.
    """
    detected_all = set()
    
    # Simple tokenization for matching
    # We match lowercased tokens against our normalized map
    tokens = re.findall(r'\b[\w\.\+\#]+\b', text.lower())
    
    for token in tokens:
        if token in NORMALIZED_SKILLS:
            detected_all.add(NORMALIZED_SKILLS[token])
            
    detected_skills = []
    detected_tools = []
    
    for item in detected_all:
        if item in KNOWN_TOOLS:
            detected_tools.append(item)
        else:
            detected_skills.append(item)
            
    return {
        "detected_skills": detected_skills,
        "detected_tools": detected_tools
    }

# Define rules (exposed for gap analysis)
JOB_ROLE_RULES = {
    "Data Analyst": {"Python", "SQL", "Pandas", "Excel"},
    "Backend Developer": {"Python", "Java", "Go", "Node.js", "FastAPI", "Django", "SQL", "Docker"},
    "Frontend Developer": {"JavaScript", "React", "TypeScript", "HTML", "CSS"},
    "DevOps Engineer": {"Docker", "Kubernetes", "AWS", "Linux", "Python"},
}

def map_job_roles(detected_skills: list) -> dict:
    """
    Maps detected skills to potential job roles.
    """
    skills_set = set(detected_skills)
    roles_score = Counter()
    
    for role, required_skills in JOB_ROLE_RULES.items():
        # Count how many skills match
        match_count = len(skills_set.intersection(required_skills))
        if match_count > 0:
            roles_score[role] = match_count
            
    # Normalize scores or just return recommended based on threshold
    recommended = [role for role, score in roles_score.most_common(3)]
    
    return {
        "recommended_roles": recommended
    }

def detect_preferred_role(text: str) -> dict:
    """
    Attempts to extract preferred role from Objective or Summary sections using heuristics.
    """
    # Look for patterns like "seeking a position as a X" or "experienced X" near the top
    # checks first 500 chars usually
    header_text = text[:1000].lower()
    
    patterns = [
        r"seeking\s+a\s+position\s+as\s+a\s+([\w\s]+)",
        r"looking\s+for\s+roles\s+in\s+([\w\s]+)",
        r"objective\s*:\s*([\w\s]+)",
    ]
    
    possible_role = "Not specified"
    
    for pattern in patterns:
        match = re.search(pattern, header_text)
        if match:
            # excessive cleaning might be needed
            raw_role = match.group(1).split('.')[0].split(',')[0].strip()
            if len(raw_role) < 50: # Sanity check for length
                possible_role = raw_role.title()
                break
                
    return {
        "preferred_role": possible_role
    }

def analyze_skill_gap(detected_skills: list, preferred_role: str, recommended_roles: list) -> dict:
    """
    Identifies missing skills for the preferred or best recommended role.
    """
    target_role = None
    
    # 1. Try preferred role (fuzzy match against our rules keys)
    if preferred_role and preferred_role != "Not specified":
        for role in JOB_ROLE_RULES.keys():
            if role.lower() in preferred_role.lower() or preferred_role.lower() in role.lower():
                target_role = role
                break
    
    # 2. Fallback to top recommended role
    if not target_role and recommended_roles:
        target_role = recommended_roles[0]
        
    missing_skills = []
    if target_role and target_role in JOB_ROLE_RULES:
        required = JOB_ROLE_RULES[target_role]
        detected_set = set(detected_skills)
        missing_skills = list(required - detected_set)
        
    return {
        "target_role": target_role if target_role else "Unknown",
        "missing_skills": missing_skills
    }

def run_full_analysis(text: str) -> dict:
    """
    Orchestrates the full analysis pipeline.
    """
    # Spell check removed as requested
    
    skills_data = extract_skills_normalization(text)
    # Merge skills and tools for Role Mapping? 
    # Usually roles depend on both (e.g. DevOps needs Docker). 
    # So we combine them for mapping but show separated in output.
    all_detected_items = skills_data["detected_skills"] + skills_data["detected_tools"]
    
    roles = map_job_roles(all_detected_items)
    
    pref_role_data = detect_preferred_role(text)
    preferred_role = pref_role_data["preferred_role"]
    recommended = roles["recommended_roles"]
    
    skill_gap = analyze_skill_gap(all_detected_items, preferred_role, recommended)
    
    return {
        "skill_extraction": skills_data,
        "job_role_mapping": roles,
        "preferred_role_detection": pref_role_data,
        "skill_gap_analysis": skill_gap
    }

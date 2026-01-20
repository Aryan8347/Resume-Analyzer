import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, Share2, Briefcase, Zap, AlertTriangle, CheckCircle, ChevronLeft } from 'lucide-react';

// Mock Data Fallback
const MOCK_DATA = {
    filename: "Demo_Res_V4.pdf",
    analysis: {
        ats_compatibility: {
            score: 72,
            issues: ["Missing 'Experience' header", "Low keyword density", "Special characters detected"],
            recommendations: ["Rename 'Work History' to 'Experience'", "Add more tech skills", "Remove icons from bullet points"]
        },
        skill_extraction: {
            detected_skills: ["Python", "JavaScript", "React", "Node.js", "SQL", "HTML", "CSS"],
            detected_tools: ["Git", "VS Code", "Docker", "Postman"]
        },
        job_role_mapping: {
            recommended_roles: [
                { role: "Frontend Developer", match_percentage: 85, matched_skills: ["React", "JavaScript", "HTML", "CSS"] },
                { role: "Full Stack Developer", match_percentage: 65, matched_skills: ["Node.js", "Python", "SQL"] }
            ]
        },
        preferred_role_detection: {
            preferred_role: "Frontend Developer"
        },
        skill_gap_analysis: {
            missing_skills: ["TypeScript", "Redux", "Testing Library"]
        }
    }
};

const Dashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (location.state?.data) {
            setData(location.state.data);
        } else {
            setData(MOCK_DATA);
        }

        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [location.state]);

    if (!data) return <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center font-mono">INITIALIZING_DASHBOARD...</div>;

    const { analysis, filename } = data;

    return (
        <div className="relative min-h-screen bg-[#0a0a0a] text-[#ededed] font-sans selection:bg-neon-pink selection:text-white p-6 md:p-12 overflow-x-hidden">

            {/* --- BACKGROUND --- */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none fixed" />
            <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-300 fixed"
                style={{
                    background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(104, 82, 253, 0.08), transparent 80%)`
                }}
            />

            {/* --- HEADER --- */}
            <header className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b border-[#222] pb-6">
                <div>
                    <button onClick={() => navigate('/upload')} className="flex items-center text-[#666] hover:text-white transition-colors mb-2 font-mono text-xs">
                        <ChevronLeft size={12} /> BACK_TO_UPLOAD
                    </button>
                    <h1 className="text-3xl font-mono font-bold tracking-tighter">ANALYSIS_REPORT // <span className="text-neon-pink">{filename}</span></h1>
                </div>
                <div className="flex gap-4 mt-4 md:mt-0">
                    <button className="px-4 py-2 border border-[#333] rounded-full text-xs font-mono hover:bg-[#131313] transition-colors flex items-center gap-2">
                        <Share2 size={14} /> SHARE
                    </button>
                    <button className="px-4 py-2 bg-[#ededed] text-black rounded-full text-xs font-mono font-bold hover:bg-neon-pink hover:text-white transition-colors flex items-center gap-2">
                        <Download size={14} /> EXPORT_PDF
                    </button>
                </div>
            </header>

            {/* --- DASHBOARD GRID --- */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6">

                {/* Left Col: Stats & Skills */}
                <div className="md:col-span-4 space-y-6">

                    {/* ATS Score Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="p-6 bg-[#131313] border border-[#333] rounded-3xl"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-mono text-[#a1a1a1] text-xs">ATS_COMPATIBILITY_SCORE</h3>
                            <Zap className="text-neon-pink" size={16} />
                        </div>
                        <div className="flex items-end gap-2">
                            <span className="text-6xl font-mono font-bold">{analysis.ats_compatibility?.score || 0}</span>
                            <span className="text-[#666] font-mono text-xl mb-2">/100</span>
                        </div>
                        <div className="w-full h-1 bg-[#222] rounded-full mt-4 overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${analysis.ats_compatibility?.score}%` }}
                                transition={{ duration: 1 }}
                                className="h-full bg-neon-pink"
                            />
                        </div>
                    </motion.div>

                    {/* Findings List */}
                    <div className="p-6 bg-[#131313] border border-[#333] rounded-3xl">
                        <h3 className="font-mono text-[#a1a1a1] text-xs mb-4">OPTIMIZATION_LOGS</h3>
                        <div className="space-y-3">
                            {(analysis.ats_compatibility?.issues || []).map((issue, i) => (
                                <div key={i} className="flex items-start gap-3 text-sm text-[#ededed]">
                                    <AlertTriangle className="text-yellow-500 shrink-0 mt-0.5" size={14} />
                                    <span>{issue}</span>
                                </div>
                            ))}
                            {(analysis.ats_compatibility?.recommendations || []).map((rec, i) => (
                                <div key={'rec' + i} className="flex items-start gap-3 text-sm text-[#a1a1a1]">
                                    <CheckCircle className="text-neon-purple shrink-0 mt-0.5" size={14} />
                                    <span>{rec}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Middle Col: Skill Matrix (Replaces 3D Sphere) */}
                <div className="md:col-span-4 min-h-[400px] bg-[#0f0f0f] border border-[#333] rounded-3xl relative overflow-hidden flex flex-col p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-mono text-[#a1a1a1] text-xs">DETECTED_SKILL_MATRIX</h3>
                        <div className="flex gap-1">
                            <span className="w-1.5 h-1.5 bg-neon-pink rounded-full animate-pulse" />
                            <span className="w-1.5 h-1.5 bg-neon-purple rounded-full animate-pulse delay-75" />
                            <span className="w-1.5 h-1.5 bg-neon-blue rounded-full animate-pulse delay-150" />
                        </div>
                    </div>

                    <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
                        <div className="grid grid-cols-2 gap-3">
                            {(analysis.skill_extraction.detected_skills || []).map((skill, idx) => (
                                <div key={idx} className="group relative bg-[#0a0a0a] border border-[#222] hover:border-neon-pink/50 rounded-xl p-3 transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,7,254,0.1)]">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out" />

                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-mono text-xs text-[#ededed] font-bold truncate">{skill}</span>
                                        <div className="flex gap-0.5">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className={`w-0.5 h-2 rounded-full ${i <= 2 ? 'bg-neon-pink' : 'bg-[#333]'}`} />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="text-[10px] text-[#666] font-mono">SIGNAL_STRONG</div>
                                </div>
                            ))}
                            {(analysis.skill_extraction.detected_skills || []).length === 0 && (
                                <div className="col-span-2 text-center text-[#666] font-mono text-xs py-10">
                                    NO_DATA_STREAM_FOUND
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-[#222] flex justify-between items-center">
                        <span className="font-mono text-[10px] text-[#444]">TOTAL_NODES: {(analysis.skill_extraction.detected_skills || []).length}</span>
                        <span className="font-mono text-[10px] text-neon-pink animate-pulse">LIVE_FEED</span>
                    </div>
                </div>

                {/* Right Col: Roles & Gaps */}
                <div className="md:col-span-4 space-y-6">

                    {/* Recommended Roles */}
                    <div className="p-6 bg-[#131313] border border-[#333] rounded-3xl">
                        <h3 className="font-mono text-[#a1a1a1] text-xs mb-4">DETECTED_CAREER_PATHS</h3>
                        <div className="space-y-4">
                            {(analysis.job_role_mapping.recommended_roles || []).map((role, idx) => (
                                <div key={idx} className="group p-4 border border-[#222] rounded-2xl hover:border-neon-purple transition-all bg-[#0a0a0a]">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-bold text-sm tracking-tight">{role.role}</span>
                                        <span className="font-mono text-neon-purple text-xs">{role.match_percentage}% MATCH</span>
                                    </div>
                                    <div className="w-full h-1 bg-[#222] rounded-full mb-3">
                                        <div className="h-full bg-neon-purple rounded-full" style={{ width: `${role.match_percentage}%` }}></div>
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {(role.matched_skills || []).slice(0, 3).map((s, i) => (
                                            <span key={i} className="text-[10px] px-2 py-0.5 border border-[#333] rounded-full text-[#888]">{s}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Skill Gaps */}
                    <div className="p-6 bg-[#131313] border border-[#333] rounded-3xl">
                        <h3 className="font-mono text-[#a1a1a1] text-xs mb-4">CRITICAL_MISSING_SKILLS</h3>
                        <div className="flex flex-wrap gap-2">
                            {(analysis.skill_gap_analysis.missing_skills || []).map((skill, i) => (
                                <span key={i} className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg font-mono">
                                    !_MISSING: {skill}
                                </span>
                            ))}
                            {(analysis.skill_gap_analysis.missing_skills || []).length === 0 && (
                                <span className="text-[#666] text-sm">No critical gaps detected. System optimal.</span>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Dashboard;

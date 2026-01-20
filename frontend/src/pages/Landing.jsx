import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, CheckCircle, BarChart2, Zap, ArrowRight, Shield, Cpu, Layers, Disc } from 'lucide-react';

const Landing = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({
                x: e.clientX,
                y: e.clientY,
            });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <div className="relative min-h-screen bg-[#0a0a0a] text-[#ededed] font-sans selection:bg-[#ff07fe] selection:text-white overflow-hidden">

            {/* --- GRID BACKGROUND --- */}
            {/* Subtle light grey grid lines on dark background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

            {/* --- MOUSE SPOTLIGHT --- */}
            <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-0"
                style={{
                    background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(104, 82, 253, 0.15), transparent 80%)`
                }}
            />

            {/* --- NAVIGATION --- */}
            <nav className="relative z-50 flex justify-between items-center p-6 md:px-12">
                <div className="text-xl font-mono font-bold tracking-tighter hover:text-neon-pink transition-colors cursor-pointer">
                    RESUME_ANALYZER <span className="text-neon-pink animate-pulse">●</span>
                </div>
                <Link to="/login" className="px-6 py-2 rounded-full border border-[#333] hover:border-neon-pink bg-[#0a0a0a] text-sm font-mono transition-all hover:shadow-[0_0_15px_rgba(255,7,254,0.4)] text-[#ededed]">
                    LOGIN / REGISTER
                </Link>
            </nav>

            {/* --- HERO SECTION --- */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">

                {/* Floating 3D-ish Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8 px-4 py-1.5 rounded-full bg-[#131313] border border-[#333] text-xs font-mono text-[#a1a1a1] flex items-center gap-2"
                >
                    <span className="w-2 h-2 rounded-full bg-neon-pink animate-pulse" />
                    SYSTEM OPERATIONAL
                </motion.div>

                {/* Main Headline - Space Mono */}
                <motion.h1
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "circOut" }}
                    className="text-5xl md:text-8xl font-mono font-bold tracking-tight mb-8 leading-none"
                >
                    RESUME <br /> INTELLIGENCE
                </motion.h1>

                {/* Subtext - Anek Latin */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-lg md:text-xl text-[#a1a1a1] max-w-xl mb-12 leading-relaxed"
                >
                    Analyze compatibility. Detect skill gaps. Optimize for ATS.
                    <br />
                    <span className="text-neon-pink">Precision engineering</span> for your career path.
                </motion.p>

                {/* CTAs - Pill Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col sm:flex-row gap-6"
                >
                    <Link to="/upload" className="group px-8 py-4 rounded-full bg-[#ededed] text-black font-mono font-bold hover:bg-neon-pink hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,7,254,0.6)]">
                         Start Analysis ->
                    </Link>
                </motion.div>
            </div>

            {/* --- FEATURE STRIP --- */}
            <div className="relative z-10 w-full bg-[#0a0a0a] border-t border-[#222] py-20">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
                    {[
                        { title: "ATS SHIELD", desc: "Pre-validate against enterprise scanning systems.", color: "text-neon-pink" },
                        { title: "SKILL MATRIX", desc: "Nuanced mapping of your skills to high-demand roles.", color: "text-neon-purple" },
                        { title: "GAP ANALYSIS", desc: "Identify what sets you apart from the top 1%.", color: "text-neon-blue" }
                    ].map((item, idx) => (
                        <div key={idx} className="group cursor-default">
                            <div className={`font-mono text-sm mb-4 ${item.color}`}>0{idx + 1} //</div>
                            <h3 className="font-mono text-2xl font-bold mb-4 group-hover:text-white transition-colors">{item.title}</h3>
                            <p className="text-[#a1a1a1] leading-relaxed group-hover:text-[#ededed] transition-colors">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- FOOTER --- */}
            <footer className="relative z-10 py-12 border-t border-[#222] bg-[#0a0a0a] text-center">
                {/* Footer content removed per request */}
            </footer>

        </div>
    );
};

export default Landing;

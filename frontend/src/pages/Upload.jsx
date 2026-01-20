import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileText, Loader, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';
import client from '../api/client';

const Upload = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
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

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        validateAndSetFile(selected);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const selected = e.dataTransfer.files[0];
        validateAndSetFile(selected);
    };

    const validateAndSetFile = (selected) => {
        if (selected && (selected.type === "application/pdf" || selected.type.includes("document"))) {
            setFile(selected);
            setError(null);
        } else {
            setError("ERR: INVALID_FILE_TYPE // PDF_OR_DOCX_ONLY");
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await client.post('/upload/resume', formData);
            navigate('/dashboard', { state: { data: response.data } });
        } catch (err) {
            console.error(err);
            setError("ERR: SERVER_CONNECTION_FAILED");
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center p-6 bg-[#0a0a0a] text-[#ededed] font-sans overflow-hidden selection:bg-neon-pink selection:text-white">

            {/* --- GRID BACKGROUND --- */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

            {/* --- MOUSE SPOTLIGHT --- */}
            <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                style={{
                    background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(104, 82, 253, 0.1), transparent 80%)`
                }}
            />

            <div className="relative z-10 w-full max-w-2xl">

                {/* Header */}
                <div className="mb-10 text-center">
                    <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full border border-[#333] bg-[#0f0f0f] text-xs font-mono text-[#a1a1a1]">
                        <span className="w-2 h-2 rounded-full bg-neon-pink animate-pulse" />
                        AWAITING_INPUT
                    </div>
                    <h1 className="text-4xl md:text-5xl font-mono font-bold tracking-tighter mb-2">
                        UPLOAD_RESUME
                    </h1>
                    <p className="text-[#a1a1a1] font-mono text-sm max-w-md mx-auto">
                        Initiate analysis sequence. Supported formats: .PDF, .DOCX
                    </p>
                </div>

                {/* Drop Zone */}
                <motion.div
                    whileHover={{ scale: 1.01, borderColor: "rgba(255, 7, 254, 0.5)" }}
                    whileTap={{ scale: 0.99 }}
                    className={`relative group border-2 border-dashed rounded-3xl p-16 transition-all cursor-pointer overflow-hidden
                        ${file
                            ? 'border-neon-pink bg-neon-pink/5'
                            : 'border-[#333] hover:border-[#666] bg-[#131313]'
                        }`}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('fileInput').click()}
                >
                    <input
                        type="file"
                        id="fileInput"
                        className="hidden"
                        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        onChange={handleFileChange}
                    />

                    <div className="flex flex-col items-center justify-center relative z-10">
                        <AnimatePresence mode='wait'>
                            {file ? (
                                <motion.div
                                    key="file"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="text-center"
                                >
                                    <div className="w-20 h-20 rounded-2xl bg-[#0a0a0a] border border-neon-pink flex items-center justify-center mb-6 mx-auto shadow-[0_0_15px_rgba(255,7,254,0.2)]">
                                        <FileText className="w-10 h-10 text-neon-pink" />
                                    </div>
                                    <p className="text-xl font-mono font-bold">{file.name}</p>
                                    <p className="text-sm text-[#a1a1a1] mt-1 font-mono">
                                        SIZE: {(file.size / 1024 / 1024).toFixed(2)} MB // READY
                                    </p>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-center"
                                >
                                    <div className="w-20 h-20 rounded-2xl bg-[#0a0a0a] border border-[#333] group-hover:border-neon-pink/50 flex items-center justify-center mb-6 mx-auto transition-colors">
                                        <UploadCloud className="w-10 h-10 text-[#666] group-hover:text-neon-pink transition-colors" />
                                    </div>
                                    <p className="text-lg font-bold">DROP FILE HERE</p>
                                    <p className="text-sm text-[#666] mt-2 font-mono group-hover:text-[#a1a1a1] transition-colors">
                                        or click to browse local drive
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* Error Display */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3 text-red-400 font-mono text-sm overflow-hidden"
                        >
                            <AlertCircle size={18} />
                            <span>{error}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Action Button */}
                <div className="mt-8 flex justify-center">
                    <button
                        onClick={handleUpload}
                        disabled={!file || loading}
                        className={`group relative px-10 py-4 rounded-full font-mono font-bold text-lg transition-all duration-300
                            ${!file || loading
                                ? 'bg-[#1a1a1a] text-[#444] border border-[#333] cursor-not-allowed'
                                : 'bg-[#ededed] text-black hover:bg-neon-pink hover:text-white hover:shadow-[0_0_20px_rgba(255,7,254,0.5)]'
                            }`}
                    >
                        <span className="flex items-center gap-3">
                            {loading ? "PROCESSING..." : "INITIATE_ANALYSIS"}
                            {!loading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                        </span>

                        {loading && (
                            <div className="absolute bottom-0 left-0 h-1 bg-neon-pink transition-all duration-[2000ms] w-full animate-pulse" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Upload;

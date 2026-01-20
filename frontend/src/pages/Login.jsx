import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, User, ArrowRight, ChevronLeft, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import client from '../api/client';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const navigate = useNavigate();

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            let response;
            if (isLogin) {
                // Login expects FormData for username/password (OAuth2 standard)
                const formData = new URLSearchParams();
                formData.append('username', email); // map email to username
                formData.append('password', password);

                response = await client.post('/login', formData, {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                });
            } else {
                // Register expects JSON
                response = await client.post('/register', {
                    email,
                    password
                });
            }

            // Success: Store token and redirect
            localStorage.setItem('token', response.data.access_token);
            navigate('/upload');

        } catch (err) {
            console.error(err);
            if (err.response && err.response.data && err.response.data.detail) {
                const detail = err.response.data.detail;
                if (Array.isArray(detail)) {
                    // Pydantic validation error
                    setError(detail.map(e => e.msg).join(' // '));
                } else {
                    // Standard HTTPException string
                    setError(detail);
                }
            } else {
                setError("CONNECTION_LOST // SERVER_UNREACHABLE");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-[#0a0a0a] text-[#ededed] font-sans selection:bg-neon-pink selection:text-white overflow-hidden p-6">

            {/* --- BACKGROUND --- */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
            <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                style={{
                    background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(104, 82, 253, 0.1), transparent 80%)`
                }}
            />

            {/* --- AUTH CARD --- */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 w-full max-w-md bg-[#131313] border border-[#333] rounded-3xl p-8 md:p-12 shadow-2xl"
            >
                {/* Back Button */}
                <Link to="/" className="absolute top-6 left-6 text-[#666] hover:text-white transition-colors">
                    <ChevronLeft size={20} />
                </Link>

                <div className="text-center mb-10">
                    <h2 className="text-3xl font-mono font-bold mb-2">
                        {isLogin ? 'SYSTEM_ACCESS' : 'NEW_PROFILING'}
                    </h2>
                    <p className="text-[#a1a1a1] text-sm font-mono">
                        {isLogin ? 'Enter credentials to proceed.' : 'Initialize new user sequence.'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Error Message */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400 font-mono text-xs"
                            >
                                <AlertCircle size={14} />
                                <span>{error}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence mode="popLayout">
                        {!isLogin && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-2"
                            >
                                <label className="text-xs font-mono text-[#666] uppercase">Identity Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#444]" size={18} />
                                    <input
                                        type="text"
                                        className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-neon-pink transition-colors font-mono text-sm"
                                        placeholder="JOHN_DOE"
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="space-y-2">
                        <label className="text-xs font-mono text-[#666] uppercase">Secure Mail</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#444]" size={18} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-neon-pink transition-colors font-mono text-sm"
                                placeholder="USER@DOMAIN.COM"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-mono text-[#666] uppercase">Access Key</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#444]" size={18} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-neon-pink transition-colors font-mono text-sm"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full font-mono font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group
                            ${loading
                                ? 'bg-[#333] text-[#666] cursor-wait'
                                : 'bg-[#ededed] text-black hover:bg-neon-pink hover:text-white'
                            }`}
                    >
                        {loading ? 'PROCESSING...' : (isLogin ? 'AUTHENTICATE' : 'INITIATE_SEQUENCE')}
                        {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                    </button>

                </form>

                <div className="mt-8 text-center">
                    <p className="text-[#666] text-sm font-mono">
                        {isLogin ? "No access key? " : "Already verified? "}
                        <button
                            onClick={() => { setIsLogin(!isLogin); setError(''); }}
                            className="text-neon-pink hover:text-white transition-colors underline decoration-dotted underline-offset-4"
                        >
                            {isLogin ? "Request Access // Register" : "System Login"}
                        </button>
                    </p>
                </div>

            </motion.div>
        </div>
    );
};

export default Login;

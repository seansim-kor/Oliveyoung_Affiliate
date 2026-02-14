import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BLOG_POSTS } from '../content/blogPosts';
import { ChevronRight, Calendar, User, Clock, ArrowLeft, Sparkles } from 'lucide-react';
import { Footer } from '../components/Footer';

export const BlogList: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-rose-500/30">
            {/* Search Engine Optimization: Hidden H1 for crawler */}
            <h1 className="sr-only">K-Beauty Mirror Official Blog - Latest Skincare Trends & AI Analysis</h1>

            {/* Hero Header */}
            <header className="relative py-20 px-6 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 via-rose-500/10 to-violet-600/10 pointer-events-none"></div>
                <div className="max-w-4xl mx-auto relative z-10">
                    <Link to="/" className="inline-flex items-center gap-2 text-rose-400 font-bold mb-8 hover:text-rose-300 transition-colors group">
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        BACK TO AI MIRROR
                    </Link>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-tr from-pink-500 to-orange-500 rounded-2xl flex items-center justify-center text-white rotate-3 shadow-lg shadow-rose-500/20">
                            <Sparkles size={24} fill="white" />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic">
                            K-BEAUTY <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-500 underline decoration-rose-500/30">INSIGHTS</span>
                        </h2>
                    </div>
                    <p className="text-slate-400 text-lg max-w-2xl font-medium leading-relaxed">
                        Exploring the intersection of Korean beauty traditions and futuristic AI technology. Your expert guide to the perfect prescription.
                    </p>
                </div>
            </header>

            {/* Blog Feed */}
            <main className="max-w-4xl mx-auto px-6 pb-32">
                <div className="grid gap-8">
                    {BLOG_POSTS.map((post, index) => (
                        <Link
                            key={post.id}
                            to={`/blog/${post.id}`}
                            className="group block relative overflow-hidden bg-white/5 border border-white/10 rounded-[2.5rem] hover:bg-white/[0.08] hover:border-white/20 transition-all duration-500"
                        >
                            <article className="flex flex-col md:flex-row gap-6 p-6 md:p-8">
                                {/* Image Container */}
                                <div className="w-full md:w-64 h-48 md:h-auto shrink-0 rounded-3xl overflow-hidden relative">
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full border border-white/10 uppercase tracking-widest">
                                            {post.category}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex flex-col flex-grow">
                                    <div className="flex items-center gap-4 text-slate-500 text-[11px] font-bold uppercase tracking-widest mb-3">
                                        <span className="flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
                                        <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime}</span>
                                    </div>
                                    <h3 className="text-2xl font-black text-white mb-3 group-hover:text-rose-400 transition-colors leading-tight">
                                        {post.title}
                                    </h3>
                                    <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-2">
                                        {post.excerpt}
                                    </p>
                                    <div className="mt-auto flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-orange-400 to-rose-500"></div>
                                            <span className="text-xs font-bold text-slate-300">{post.author}</span>
                                        </div>
                                        <span className="text-rose-500 group-hover:translate-x-2 transition-transform">
                                            <ChevronRight size={24} />
                                        </span>
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>
            </main>

            <Footer language="en" />
        </div>
    );
};

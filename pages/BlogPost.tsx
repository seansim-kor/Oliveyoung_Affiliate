import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { BLOG_POSTS } from '../content/blogPosts';
import { ArrowLeft, Calendar, User, Clock, Share2, Sparkles, ChevronRight } from 'lucide-react';

export const BlogPost: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const post = BLOG_POSTS.find(p => p.id === id);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!post) {
            navigate('/blog');
        }
    }, [post, navigate]);

    if (!post) return null;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-rose-500/30">
            {/* Search Engine Optimization: Dynamic Meta Tags would go here in SSR, 
          for SPA we use semantic HTML for crawler appreciation */}

            {/* Top Nav */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-bottom border-white/5 py-4 px-6">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <Link to="/blog" className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-white transition-colors">
                        <ArrowLeft size={16} /> BACK TO BLOG
                    </Link>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-tr from-rose-500 to-orange-500 rounded-xl flex items-center justify-center text-white scale-75">
                            <Sparkles size={18} fill="white" />
                        </div>
                        <span className="text-white font-black text-sm italic tracking-tight hidden md:block">K-BEAUTY MIRROR</span>
                    </div>
                    <button className="text-slate-400 hover:text-white transition-colors">
                        <Share2 size={18} />
                    </button>
                </div>
            </nav>

            {/* Article Header */}
            <header className="pt-32 pb-16 px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="inline-block bg-rose-500/10 text-rose-500 text-[10px] font-black px-4 py-1 rounded-full border border-rose-500/20 uppercase tracking-widest mb-6">
                        {post.category}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white leading-[1.1] tracking-tighter uppercase mb-8">
                        {post.title}
                    </h1>
                    <div className="flex items-center justify-center gap-6 text-slate-500 text-xs font-bold uppercase tracking-widest">
                        <span className="flex items-center gap-2"><Calendar size={14} className="text-rose-400" /> {post.date}</span>
                        <span className="flex items-center gap-2"><User size={14} className="text-rose-400" /> {post.author}</span>
                        <span className="flex items-center gap-2"><Clock size={14} className="text-rose-400" /> {post.readTime}</span>
                    </div>
                </div>
            </header>

            {/* Featured Image */}
            <div className="max-w-5xl mx-auto px-6 mb-16">
                <div className="aspect-[21/9] rounded-[3rem] overflow-hidden shadow-2xl ring-1 ring-white/10">
                    <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            {/* Content Body */}
            <main className="max-w-3xl mx-auto px-6 pb-32">
                <article className="prose prose-invert prose-slate max-w-none 
          prose-headings:text-white prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter
          prose-p:text-slate-400 prose-p:leading-relaxed prose-p:text-lg
          prose-strong:text-white prose-strong:font-bold
          prose-a:text-rose-400 hover:prose-a:text-rose-300 transition-colors">
                    <div dangerouslySetInnerHTML={{ __html: post.content }} />
                </article>

                {/* Post Footer/Author Box */}
                <div className="mt-20 p-8 rounded-[2.5rem] bg-white/5 border border-white/10 flex flex-col md:flex-row items-center gap-8">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-orange-400 via-rose-500 to-violet-500 shrink-0 shadow-xl"></div>
                    <div className="text-center md:text-left">
                        <h4 className="text-xl font-black text-white uppercase tracking-tight mb-2">Written by {post.author}</h4>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Expert in K-Beauty technologies and aesthetic dermatology. Dedicated to bringing the latest scientific breakthroughs to your daily skincare routine.
                        </p>
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-16 text-center">
                    <Link to="/" className="inline-flex items-center gap-4 bg-gradient-to-r from-orange-500 to-rose-600 px-10 py-5 rounded-[2rem] text-white font-black uppercase tracking-tight shadow-xl shadow-rose-500/20 hover:scale-105 transition-transform">
                        START YOUR AI SKIN SCAN <ChevronRight size={20} />
                    </Link>
                </div>
            </main>

            {/* Related/Footer */}
            <footer className="border-t border-white/5 py-20 px-6 text-center bg-slate-900/50">
                <p className="text-slate-600 text-xs font-black uppercase tracking-[0.2em]">
                    &copy; 2026 K-BEAUTY MIRROR LABS. THE FUTURE OF SKINCARE.
                </p>
            </footer>
        </div>
    );
};

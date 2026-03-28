import React, { useState } from 'react';
import { FiImage, FiSend, FiChevronLeft, FiAlertCircle } from 'react-icons/fi';
import { useNavigate, useSearchParams } from 'react-router-dom';
import API from '../services/api';

const CreateBlog = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState('');
    const [formData, setFormData] = useState({ 
        title: '', 
        category: '', 
        content: '', 
        image: null 
    });

    const categories = ['Tech', 'Health', 'Education', 'Sports', 'Lifestyle'];

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();

        // Manual Validation to ensure we don't hide the button
        if (!formData.title || !formData.category || !formData.content || !formData.image) {
            alert("Please fill all fields and select an image from your device.");
            return;
        }

        setLoading(true);
        const data = new FormData();
        data.append('title', formData.title);
        data.append('category', formData.category);
        data.append('content', formData.content);
        if (formData.image instanceof File) {
            data.append('image', formData.image);
        }

        try {
            const editId = searchParams.get('edit');
            if (editId) {
                await API.put(`/blogs/${editId}`, data);
            } else {
                await API.post('/blogs', data);
            }
            navigate('/');
        } catch (err) {
            alert(err.response?.data?.errors?.[0] || "Upload Failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-stone-950">
            {/* --- FIXED TOP NAVIGATION --- */}
            <nav className="fixed top-0 w-full z-50 bg-white/90 dark:bg-stone-950/90 backdrop-blur-md border-b p-4">
                <div className="max-w-5xl mx-auto flex justify-between items-center">
                    <button onClick={() => navigate('/')} className="flex items-center gap-2 text-stone-500">
                        <FiChevronLeft /> <span>Back</span>
                    </button>
                    
                    {/* BUTTON 1: TOP RIGHT */}
                    <button 
                        onClick={handleSubmit} 
                        className="px-8 py-2 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-full font-bold shadow-lg hover:scale-105 transition-all"
                    >
                        {loading ? "Publishing..." : "Publish"}
                    </button>
                </div>
            </nav>

            <main className="max-w-3xl mx-auto pt-32 px-6 pb-20">
                {/* IMAGE SELECTOR */}
                <div className="relative h-64 w-full mb-8 bg-stone-100 dark:bg-stone-900 rounded-3xl overflow-hidden flex items-center justify-center border-2 border-dashed border-stone-200 dark:border-stone-800">
                    {preview ? (
                        <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                    ) : (
                        <div className="flex flex-col items-center text-stone-400">
                            <FiImage size={40} />
                            <span className="mt-2 font-bold uppercase text-xs">Select Image from Device</span>
                        </div>
                    )}
                    <input 
                        type="file" 
                        accept="image/*" 
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                        onChange={handleFileChange} 
                    />
                </div>

                {/* FORM FIELDS */}
                <div className="space-y-6">
                    <textarea 
                        placeholder="Blog Title" 
                        className="w-full text-5xl font-bold bg-transparent outline-none dark:text-white resize-none"
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        value={formData.title}
                    />

                    <select 
                        className="w-full md:w-auto p-3 rounded-xl bg-stone-100 dark:bg-stone-800 dark:text-white outline-none"
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        value={formData.category}
                    >
                        <option value="">Select Category</option>
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>

                    <textarea 
                        placeholder="Tell your story..." 
                        className="w-full min-h-[400px] text-xl bg-transparent outline-none dark:text-stone-300 resize-none"
                        onChange={(e) => setFormData({...formData, content: e.target.value})}
                        value={formData.content}
                    />

                    {/* BUTTON 2: LARGE BOTTOM BUTTON */}
                    <div className="pt-10 border-t border-stone-100 dark:border-stone-900">
                        <button 
                            type="button"
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-2xl font-bold text-lg shadow-xl hover:-translate-y-1 transition-all"
                        >
                            <FiSend />
                            <span>{loading ? "Publishing Your Story..." : "Publish Post Now"}</span>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CreateBlog;
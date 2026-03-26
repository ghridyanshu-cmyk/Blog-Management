import BlogCard from "../components/BlogCard";
import { FiTrendingUp, FiArrowRight, FiTarget } from "react-icons/fi";

const blogs = [
  { id: 1, title: "React Tips", category: "Tech", image: "https://picsum.photos/800/400" },
  { id: 2, title: "Healthy Life", category: "Health", image: "https://picsum.photos/800/401" },
  { id: 3, title: "Digital Nomads", category: "Lifestyle", image: "https://picsum.photos/800/402" },
];

export default function Home() {
  return (
    <div className="relative min-h-screen bg-stone-100 dark:bg-stone-950 transition-colors duration-500 overflow-x-hidden">
      
      {/* 1. RESPONSIVE BACKGROUND BLOBS */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Amber Blob - Smaller on mobile */}
        <div className="absolute top-10 left-[-10%] md:top-20 md:left-20 w-48 h-48 md:w-72 md:h-72 bg-amber-200/30 rounded-full blur-3xl animate-pulse"></div>
        {/* Stone/Green Blob - Adjusted position for mobile */}
        <div className="absolute bottom-[-10%] right-[-10%] md:bottom-20 md:right-20 w-64 h-64 md:w-96 md:h-96 bg-stone-300/20 dark:bg-green-500/10 rounded-full blur-3xl"></div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-24 md:pt-32 pb-16">
        
        {/* 2. HERO SECTION - Responsive Height */}
        <section className="mb-10 md:mb-16">
          <div className="relative h-[450px] md:h-[500px] w-full overflow-hidden rounded-[2rem] md:rounded-[3rem] shadow-2xl group cursor-pointer border border-white/20 dark:border-stone-800">
            <img 
              src={blogs[0].image} 
              alt="Featured"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            {/* Dynamic Gradient for better text readability on small screens */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6 md:p-12">
              <div className="flex items-center space-x-2 text-amber-400 mb-3">
                <FiTrendingUp className="animate-bounce" />
                <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">Featured Today</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-serif font-bold text-white max-w-3xl leading-tight">
                {blogs[0].title}: Navigating the Future of {blogs[0].category}
              </h1>
              <button className="mt-6 w-full sm:w-fit flex items-center justify-center space-x-2 bg-white text-black px-8 py-4 rounded-2xl font-bold hover:bg-amber-400 transition-all active:scale-95 shadow-lg">
                <span>Read Story</span>
                <FiArrowRight />
              </button>
            </div>
          </div>
        </section>

        {/* 3. MAIN GRID - Stacked on Mobile, 3-cols on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Left Side: Blog Feed (Order 2 on mobile so sidebar can be on top if desired, or leave as is) */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <div className="flex items-center space-x-4 mb-8">
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-stone-900 dark:text-white">Latest Stories</h2>
              <div className="h-px flex-1 bg-stone-200 dark:bg-stone-800"></div>
            </div>
            
            {/* Blog Cards: 1 col on mobile, 2 on tablet+ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {blogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          </div>

          {/* Right Side: Sidebar (Order 1 on mobile to show goals first) */}
          <aside className="lg:col-span-1 space-y-8 order-1 lg:order-2">
            
            {/* Reading Goal Card - Glass Effect */}
            <div className="p-6 md:p-8 rounded-[2rem] bg-white/60 dark:bg-stone-900/60 backdrop-blur-xl border border-white/20 dark:border-stone-800 shadow-sm transition-transform hover:-translate-y-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-stone-100 dark:bg-stone-800 rounded-lg">
                  <FiTarget className="text-stone-900 dark:text-white" />
                </div>
                <h3 className="font-bold text-lg md:text-xl text-stone-900 dark:text-white">Reading Goal</h3>
              </div>
              <p className="text-stone-500 text-sm mb-6">70% of your weekly goal reached.</p>
              <div className="w-full h-3 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-stone-900 dark:bg-white transition-all duration-1000" 
                  style={{ width: '70%' }}
                ></div>
              </div>
            </div>

            {/* Newsletter Card */}
            <div className="p-8 rounded-[2rem] bg-stone-900 text-white dark:bg-amber-50 dark:text-stone-900 shadow-2xl overflow-hidden relative group">
              <div className="relative z-10">
                <h3 className="font-bold text-xl mb-2">Weekly Summary</h3>
                <p className="text-stone-400 dark:text-stone-600 text-sm leading-relaxed mb-6">
                  Get the most important tech insights delivered to your inbox every Sunday.
                </p>
                <button className="w-full py-4 bg-white dark:bg-stone-900 text-stone-900 dark:text-white rounded-xl font-bold text-sm shadow-xl active:scale-95 transition-transform">
                  Subscribe Now
                </button>
              </div>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 dark:bg-stone-900/5 rounded-full transition-transform group-hover:scale-150 duration-700"></div>
            </div>

          </aside>
        </div>
      </main>
    </div>
  );
}
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle";
import { 
  FiPlusSquare, FiGrid, FiFeather, FiMenu, FiX, 
  FiSearch, FiTrendingUp, FiUser, FiBookmark, FiLogOut
} from "react-icons/fi";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
    window.location.reload();
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] px-4 py-4 md:px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center bg-white/70 dark:bg-stone-900/70 backdrop-blur-xl border border-white/20 dark:border-stone-800 shadow-2xl rounded-[1.5rem] md:rounded-[2.5rem] px-5 py-3 md:px-8 transition-all duration-500">
        
        {/* 1. Left Section: Logo & Primary Links */}
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="h-10 w-10 bg-stone-900 dark:bg-white rounded-xl flex items-center justify-center transition-transform group-hover:rotate-12">
              <FiFeather className="text-white dark:text-stone-900 text-xl" />
            </div>
            <span className="hidden sm:block text-xl font-black tracking-tighter text-stone-900 dark:text-white uppercase">
              Blogify
            </span>
          </Link>

          <div className="hidden lg:flex items-center space-x-6">
            <Link to="/trending" className="flex items-center space-x-1 text-xs font-bold uppercase tracking-widest text-stone-500 hover:text-amber-600 transition-colors">
              <FiTrendingUp />
              <span>Trending</span>
            </Link>
            <Link to="/bookmarks" className="flex items-center space-x-1 text-xs font-bold uppercase tracking-widest text-stone-500 hover:text-blue-500 transition-colors">
              <FiBookmark />
              <span>Saves</span>
            </Link>
          </div>
        </div>

        {/* 2. Middle Section: Dynamic Search Bar */}
        <div className={`hidden md:flex items-center bg-stone-100 dark:bg-stone-800/50 rounded-full px-4 py-2 transition-all ${searchActive ? 'w-64' : 'w-48'}`}>
          <FiSearch className="text-stone-400 mr-2" />
          <input 
            type="text" 
            placeholder="Search blogs..." 
            onFocus={() => setSearchActive(true)}
            onBlur={() => setSearchActive(false)}
            className="bg-transparent border-none outline-none text-sm w-full text-stone-700 dark:text-stone-300 placeholder:text-stone-400"
          />
        </div>

        {/* 3. Right Section: User Actions */}
        <div className="flex items-center space-x-2 md:space-x-6">
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/create" className={`p-2.5 rounded-xl transition-all ${isActive('/create') ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-900' : 'text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800'}`}>
              <FiPlusSquare size={22} />
            </Link>
            <Link to="/admin" className={`p-2.5 rounded-xl transition-all ${isActive('/admin') ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-900' : 'text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800'}`}>
              <FiGrid size={22} />
            </Link>
          </div>

          <div className="h-8 w-px bg-stone-200 dark:bg-stone-800 hidden md:block"></div>
          
          <DarkModeToggle />

          {/* User Profile / Auth Toggle */}
          {user ? (
            <div className="relative group">
              <button className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center border-2 border-white dark:border-stone-700 shadow-lg font-bold text-white text-sm overflow-hidden">
                {user.name?.charAt(0).toUpperCase()}
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-4 border-b border-stone-200 dark:border-stone-800">
                  <p className="text-sm font-bold text-stone-900 dark:text-white">{user.name}</p>
                  <p className="text-xs text-stone-500">{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center space-x-2 text-sm font-semibold text-stone-700 dark:text-stone-300 rounded-b-2xl transition-colors"
                >
                  <FiLogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="h-10 w-10 rounded-full bg-stone-200 dark:bg-stone-800 flex items-center justify-center border-2 border-transparent hover:border-stone-400 transition-all overflow-hidden">
              <FiUser className="text-stone-500" />
            </Link>
          )}

          {/* Mobile Menu Trigger */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-stone-900 dark:text-white">
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* 4. Mobile Overlay (Full Screen Style) */}
      {isOpen && (
        <div className="absolute top-24 left-4 right-4 bg-white/95 dark:bg-stone-900/95 backdrop-blur-2xl rounded-[2.5rem] p-8 shadow-2xl border border-stone-100 dark:border-stone-800 flex flex-col space-y-6 md:hidden animate-in fade-in zoom-in-95 duration-300">
           {user && (
              <div className="p-4 bg-stone-100 dark:bg-stone-800/50 rounded-2xl">
                <p className="text-sm font-bold text-stone-900 dark:text-white">{user.name}</p>
                <p className="text-xs text-stone-500">{user.email}</p>
              </div>
           )}
           
           <div className="grid grid-cols-2 gap-4">
              <Link onClick={() => setIsOpen(false)} to="/trending" className="flex flex-col items-center p-6 bg-stone-50 dark:bg-stone-800/50 rounded-3xl">
                <FiTrendingUp className="text-amber-500 mb-2" size={24} />
                <span className="text-xs font-bold uppercase tracking-widest">Trending</span>
              </Link>
              <Link onClick={() => setIsOpen(false)} to="/bookmarks" className="flex flex-col items-center p-6 bg-stone-50 dark:bg-stone-800/50 rounded-3xl">
                <FiBookmark className="text-blue-500 mb-2" size={24} />
                <span className="text-xs font-bold uppercase tracking-widest">Saves</span>
              </Link>
           </div>
           
           <div className="space-y-4">
              <Link onClick={() => setIsOpen(false)} to="/create" className="flex items-center justify-between p-5 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-3xl font-bold">
                <span>Write a Blog</span>
                <FiPlusSquare />
              </Link>
              <Link onClick={() => setIsOpen(false)} to="/admin" className="flex items-center justify-between p-5 border border-stone-200 dark:border-stone-800 rounded-3xl font-bold">
                <span>Dashboard</span>
                <FiGrid />
              </Link>
              {user && (
                <button 
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center justify-between p-5 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 rounded-3xl font-bold hover:bg-red-50 dark:hover:bg-red-950/30"
                >
                  <span>Logout</span>
                  <FiLogOut />
                </button>
              )}
           </div>
        </div>
      )}
    </nav>
  );
}
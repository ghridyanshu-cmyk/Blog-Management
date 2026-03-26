import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import BlogDetails from "./pages/BlogDetails";
import CreateBlog from "./pages/CreateBlog";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CustomCursor from "./components/CustomCursor";

const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/blog/:id" element={<PageTransition><BlogDetails /></PageTransition>} />
        <Route path="/create" element={<PageTransition><CreateBlog /></PageTransition>} />
        <Route path="/admin" element={<PageTransition><AdminDashboard /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      {/* Global Elements */}
      <CustomCursor />
      
      {/* 2. THE LIQUID BACKGROUND BLOBS (Added back for you) */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-stone-50 dark:bg-stone-950 transition-colors duration-700">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-amber-200/20 dark:bg-amber-500/5 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-green-500/10 dark:bg-green-600/5 blur-[120px]"></div>
      </div>
      
      <div className="relative z-10 lg:cursor-none">
        <Navbar />
        <AnimatedRoutes />
      </div>
    </BrowserRouter>
  );
}

export default App;
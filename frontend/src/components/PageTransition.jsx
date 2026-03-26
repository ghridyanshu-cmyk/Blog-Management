import { motion } from "framer-motion";

const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} // Starts invisible and slightly down
      animate={{ opacity: 1, y: 0 }}   // Fades in and slides up to position
      exit={{ opacity: 0, y: -20 }}    // Fades out and slides up when leaving
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} // "Liquid" easing
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
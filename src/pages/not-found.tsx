import { Link } from "react-router-dom";
import { AlertCircle, Home } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-64px)] w-full flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card max-w-md w-full p-8 text-center space-y-6"
      >
        <div className="flex justify-center">
          <div className="p-4 bg-rose-500/10 rounded-full">
            <AlertCircle className="h-12 w-12 text-rose-500" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">404</h1>
          <p className="text-secondary">The page you're looking for was lost in the cloud.</p>
        </div>

        <Link 
          to="/" 
          className="primary w-full inline-flex items-center justify-center gap-2 py-3"
        >
          <Home className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </motion.div>
    </div>
  );
}

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { Navbar } from './components/Navbar';
import Home from './pages/Home';
import IPv4Page from './pages/IPv4Page';
import IPv6Page from './pages/IPv6Page';
import NotFound from './pages/not-found';
import { AnimatePresence } from 'framer-motion';

function App() {
  return (
    <TooltipProvider>
      <Router>
        <div className="min-h-screen bg-dark-bg text-dark-text pt-16 selection:bg-primary/30 selection:text-white">
          <Navbar />
          <main className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/ipv4" element={<IPv4Page />} />
                <Route path="/ipv6" element={<IPv6Page />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AnimatePresence>
          </main>
          <Toaster />
        </div>
      </Router>
    </TooltipProvider>
  );
}

export default App;

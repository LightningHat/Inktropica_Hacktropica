import { Route, Routes } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import About from "./components/About";
import Features from "./components/Features";
import Contact from "./components/Contact";
import Dashboard from "./components/Dashboard";
import ClerkAuth from "./components/ClerkAuth";
import HandwritingApp from "./components/HandwritingApp";
import HandwritingCollection from "./components/HandwritingCollection";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/auth" element={<ClerkAuth />} />
        <Route path="/try-now" element={<HandwritingApp />} />
        <Route path="/handwriting-collection" element={<HandwritingCollection />} />

        {/* Protect Dashboard Route */}
        <Route
          path="/dashboard"
          element={
            <SignedIn>
              <Dashboard />
            </SignedIn>
          }
        />
        <Route
          path="*"
          element={
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          }
        />
      </Routes>
    </div>
  );
}

export default App;

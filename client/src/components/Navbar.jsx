import { Link } from "react-router-dom";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";

function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo linked to Home */}
        <Link to="/" className="text-2xl font-bold hover:text-gray-200">
          Inktropica
        </Link>
        <div className="space-x-4">
          <Link to="/" className="hover:text-gray-200">Home</Link>
          <Link to="/about" className="hover:text-gray-200">About</Link>
          <Link to="/features" className="hover:text-gray-200">Features</Link>
          <Link to="/contact" className="hover:text-gray-200">Contact</Link>

          {/* Show User Button when signed in */}
          <SignedIn>
            <Link to="/dashboard" className="hover:text-gray-200">Dashboard</Link>
            <UserButton />
          </SignedIn>

          {/* Show Login Button when signed out */}
          <SignedOut>
            <Link to="/auth" className="hover:text-gray-200">Login</Link>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

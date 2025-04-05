import { Link } from "react-router-dom";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";

function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Inktropica</h1>
        <div className="space-x-4">
          <Link to="/" className="hover:text-gray-300">Home</Link>
          <Link to="/about" className="hover:text-gray-300">About</Link>
          <Link to="/features" className="hover:text-gray-300">Features</Link>
          <Link to="/contact" className="hover:text-gray-300">Contact</Link>

          {/* Show User Button when signed in */}
          <SignedIn>
            <Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link>
            <UserButton />
          </SignedIn>

          {/* Show Login Button when signed out */}
          <SignedOut>
            <Link to="/auth" className="hover:text-gray-300">Login</Link>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

import { SignIn, SignUp } from "@clerk/clerk-react";
import { useState } from "react";

function ClerkAuth() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold mb-4">{isSignUp ? "Sign Up" : "Sign In"}</h2>
      {isSignUp ? <SignUp /> : <SignIn />}
      <button
        className="mt-4 text-blue-600 underline"
        onClick={() => setIsSignUp(!isSignUp)}
      >
        {isSignUp ? "Already have an account? Sign In" : "New user? Sign Up"}
      </button>
    </div>
  );
}

export default ClerkAuth;

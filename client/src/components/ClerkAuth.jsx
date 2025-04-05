import { SignIn, SignUp, useSignUp } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import axios from "axios";

function ClerkAuth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const { isLoaded, signUp } = useSignUp();

  useEffect(() => {
    if (isLoaded && signUp?.status === "complete") {
      handleSignUpSuccess(signUp.user);
    }
  }, [isLoaded, signUp]);

  const handleSignUpSuccess = async (user) => {
    console.log("Sign-up successful, user data:", user); // Debugging log
    try {
      const apiUrl = "https://dou6j6nbx0.execute-api.ap-south-1.amazonaws.com/prod/Saveuser"; // Replace with your API Gateway URL
      const userData = {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
      };
      console.log("Sending user data to API Gateway:", userData); // Debugging log
      const response = await axios.post(apiUrl, userData);
      console.log("API Gateway response:", response.data); // Debugging log
    } catch (error) {
      console.error("Error sending user data to API Gateway:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold mb-4">{isSignUp ? "Sign Up" : "Sign In"}</h2>
      {isSignUp ? (
        <SignUp />
      ) : (
        <SignIn />
      )}
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

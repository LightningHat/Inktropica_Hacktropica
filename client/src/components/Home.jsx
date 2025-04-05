import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      {/* Hero Section */}
      <header className="relative bg-gray-100 overflow-hidden">
        <div className="absolute inset-0">
          <video className="w-full h-full object-cover" autoPlay loop muted>
            <source src="/src/assets/34888306.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        <div className="relative z-10 container mx-auto text-center text-white py-20 px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Where AI Meets the Art of Handwriting
          </h1>
          <p className="text-lg md:text-xl mb-6">
            Transform typed text into your unique handwriting style with our
            AI-powered system.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/try-now"
              className="bg-indigo-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-indigo-700 transition-transform transform hover:-translate-y-1"
            >
              Try Now
            </Link>
            <a
              href="#how-it-works"
              className="bg-gray-700 text-white px-6 py-3 rounded-full shadow-lg hover:bg-gray-800 transition-transform transform hover:-translate-y-1"
            >
              Learn More
            </a>
          </div>
        </div>
        <div className="relative z-10 mt-10 flex justify-center">
          <img
            className="w-3/4 md:w-1/2 animate-float"
            src="images/hero-illustration.png"
            alt="Handwriting transformation illustration"
          />
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-10">What makes Inktropica unique?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-100 p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="text-indigo-600 text-4xl mb-4">
                <i className="fas fa-fingerprint"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Authentic Writing, Effortlessly</h3>
              <p className="text-gray-600">
                Transform digital text into handwritten authenticity with Inktropica. Your personal handwriting, seamlessly generated for notes, letters, and creative expression—preserving the art of writing in the digital age.
              </p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="text-indigo-600 text-4xl mb-4">
                <i className="fas fa-robot"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Synthesis</h3>
              <p className="text-gray-600">
                Our unique AI-powered handwriting synthesis ensures that your personal writing style is preserved digitally, allowing you to create handwritten notes, documents, and messages effortlessly—just as if you wrote them by hand.
              </p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="text-indigo-600 text-4xl mb-4">
                <i className="fas fa-user-edit"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Personalized for You</h3>
              <p className="text-gray-600">
                Inktropica adapts to your unique handwriting style, ensuring every generated text reflects your natural strokes, spacing, and flow—just like you wrote it yourself.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-100">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-10">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start space-x-4">
              <div className="bg-indigo-600 text-white w-12 h-12 flex items-center justify-center rounded-full font-bold">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Upload Your Handwriting</h3>
                <p className="text-gray-600">
                  Upload samples of your handwriting to train our AI model on your unique style.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-indigo-600 text-white w-12 h-12 flex items-center justify-center rounded-full font-bold">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
                <p className="text-gray-600">
                  Our AI analyzes stroke patterns, letter shapes, and spacing to generate a personalized handwriting model.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-indigo-600 text-white w-12 h-12 flex items-center justify-center rounded-full font-bold">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Enter Your Text</h3>
                <p className="text-gray-600">
                  Type the text you want to convert into your handwriting style.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-indigo-600 text-white w-12 h-12 flex items-center justify-center rounded-full font-bold">
                4
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Customize & Download</h3>
                <p className="text-gray-600">
                  Adjust stroke thickness, slant, and spacing before downloading your handwritten text.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-indigo-600 text-white text-center">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to transform your digital text?</h2>
          <p className="text-lg mb-6">
            Experience the perfect blend of technology and personal expression.
          </p>
          <a
            href="app.html"
            className="bg-white text-indigo-600 px-6 py-3 rounded-full shadow-lg hover:bg-gray-100 transition"
          >
          <Link
              to="/try-now"
              className="bg-indigo-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-indigo-700 transition-transform transform hover:-translate-y-1"
            >
              Try Inktropica Now
            </Link>
          </a>
        </div>
      </section>
    </div>
  );
}

export default Home;

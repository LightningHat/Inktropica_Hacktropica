function About() {
    return (
      <div className="text-center p-10">
        <h1 className="text-3xl font-semibold text-blue-600">About Inktropica</h1>
        <p className="mt-4 text-gray-700">
          Inktropica is an AI-powered platform that transforms your text into beautifully **handwritten documents**. 
          Whether it's for personal notes, creative projects, or professional presentations, Inktropica brings a 
          human touch to your digital content.
        </p>
        <h2 className="text-2xl font-medium text-blue-500 mt-8">Meet the Developers</h2>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex flex-col items-center">
            <img 
              src="path/to/developer1.jpg" 
              alt="Developer 1" 
              className="w-24 h-24 rounded-full object-cover"
            />
            <h3 className="text-xl font-semibold text-gray-800 mt-4">Developer 1</h3>
            <p className="text-gray-600 text-center">Specializes in front-end development and user experience design.</p>
          </div>
          <div className="flex flex-col items-center">
            <img 
              src="path/to/developer2.jpg" 
              alt="Developer 2" 
              className="w-24 h-24 rounded-full object-cover"
            />
            <h3 className="text-xl font-semibold text-gray-800 mt-4">Developer 2</h3>
            <p className="text-gray-600 text-center">Focuses on back-end development and database management.</p>
          </div>
          <div className="flex flex-col items-center">
            <img 
              src="path/to/developer3.jpg" 
              alt="Developer 3" 
              className="w-24 h-24 rounded-full object-cover"
            />
            <h3 className="text-xl font-semibold text-gray-800 mt-4">Developer 3</h3>
            <p className="text-gray-600 text-center">Expert in AI and machine learning, powering Inktropica's core features.</p>
          </div>
          <div className="flex flex-col items-center">
            <img 
              src="path/to/developer4.jpg" 
              alt="Developer 4" 
              className="w-24 h-24 rounded-full object-cover"
            />
            <h3 className="text-xl font-semibold text-gray-800 mt-4">Developer 4</h3>
            <p className="text-gray-600 text-center">Handles DevOps and ensures smooth deployment and scalability.</p>
          </div>
        </div>
      </div>
    );
}

export default About;

import React from 'react'
import Home from './Home'
import { Link } from 'react-router-dom'


function MainPage() {
  return (
    <div className="flex items-center justify-center h-screen flex-col bg-gray-200 py-8 px-4">
    <div className="text-center mb-8 p-4">
      <h1 className="text-4xl font-bold mb-2">AI Image Enhancer</h1>
      <p className="text-lg text-gray-600">Upload an image and get a better one</p>
    </div>
    <main>
      <Home />
    </main>
    <footer className="text-lg text-gray-600 text-center mt-3">
      <p>Powered by <span className="font-semibold">@Godcraft</span></p>
      <Link 
        to="/ai-gn" 
        className="inline-block bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 hover:shadow-lg transition-all duration-300"
      >
        Go to AI Logo Generator
      </Link>
    </footer>
  </div>
  )
}

export default MainPage
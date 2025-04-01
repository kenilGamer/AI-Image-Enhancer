import React from 'react'
import Home from './Home'

function MainPage() {
  return (
    <div className="flex items-center justify-center h-screen flex-col bg-gray-200 py-8 px-4">
    <header className="text-center mb-8 p-4">
      <h1 className="text-4xl font-bold mb-2">AI Image Enhancer</h1>
      <p className="text-lg text-gray-600">Upload an image and get a better one</p>
    </header>
    <main>
      <Home />
    </main>
    <footer className="text-lg text-gray-600 text-center mt-3">
      <p>Powered by <span className="font-semibold">@Godcraft</span></p>
    </footer>
  </div>
  )
}

export default MainPage
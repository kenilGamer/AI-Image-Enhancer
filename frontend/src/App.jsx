import React from 'react';
import Home from './components/Home';
import { Route, Routes } from 'react-router-dom';
import MainPage from './components/MainPage';
import ImageGenerator from './components/ImageGenerator';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/ai-gn" element={<ImageGenerator/>} />
    </Routes>
  );
}

export default App;
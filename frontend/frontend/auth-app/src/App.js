import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import ImageUploader from './components/ImageUploader'; // Assuming ImageUploader is inside components

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/upload" element={<ImageUploader />} /> {/* Add route for ImageUploader */}
      </Routes>
    </Router>
  );
}

export default App;


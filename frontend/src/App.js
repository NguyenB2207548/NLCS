import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './Pages/Home/Home'
import DetailCar from './Pages/Details/DetailCar';

function App() {
  return (
    <div className="container">
      <header>
        <Header />
      </header>

      <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/car/:id" element={<DetailCar />} /> 
          </Routes>
      </main>

      <footer>

      </footer>
    </div>
  );
}

export default App;

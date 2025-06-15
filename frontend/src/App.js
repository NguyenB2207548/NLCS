import React from 'react';
import { Container } from 'react-bootstrap';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './Pages/Home/Home'
import Footer from './components/Footer/Footer';
import CarDetail from './Pages/Details/CarDetail';
import AddCar from './Pages/AddCar/AddCar';
import Profile from './Pages/Profile/Profile';

function App() {
  return (
   <Container fluid>
      <header >
        <Header />
      </header>

      <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/car/:id" element={<CarDetail />} /> 
            <Route path="/car/addCar" element={<AddCar />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
      </main>

      <footer>
        <Footer />
      </footer>
    </Container>
  );
}

export default App;

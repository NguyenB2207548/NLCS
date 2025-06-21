import React from 'react';
import { Container } from 'react-bootstrap';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './Pages/Home/Home'
import Footer from './components/Footer/Footer';
import CarDetail from './Pages/Details/CarDetail';
import AddCar from './Pages/AddCar/AddCar';
import Profile from './Pages/Profile/Profile';
import CreateRental from './Pages/Rental/Rental';
import RentalHistory from './Pages/RentalHistory/RentalHistory';
import AdminPage from './Pages/Admin/AdminPage';
import Users from './Pages/Admin/Users';
import Cars from './Pages/Admin/Cars';
import Contracts from './Pages/Admin/Contracts';
import Dashboard from './Pages/Admin/Dashboard'

function App() {
  return (
    <Container fluid>
      <header >
        <Header />
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/car/detail/:id" element={<CarDetail />} />
          <Route path="/car/addCar" element={<AddCar />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/rental/:id" element={<CreateRental />} />
          <Route path="/rental/history" element={<RentalHistory />} />

          <Route path="/admin" element={<AdminPage />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="cars" element={<Cars />} />
            <Route path="contracts" element={<Contracts />} />
          </Route>

        </Routes>
      </main>

      <footer>
        <Footer />
      </footer>
    </Container>
  );
}

export default App;

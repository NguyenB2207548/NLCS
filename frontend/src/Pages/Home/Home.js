import React from "react";
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import './Home.css'
import CarList from '../../components/CarList'


const Home = () => {
    return (
        <CarList />
    );
}

export default Home;
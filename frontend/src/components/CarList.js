import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';


const CarList = () => {
    const [cars, setCars] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/car')
            .then((response) => response.json())
            .then((data) => setCars(data))
            .catch((error) => console.error('Fetch error:', error));
    }, []);

    return (
        <Container className="py-4 list-cars">
            <h2 className="mb-4 fw-bold text-center text-light">Danh sách xe</h2>
            <Row>
                {cars.map((car) => (
                    <Col key={car.carID} xs={12} sm={6} md={3} className="mb-4">
                        <Card className="h-100 shadow-sm">
                            {/* <Card.Img variant="top" src={car.image} /> */}
                            <Card.Body>
                                <Card.Title>{car.carname}</Card.Title>
                                <Card.Text>
                                    Giá thuê: <strong>{car.price_per_date.toLocaleString()}đ/ngày</strong>
                                </Card.Text>
                                <Button variant="primary" className="w-100" as={Link} to={`/car/${car.carID}`}>Xem chi tiết</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default CarList;

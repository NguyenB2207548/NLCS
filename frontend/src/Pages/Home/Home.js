import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import './Home.css'
import CarList from '../../components/CarList'
import { Button, Form } from 'react-bootstrap';

const Home = () => {
    const [location, setLocation] = useState('');
    const [seat, setSeat] = useState('');
    const [brand, setBrand] = useState('');
    const [filters, setFilters] = useState({});

    const handleSearch = () => {
        setFilters({
            location,
            seat,
            brand
        });
    };

    const locationState = useLocation();

    useEffect(() => {
        if (locationState.state?.reset) {
            setLocation('');
            setSeat('');
            setBrand('');
            setFilters({});

            window.history.replaceState({}, document.title);

        }
    }, [locationState]);

    return (
        <div>
            <Form className="d-flex justify-content-center align-items-center gap-3 py-3 bg-light rounded-4 shadow-sm mb-3 mx-auto">
                <Form.Select
                    className="select-filter"
                    aria-label="Vị trí"
                    style={{ maxWidth: '200px' }}
                    onChange={(e) => setLocation(e.target.value)}
                    value={location}
                >
                    <option value="">Tất cả vị trí</option>
                    <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                    <option value="Hà Nội">Hà Nội</option>
                    <option value="Đà Nẵng">Đà Nẵng</option>
                </Form.Select>

                <Form.Select
                    className="select-filter"
                    aria-label="Số chỗ"
                    style={{ maxWidth: '150px' }}
                    onChange={(e) => setSeat(e.target.value)}
                    value={seat}
                >
                    <option value="">Tất cả số chỗ</option>
                    <option value="4">4 chỗ</option>
                    <option value="5">5 chỗ</option>
                    <option value="7">7 chỗ</option>
                </Form.Select>

                <Form.Select
                    className="select-filter"
                    aria-label="Hãng xe"
                    style={{ maxWidth: '150px' }}
                    onChange={(e) => setBrand(e.target.value)}
                    value={brand}
                >
                    <option value="">Tất cả hãng</option>
                    <option value="Toyota">Toyota</option>
                    <option value="BMW">BMW</option>
                    <option value="Kia">Kia</option>
                </Form.Select>

                <Button className="button-timkiem" onClick={handleSearch}>
                    Tìm kiếm
                </Button>
            </Form>

            <CarList filters={filters} />
        </div>
    );
};

export default Home;

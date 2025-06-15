import React from "react";
import './Home.css'
import CarList from '../../components/CarList'
import { Modal, Button, Form } from 'react-bootstrap';

const Home = () => {
    return (
        <div>
            <Form className="d-flex justify-content-center align-items-center gap-3 py-3 bg-light rounded-4 shadow-sm mb-3 mx-auto">
                <Form.Select aria-label="Vị trí" style={{ maxWidth: '200px' }}>
                    <option>Tất cả vị trí</option>
                    <option value="HCM">Hồ Chí Minh</option>
                    <option value="HN">Hà Nội</option>
                    <option value="DN">Đà Nẵng</option>
                </Form.Select>

                <Form.Select aria-label="Số chỗ" style={{ maxWidth: '150px' }}>
                    <option>Tất cả số chỗ</option>
                    <option value="4">4 chỗ</option>
                    <option value="5">5 chỗ</option>
                    <option value="7">7 chỗ</option>
                </Form.Select>

                <Form.Select aria-label="Hãng xe" style={{ maxWidth: '150px' }}>
                    <option>Tất cả hãng</option>
                    <option value="Toyota">Toyota</option>
                    <option value="BMW">BMW</option>
                    <option value="Kia">Kia</option>
                </Form.Select>

                <Button className="button-timkiem">Tìm kiếm</Button>
            </Form>

            <CarList />
        </div>
    );
}

export default Home;
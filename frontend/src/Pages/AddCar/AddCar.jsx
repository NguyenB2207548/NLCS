import React, { useState, useRef, useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

const AddCar = () => {
    const [brands, setBrands] = useState([]);
    const [formData, setFormData] = useState({
        carname: '',
        license_plate: '',
        year_manufacture: '',
        seats: '',
        fuel_type: '',
        pickup_location: '',
        price_per_date: '',
        brandID: ''
    });

    const [mainImage, setMainImage] = useState(null);
    const [subImages, setSubImages] = useState([]);
    const mainImageRef = useRef(null);
    const subImagesRef = useRef(null);

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const res = await fetch('http://localhost:3000/brand/getAll');
                const data = await res.json();
                setBrands(data);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách hãng xe:', error);
            }
        };
        fetchBrands();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleMainImageChange = (e) => {
        setMainImage(e.target.files[0]);
    };

    const handleSubImagesChange = (e) => {
        const newFiles = Array.from(e.target.files);
        setSubImages(prev => [...prev, ...newFiles]); 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!mainImage) {
            alert('Vui lòng chọn ảnh chính');
            return;
        }

        const token = localStorage.getItem('token');
        const data = new FormData();

        // Append text fields
        Object.entries(formData).forEach(([key, value]) => {
            data.append(key, value);
        });

        // Append images
        data.append('main_image', mainImage);
        subImages.forEach((img) => {
            data.append('sub_images', img);
        });

        try {
            const res = await fetch('http://localhost:3000/car/addCar', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: data
            });

            const result = await res.json();
            if (res.ok) {
                alert(result.message || 'Thêm xe thành công');

                // Reset form
                setFormData({
                    carname: '',
                    license_plate: '',
                    year_manufacture: '',
                    seats: '',
                    fuel_type: '',
                    pickup_location: '',
                    price_per_date: '',
                    brandID: ''
                });
                setMainImage(null);
                setSubImages([]);
                mainImageRef.current.value = '';
                subImagesRef.current.value = '';
            } else {
                alert(result.message || 'Lỗi khi thêm xe');
            }
        } catch (error) {
            console.error('Lỗi khi gửi dữ liệu:', error);
            alert('Lỗi kết nối đến máy chủ');
        }
    };

    return (
        <Container className="my-4 p-4 bg-light rounded-4 shadow-sm">
            <h2 className="mb-4 text-center fw-bold">Đăng Xe Cho Thuê</h2>
            <Form onSubmit={handleSubmit} encType="multipart/form-data">
                {/* Các trường thông tin xe */}
                <Row className="mb-3">
                    <Col>
                        <Form.Label>Tên xe</Form.Label>
                        <Form.Control type="text" name="carname" onChange={handleChange} value={formData.carname} required />
                    </Col>
                    <Col>
                        <Form.Label>Biển số</Form.Label>
                        <Form.Control type="text" name="license_plate" onChange={handleChange} value={formData.license_plate} required />
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col>
                        <Form.Label>Số chỗ</Form.Label>
                        <Form.Select name="seats" onChange={handleChange} value={formData.seats} required>
                            <option value="">Chọn số chỗ</option>
                            <option value="4">4 chỗ</option>
                            <option value="5">5 chỗ</option>
                            <option value="7">7 chỗ</option>
                            <option value="9">9 chỗ</option>
                            <option value="16">16 chỗ</option>
                        </Form.Select>
                    </Col>
                    <Col>
                        <Form.Label>Năm sản xuất</Form.Label>
                        <Form.Control type="number" name="year_manufacture" onChange={handleChange} value={formData.year_manufacture} required />
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col>
                        <Form.Label>Loại nhiên liệu</Form.Label>
                        <Form.Select name="fuel_type" onChange={handleChange} value={formData.fuel_type} required>
                            <option value="">Chọn nhiên liệu</option>
                            <option value="Xăng">Xăng</option>
                            <option value="Dầu">Dầu</option>
                            <option value="Điện">Điện</option>
                        </Form.Select>
                    </Col>
                    <Col>
                        <Form.Label>Vị trí nhận xe</Form.Label>
                        <Form.Control type="text" name="pickup_location" onChange={handleChange} value={formData.pickup_location} required />
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col>
                        <Form.Label>Giá thuê/ngày (VNĐ)</Form.Label>
                        <Form.Control type="number" name="price_per_date" onChange={handleChange} value={formData.price_per_date} required />
                    </Col>
                    <Col>
                        <Form.Label>Hãng xe</Form.Label>
                        <Form.Select name="brandID" onChange={handleChange} value={formData.brandID} required>
                            <option value="">Chọn hãng xe</option>
                            {brands.map(brand => (
                                <option key={brand.brandID} value={brand.brandID}>{brand.brandname}</option>
                            ))}
                        </Form.Select>
                    </Col>
                </Row>

                {/* Hình ảnh */}
                <Row className="mb-3">
                    <Col>
                        <Form.Label>Ảnh chính</Form.Label>
                        <Form.Control type="file" accept="image/*" onChange={handleMainImageChange} ref={mainImageRef} required />
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col>
                        <Form.Label>Ảnh phụ (nhiều ảnh)</Form.Label>
                        <Form.Control type="file" accept="image/*" multiple onChange={handleSubImagesChange} ref={subImagesRef} />
                    </Col>
                </Row>

                <Button type="submit" className="mt-3 w-100 button-timkiem">Đăng xe</Button>
            </Form>
        </Container>
    );
};

export default AddCar;

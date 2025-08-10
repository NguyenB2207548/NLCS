import React, { useEffect, useState } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';

const UserProfile = () => {
    const [formData, setFormData] = useState({});
    const [showEditModal, setShowEditModal] = useState(false);

    const fetchUser = () => {
        const token = localStorage.getItem('token');
        const decode = jwtDecode(token);
        const id = decode.id;

        fetch(`http://localhost:3000/user/${id}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                const formattedData = {
                    ...data,
                    date_of_birth: new Date(data.date_of_birth).toISOString().split('T')[0],
                };
                setFormData(formattedData);
            })
            .catch((err) => console.error('Lỗi khi gọi API:', err));
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        const token = localStorage.getItem('token');

        fetch(`http://localhost:3000/user/update`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        })
            .then(res => res.json())
            .then(data => {
                if (data.message === 'Chỉnh sửa thành công') {
                    alert('Cập nhật thành công');
                    setShowEditModal(false);
                } else {
                    alert('Cập nhật thất bại: ' + (data.message || 'Đã có lỗi xảy ra'));
                }
            })
            .catch(err => {
                console.error('Lỗi khi cập nhật:', err);
                alert('Lỗi khi cập nhật thông tin');
            });
    };

    return (
        <Card className="p-4 shadow-sm w-75 mx-auto mt-4">
            <h3 className="mb-4 text-center">Hồ sơ người dùng</h3>

            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Họ tên</Form.Label>
                    <Form.Control
                        type="text"
                        name="fullname"
                        value={formData.fullname || ''}
                        onChange={handleChange}
                        readOnly={!showEditModal}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Số điện thoại</Form.Label>
                    <Form.Control
                        type="text"
                        name="phone_number"
                        value={formData.phone_number || ''}
                        onChange={handleChange}
                        readOnly={!showEditModal}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Ngày sinh</Form.Label>
                    <Form.Control
                        type="date"
                        name="date_of_birth"
                        value={formData.date_of_birth || ''}
                        onChange={handleChange}
                        readOnly={!showEditModal}
                    />
                </Form.Group>

                <div className="text-center">
                    {!showEditModal ? (
                        <Button onClick={() => setShowEditModal(true)}>Chỉnh sửa</Button>
                    ) : (
                        <Button onClick={handleSave}>Lưu thay đổi</Button>
                    )}
                </div>
            </Form>

        </Card>
    );
};

export default UserProfile;

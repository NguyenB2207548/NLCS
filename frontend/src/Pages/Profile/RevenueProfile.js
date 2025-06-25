import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

const RevenueProfile = () => {
    const [revenueStats, setRevenueStats] = useState({ monthly: [] });

    const fetchRevenueStats = () => {
        const token = localStorage.getItem('token');
        fetch(`http://localhost:3000/stats/revenueByMonth`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => res.json())
            .then((data) => {
                const now = new Date();
                const currentYear = now.getFullYear();
                const currentMonth = now.getMonth() + 1;

                const months = Array.from({ length: currentMonth }, (_, i) => {
                    const m = i + 1;
                    const monthStr = `${currentYear}-${m.toString().padStart(2, "0")}`;
                    return { month: monthStr, totalRevenue: 0 };
                });

                const merged = months.map(m => {
                    const found = data.find(d => d.month === m.month);
                    return {
                        month: m.month,
                        totalRevenue: found ? found.totalRevenue : 0
                    };
                });

                setRevenueStats({ monthly: merged });
            })
            .catch(err => {
                console.error('Lỗi khi thống kê doanh thu:', err);
            });
    };

    useEffect(() => {
        fetchRevenueStats();
    }, []);

    const totalRevenue = revenueStats.monthly.reduce(
        (sum, item) => sum + (item.totalRevenue || 0),
        0
    );

    return (
        <div className="p-4">
            <h6 className="fw-bold mt-4">Biểu đồ doanh thu</h6>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    data={revenueStats.monthly}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${Number(value).toLocaleString()} ₫`} />
                    <Bar dataKey="totalRevenue" fill="#4caf50" />
                </BarChart>
            </ResponsiveContainer>

            <div className="mb-4 mt-4">
                <h5 className="fw-bold mb-3">Tổng doanh thu</h5>
                <p className="fs-5 text-success fw-semibold">
                    {totalRevenue.toLocaleString()} ₫
                </p>
            </div>

            <h6 className="fw-bold mt-4">Doanh thu theo tháng</h6>
            <Table striped bordered hover className="mt-2">
                <thead>
                    <tr>
                        <th>Tháng</th>
                        <th>Tổng doanh thu</th>
                    </tr>
                </thead>
                <tbody>
                    {revenueStats.monthly.map((item, index) => (
                        <tr key={index}>
                            <td>{item.month}</td>
                            <td>{item.totalRevenue.toLocaleString()} ₫</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default RevenueProfile;

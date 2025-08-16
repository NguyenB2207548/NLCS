import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";

const StatRevenue = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Gọi API backend để lấy dữ liệu doanh thu theo tháng
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:3000/pay/revenue");
        const json = await res.json();

        // Chuyển đổi revenue từ VNĐ -> triệu đồng
        const formatted = json.map((item) => ({
          month: item.month,
          revenueVND: item.revenue, // giữ nguyên VNĐ cho bảng
          revenue: item.revenue / 1_000_000, // chuyển sang triệu đồng cho chart
        }));

        setData(formatted);
      } catch (err) {
        console.error("Error fetching revenue stats:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div style={{ width: "100%", padding: "20px" }}>
      <h3 style={{ textAlign: "center", marginBottom: "20px" }}>
        Thống kê doanh thu theo tháng
      </h3>

      {/* Biểu đồ */}
      <div style={{ width: "100%", height: 400 }}>
        <h5 style={{ textAlign: "center" }}>
          Biểu đồ doanh thu (Đơn vị: triệu đồng)
        </h5>
        <ResponsiveContainer>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis
              tickFormatter={(value) => value.toFixed(0)}
              label={{
                value: "Triệu đồng",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip
              formatter={(value) => [
                `${Number(value).toFixed(2)} triệu`,
                "Doanh thu",
              ]}
            />
            <Legend />
            <Bar dataKey="revenue" fill="#82ca9d" name="Doanh thu (triệu)">
              <LabelList
                dataKey="revenue"
                position="top"
                formatter={(val) => Number(val).toFixed(2)}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Bảng dữ liệu */}
      <div className="mt-4">
        <h5>Bảng dữ liệu chi tiết</h5>
        <table className="table table-bordered table-striped mt-2">
          <thead>
            <tr>
              <th>Tháng</th>
              <th>Doanh thu (VNĐ)</th>
              <th>Doanh thu (Triệu đồng)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr key={idx}>
                <td>{item.month}</td>
                <td>
                  {new Intl.NumberFormat("vi-VN").format(item.revenueVND)}
                </td>
                <td>{item.revenue.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StatRevenue;

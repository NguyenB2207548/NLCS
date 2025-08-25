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

const StatContract = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:3000/admin/contract/stat");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Error fetching contracts stats:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div style={{ width: "100%", padding: "20px" }}>
      <h3 style={{ textAlign: "center", marginBottom: "20px" }}>
        Thống kê số lượng hợp đồng theo tháng
      </h3>

      {/* Biểu đồ */}
      <div style={{ width: "100%", height: 400 }}>
        <ResponsiveContainer>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="contracts" fill="#043c78" name="Số hợp đồng">
              {/* số liệu bên trên cột */}
              <LabelList dataKey="contracts" position="top" />
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
              <th>Số hợp đồng</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr key={idx}>
                <td>{item.month}</td>
                <td>{item.contracts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StatContract;

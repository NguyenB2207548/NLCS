import React, { useEffect, useState } from 'react';
import { Table, Button, Container } from 'react-bootstrap';

const Contracts = () => {
  const [contracts, setContracts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/admin/contract/getAllContract', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => setContracts(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <Container className="mt-4">
      <h3 className="mb-3">Quản lý hợp đồng</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Người thuê</th>
            <th>Tên xe</th>
            <th>Thời gian</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {contracts.map(contract => (
            <tr key={contract.contractID}>
              <td>{contract.contractID}</td>
              <td>{contract.fullname}</td>
              <td>{contract.carname}</td>
              <td>{new Date(contract.rental_start_date).toLocaleDateString()} - {new Date(contract.rental_end_date).toLocaleDateString()}</td>
              <td>{contract.total_price.toLocaleString()}</td>
              <td>{contract.contract_status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Contracts;
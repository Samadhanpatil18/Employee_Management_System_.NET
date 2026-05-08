import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import { employeeAPI } from '../services/employeeService';
import '../styles/EmployeeList.css';
import Swal from 'sweetalert2';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    salary: '',
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch all employees
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await employeeAPI.getAll();
      if (response.data.success) {
        setEmployees(response.data.data || []);
      }
    } catch (err) {
      setError('Failed to fetch employees. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Open modal for creating new employee
  const handleShowCreateModal = () => {
    setIsEditing(false);
    setFormData({ name: '', department: '', salary: '' });
    setEditingId(null);
    setShowModal(true);
  };

  // Open modal for editing employee
  const handleShowEditModal = (employee) => {
    setIsEditing(true);
    setFormData({
      name: employee.name,
      department: employee.department,
      salary: employee.salary,
    });
    setEditingId(employee.id);
    setShowModal(true);
  };

  // Handle form submission (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      if (isEditing) {
        // Update employee
        const response = await employeeAPI.update(editingId, formData);
        if (response.data.success) {
          setSuccess('Employee updated successfully!');
          fetchEmployees();
        }
      } else {
        // Create new employee
        const response = await employeeAPI.create(formData);
        if (response.data.success) {
          setSuccess('Employee created successfully!');
          fetchEmployees();
        }
      }
      setShowModal(false);
      setFormData({ name: '', department: '', salary: '' });
    } catch (err) {
      setError(isEditing ? 'Failed to update employee.' : 'Failed to create employee.');
      console.error(err);
    }
  };

  // Handle delete employee
const handleDelete = async (id) => {

  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'You want to delete this employee?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!'
  });

  if (result.isConfirmed) {

    setError(null);
    setSuccess(null);

    try {
      const response = await employeeAPI.delete(id);

      if (response.data.success) {

        Swal.fire({
          title: 'Deleted!',
          text: 'Employee deleted successfully.',
          icon: 'success'
        });

        fetchEmployees();
      }

    } catch (err) {

      Swal.fire({
        title: 'Error!',
        text: 'Failed to delete employee.',
        icon: 'error'
      });

      console.error(err);
    }
  }
};

  return (
    <Container className="employee-list-container">
      <h1 className="mb-4 mt-4">Employee Management System</h1>

      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess(null)} dismissible>{success}</Alert>}

      <div className="button-group mb-3">
        <Button variant="primary" onClick={handleShowCreateModal}>
          + Add New Employee
        </Button>
        <Button variant="secondary" onClick={fetchEmployees} className="ms-2">
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="spinner-container">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : employees.length > 0 ? (
        <div className="table-responsive">
          <Table striped bordered hover className="employee-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Salary</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id}>
                  <td>{employee.id}</td>
                  <td>{employee.name}</td>
                  <td>{employee.department}</td>
                  <td>${employee.salary.toFixed(2)}</td>
                  <td>
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => handleShowEditModal(employee)}
                      className="me-2"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(employee.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : (
        <Alert variant="info">No employees found. Create one to get started!</Alert>
      )}

      {/* Create/Edit Employee Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Edit Employee' : 'Create New Employee'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter employee name"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Department</Form.Label>
              <Form.Control
                type="text"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                placeholder="Enter department"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Salary</Form.Label>
              <Form.Control
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleInputChange}
                placeholder="Enter salary"
                step="0.01"
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              {isEditing ? 'Update Employee' : 'Create Employee'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default EmployeeList;

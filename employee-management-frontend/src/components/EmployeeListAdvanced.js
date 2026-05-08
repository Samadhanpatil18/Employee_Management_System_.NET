import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Alert, Spinner, Row, Col, Card } from 'react-bootstrap';
import { employeeAPI } from '../services/employeeService';
import '../styles/EmployeeListAdvanced.css';

const EmployeeListAdvanced = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
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

  // Filter and sort employees
  const getProcessedEmployees = () => {
    let filtered = employees.filter(emp =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'salary') {
        return a.salary - b.salary;
      } else if (sortBy === 'department') {
        return a.department.localeCompare(b.department);
      }
      return 0;
    });
  };

  // Calculate statistics
  const calculateStats = () => {
    if (employees.length === 0) return { total: 0, avgSalary: 0, maxSalary: 0 };

    const totalSalary = employees.reduce((sum, emp) => sum + emp.salary, 0);
    const avgSalary = totalSalary / employees.length;
    const maxSalary = Math.max(...employees.map(emp => emp.salary));

    return {
      total: employees.length,
      avgSalary: avgSalary.toFixed(2),
      maxSalary: maxSalary.toFixed(2),
    };
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
        const response = await employeeAPI.update(editingId, formData);
        if (response.data.success) {
          setSuccess('Employee updated successfully!');
          fetchEmployees();
        }
      } else {
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

//   // Handle delete employee
//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this employee?')) {
//       setError(null);
//       setSuccess(null);
//       try {
//         const response = await employeeAPI.delete(id);
//         if (response.data.success) {
//           setSuccess('Employee deleted successfully!');
//           fetchEmployees();
//         }
//       } catch (err) {
//         setError('Failed to delete employee.');
//         console.error(err);
//       }
//     }
//   };

  const stats = calculateStats();
  const processedEmployees = getProcessedEmployees();

  return (
    <Container className="employee-list-advanced-container">
      <h1 className="mb-4 mt-4">Advanced Employee Management</h1>

      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess(null)} dismissible>{success}</Alert>}

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col md={3} sm={6} className="mb-3">
          <Card className="stat-card">
            <Card.Body>
              <Card.Title>Total Employees</Card.Title>
              <div className="stat-value">{stats.total}</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Card className="stat-card">
            <Card.Body>
              <Card.Title>Average Salary</Card.Title>
              <div className="stat-value">${stats.avgSalary}</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Card className="stat-card">
            <Card.Body>
              <Card.Title>Max Salary</Card.Title>
              <div className="stat-value">${stats.maxSalary}</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Card className="stat-card">
            <Card.Body>
              <Card.Title>Actions</Card.Title>
              <Button variant="primary" onClick={handleShowCreateModal} className="w-100">
                + Add Employee
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Search and Filter */}
      <Row className="mb-3">
        <Col md={8}>
          <Form.Control
            placeholder="Search by name or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col md={4}>
          <Form.Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="name">Sort by Name</option>
            <option value="salary">Sort by Salary</option>
            <option value="department">Sort by Department</option>
          </Form.Select>
        </Col>
      </Row>

      {/* Employees Table */}
      {loading ? (
        <div className="spinner-container">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : processedEmployees.length > 0 ? (
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
              {processedEmployees.map((employee) => (
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
        <Alert variant="info">
          {employees.length === 0 ? 'No employees found. Create one to get started!' : 'No employees match your search.'}
        </Alert>
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

export default EmployeeListAdvanced;

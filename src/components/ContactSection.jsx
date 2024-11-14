import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, FloatingLabel, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form submission logic here
    if (formData.name && formData.email && formData.phone && formData.message) {
      setSuccessMessage('Form submission successful!');
      setErrorMessage('');
    } else {
      setErrorMessage('Error sending message! Please fill out all fields.');
      setSuccessMessage('');
    }
  };

  return (
    <section className="bg-light py-5">
      <Container className="my-5 px-5">
        <div className="text-center mb-5">
          <div className="feature bg-primary bg-gradient text-white rounded-3 mb-3">
            <i className="bi bi-envelope"></i>
          </div>
          <h2 className="fw-bolder">Get in touch</h2>
          <p className="lead mb-0">We'd love to hear from you</p>
        </div>
        <Row className="justify-content-center">
          <Col lg={6}>
            {successMessage && <Alert variant="success">{successMessage}</Alert>}
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
            <Form onSubmit={handleSubmit}>
              <FloatingLabel controlId="name" label="Full name" className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Enter your name..."
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </FloatingLabel>
              <FloatingLabel controlId="email" label="Email address" className="mb-3">
                <Form.Control
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </FloatingLabel>
              <FloatingLabel controlId="phone" label="Phone number" className="mb-3">
                <Form.Control
                  type="tel"
                  placeholder="(123) 456-7890"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </FloatingLabel>
              <FloatingLabel controlId="message" label="Message" className="mb-3">
                <Form.Control
                  as="textarea"
                  placeholder="Enter your message here..."
                  style={{ height: '10rem' }}
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </FloatingLabel>
              <div className="d-grid">
                <Button type="submit" variant="primary" size="lg">
                  Submit
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </section>
  );
};


export default ContactSection;
